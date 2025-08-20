import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Users, Download, Upload, Trash2, UserCheck, AlertTriangle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface BulkMemberActionsProps {
  selectedMembers: string[];
  totalMembers: number;
  onSelectAll: (selected: boolean) => void;
  onBulkStatusChange: (memberIds: string[], status: string) => void;
  onBulkDelete: (memberIds: string[]) => void;
  onExportSelected: (memberIds: string[]) => void;
  onImportMembers: () => void;
  isImporting?: boolean;
}

const BulkMemberActions: React.FC<BulkMemberActionsProps> = ({
  selectedMembers,
  totalMembers,
  onSelectAll,
  onBulkStatusChange,
  onBulkDelete,
  onExportSelected,
  onImportMembers,
  isImporting
}) => {
  const [bulkAction, setBulkAction] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const executeBulkAction = () => {
    if (!bulkAction || selectedMembers.length === 0) return;

    switch (bulkAction) {
      case 'activate':
        onBulkStatusChange(selectedMembers, 'active');
        break;
      case 'deactivate':
        onBulkStatusChange(selectedMembers, 'inactive');
        break;
      case 'export':
        onExportSelected(selectedMembers);
        break;
      case 'delete':
        setShowDeleteConfirm(true);
        return;
    }
    
    setBulkAction('');
  };

  const confirmDelete = () => {
    onBulkDelete(selectedMembers);
    setShowDeleteConfirm(false);
    setBulkAction('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Bulk Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={selectedMembers.length === totalMembers && totalMembers > 0}
              onCheckedChange={onSelectAll}
            />
            <span className="text-sm">
              Select All ({selectedMembers.length} of {totalMembers} selected)
            </span>
          </div>
          
          {selectedMembers.length > 0 && (
            <Badge variant="secondary">
              {selectedMembers.length} member{selectedMembers.length !== 1 ? 's' : ''} selected
            </Badge>
          )}
        </div>

        <div className="flex gap-2">
          <Select value={bulkAction} onValueChange={setBulkAction}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Choose bulk action..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="activate">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  Activate Members
                </div>
              </SelectItem>
              <SelectItem value="deactivate">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  Deactivate Members
                </div>
              </SelectItem>
              <SelectItem value="export">
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export Selected
                </div>
              </SelectItem>
              <SelectItem value="delete">
                <div className="flex items-center gap-2 text-red-600">
                  <Trash2 className="h-4 w-4" />
                  Delete Members
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            onClick={executeBulkAction}
            disabled={!bulkAction || selectedMembers.length === 0}
            variant={bulkAction === 'delete' ? 'destructive' : 'default'}
          >
            Execute
          </Button>
        </div>

        <div className="flex gap-2 pt-2 border-t">
          <Button variant="outline" size="sm" onClick={() => onExportSelected([])}>
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
          
          <Button variant="outline" size="sm" onClick={onImportMembers} disabled={isImporting}>
            <Upload className="h-4 w-4 mr-2" />
            {isImporting ? 'Importing...' : 'Import CSV'}
          </Button>
        </div>

        <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Confirm Bulk Delete
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {selectedMembers.length} member{selectedMembers.length !== 1 ? 's' : ''}? 
                This action cannot be undone and will permanently remove all member data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                Delete Members
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default BulkMemberActions;