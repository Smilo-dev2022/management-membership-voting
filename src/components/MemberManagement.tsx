import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, QrCode } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import MemberSearch from './MemberSearch';
import MemberList from './MemberList';
import MemberEditDialog from './MemberEditDialog';
import BulkMemberActions from './BulkMemberActions';
import { useMembers } from '@/hooks/useMembers';

interface SearchFilters {
  query: string;
  status: string;
  role: string;
  province: string;
  branch: string;
}

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

const MemberManagement: React.FC = () => {
  const { members, loading, fetchMembers, updateMember, deleteMember, bulkUpdateStatus, bulkDelete, bulkCreateMembers } = useMembers();
  const { toast } = useToast();
  
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [qrMember, setQRMember] = useState<Member | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (filters: SearchFilters) => {
    fetchMembers(filters);
  };

  const handleEditMember = (member: Member) => {
    setEditingMember(member);
  };

  const handleSaveMember = async (member: Member) => {
    try {
      await updateMember(member);
      toast({ title: "Success", description: "Member updated successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update member", variant: "destructive" });
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    try {
      await deleteMember(memberId);
      toast({ title: "Success", description: "Member deleted successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete member", variant: "destructive" });
    }
  };

  const handleViewQR = (member: Member) => {
    setQRMember(member);
    setShowQRDialog(true);
  };

  const handleStatusChange = async (memberId: string, status: string) => {
    try {
      await bulkUpdateStatus([memberId], status);
      toast({ title: "Success", description: "Member status updated successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update member status", variant: "destructive" });
    }
  };

  const handleSelectAll = (selected: boolean) => {
    setSelectedMembers(selected ? members.map(m => m.id) : []);
  };

  const handleBulkStatusChange = async (memberIds: string[], status: string) => {
    try {
      await bulkUpdateStatus(memberIds, status);
      setSelectedMembers([]);
      toast({ title: "Success", description: `${memberIds.length} members updated successfully` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update members", variant: "destructive" });
    }
  };

  const handleBulkDelete = async (memberIds: string[]) => {
    try {
      await bulkDelete(memberIds);
      setSelectedMembers([]);
      toast({ title: "Success", description: `${memberIds.length} members deleted successfully` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete members", variant: "destructive" });
    }
  };

  const handleExport = () => {
    const csvContent = members.map(m => 
      `${m.membershipNumber},${m.name},${m.email},${m.phone || ''},${m.role},${m.province},${m.branch},${m.status}`
    ).join('\n');
    
    const blob = new Blob([`Membership Number,Name,Email,Phone,Role,Province,Branch,Status\n${csvContent}`], 
      { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'members.csv';
    a.click();
  };

  const handleImport = (file: File) => {
    if (!file) return;
    setIsImporting(true);
    toast({ title: "Info", description: "Importing members..." });

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const newMembers = results.data.map((row: any) => ({
            name: row.Name,
            email: row.Email,
            phone: row.Phone,
            role: row.Role,
            province: row.Province,
            branch: row.Branch,
            status: row.Status || 'pending',
          }));

          await bulkCreateMembers(newMembers);
          toast({ title: "Success", description: `Successfully imported ${newMembers.length} members.` });
        } catch (error) {
          toast({ title: "Error", description: "Failed to import members.", variant: "destructive" });
        } finally {
          setIsImporting(false);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      },
      error: (error) => {
        toast({ title: "Error", description: `CSV parsing error: ${error.message}`, variant: "destructive" });
        setIsImporting(false);
      }
    });
  };

  const triggerImport = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-6 space-y-6">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".csv"
        onChange={(e) => e.target.files && handleImport(e.target.files[0])}
      />

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Member Management</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </div>

      <MemberSearch onSearch={handleSearch} onExport={handleExport} />
      
      <BulkMemberActions
        selectedMembers={selectedMembers}
        totalMembers={members.length}
        onSelectAll={handleSelectAll}
        onBulkStatusChange={handleBulkStatusChange}
        onBulkDelete={handleBulkDelete}
        onExportSelected={handleExport}
        onImportMembers={triggerImport}
        isImporting={isImporting}
      />

      <MemberList
        members={members}
        loading={loading}
        onEdit={handleEditMember}
        onDelete={handleDeleteMember}
        onViewQR={handleViewQR}
        onStatusChange={handleStatusChange}
      />

      <MemberEditDialog
        member={editingMember}
        isOpen={!!editingMember}
        onClose={() => setEditingMember(null)}
        onSave={handleSaveMember}
      />

      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Member QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center p-6">
            <QrCode size={200} />
            <p className="mt-4 text-center">
              {qrMember?.name}<br />
              {qrMember?.membershipNumber}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MemberManagement;