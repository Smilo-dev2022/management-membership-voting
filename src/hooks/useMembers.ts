import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
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
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = async (filters?: SearchFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false });

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
    fetchMembers();
  }, []);

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