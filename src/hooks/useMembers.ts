import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useAuditLog } from './useAuditLog';
import { generateMembershipNumber } from '@/lib/membershipUtils';

interface Member {
  id: string;
  membershipNumber: string;
  name: string;
  email: string;
  phone?: string;
  idNumber?: string;
  address?: string;
  role: string;
  province: string;
  branch: string;
  vd?: string;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  notes?: string;
}

interface SearchFilters {
  query: string;
  status: string;
  role: string;
  province: string;
  branch: string;
}

export const useMembers = () => {
  const { profile } = useAuth();
  const { createLog } = useAuditLog();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = useCallback(async (filters?: SearchFilters) => {
    if (!profile) return;

    setLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false });

      // Role-based security filters
      switch (profile.role) {
        case 'province':
          query = query.eq('province', profile.province);
          break;
        case 'region':
          query = query.eq('region', profile.region);
          break;
        case 'branch':
          query = query.eq('branch', profile.branch);
          break;
        case 'vd':
          query = query.eq('vd', profile.vd);
          break;
        // National and member (if member can see others) have no location filters
        case 'national':
        case 'member':
        default:
          break;
      }

      // User-applied search filters
      if (filters?.query) {
        query = query.or(`name.ilike.%${filters.query}%,email.ilike.%${filters.query}%,membership_number.ilike.%${filters.query}%`);
      }
      
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters?.role) {
        query = query.eq('role', filters.role);
      }
      
      if (filters?.province) {
        query = query.eq('province', filters.province);
      }
      
      if (filters?.branch) {
        query = query.eq('branch', filters.branch);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      const formattedMembers = data?.map(member => ({
        id: member.id,
        membershipNumber: member.membership_number,
        name: member.name,
        email: member.email,
        phone: member.phone,
        idNumber: member.id_number,
        address: member.address,
        role: member.role,
        province: member.province,
        branch: member.branch,
        vd: member.vd,
        status: member.status,
        joinDate: member.created_at,
        notes: member.notes
      })) || [];
      
      setMembers(formattedMembers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch members');
    } finally {
      setLoading(false);
    }
  };

  const createMember = async (memberData: Omit<Member, 'id' | 'membershipNumber' | 'joinDate'>) => {
    try {
      const membershipNumber = generateMembershipNumber(memberData.province);
      
      const { data, error } = await supabase
        .from('members')
        .insert({
          membership_number: membershipNumber,
          name: memberData.name,
          email: memberData.email,
          phone: memberData.phone,
          id_number: memberData.idNumber,
          address: memberData.address,
          role: memberData.role,
          province: memberData.province,
          branch: memberData.branch,
          vd: memberData.vd,
          status: memberData.status,
          notes: memberData.notes
        })
        .select()
        .single();

      if (error) throw error;
      
      createLog({
        action: 'member_created',
        target_type: 'member',
        target_id: data.id,
        details: { name: data.name, email: data.email },
      });

      await fetchMembers();
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create member');
    }
  };

  const updateMember = async (member: Member) => {
    try {
      const { error } = await supabase
        .from('members')
        .update({
          name: member.name,
          email: member.email,
          phone: member.phone,
          id_number: member.idNumber,
          address: member.address,
          role: member.role,
          province: member.province,
          branch: member.branch,
          vd: member.vd,
          status: member.status,
          notes: member.notes
        })
        .eq('id', member.id);

      if (error) throw error;

      createLog({
        action: 'member_updated',
        target_type: 'member',
        target_id: member.id,
        details: { name: member.name },
      });
      
      await fetchMembers();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update member');
    }
  };

  const deleteMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      createLog({
        action: 'member_deleted',
        target_type: 'member',
        target_id: memberId,
      });
      
      await fetchMembers();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete member');
    }
  };

  const bulkUpdateStatus = async (memberIds: string[], status: string) => {
    try {
      const { error } = await supabase
        .from('members')
        .update({ status })
        .in('id', memberIds);

      if (error) throw error;

      createLog({
        action: 'member_bulk_status_updated',
        target_type: 'member',
        details: { count: memberIds.length, new_status: status },
      });
      
      await fetchMembers();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update members');
    }
  };

  const bulkDelete = async (memberIds: string[]) => {
    try {
      const { error } = await supabase
        .from('members')
        .delete()
        .in('id', memberIds);

      if (error) throw error;
      
      await fetchMembers();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete members');
    }
  };

  const bulkCreateMembers = async (newMembers: Omit<Member, 'id' | 'membershipNumber' | 'joinDate'>[]) => {
    try {
      const membersToInsert = newMembers.map(member => ({
        ...member,
        membership_number: generateMembershipNumber(member.province),
        id_number: member.idNumber,
      }));

      const { error } = await supabase
        .from('members')
        .insert(membersToInsert);

      if (error) throw error;

      await fetchMembers();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to import members');
    }
  };

  useEffect(() => {
    if (profile) {
      fetchMembers();
    }
  }, [profile, fetchMembers]);

  return {
    members,
    loading,
    error,
    fetchMembers,
    createMember,
    updateMember,
    deleteMember,
    bulkUpdateStatus,
    bulkDelete,
    bulkCreateMembers
  };
};