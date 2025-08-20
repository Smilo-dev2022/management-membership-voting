import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Download, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface SearchFilters {
  query: string;
  status: string;
  role: string;
  province: string;
  branch: string;
}

interface MemberSearchProps {
  onSearch: (filters: SearchFilters) => void;
  onExport: () => void;
}

const MemberSearch: React.FC<MemberSearchProps> = ({ onSearch, onExport }) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    status: '',
    role: '',
    province: '',
    branch: ''
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  const clearFilters = () => {
    const cleared = { query: '', status: '', role: '', province: '', branch: '' };
    setFilters(cleared);
    onSearch(cleared);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Member Search & Filters
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowAdvanced(!showAdvanced)}>
              <Filter className="h-4 w-4 mr-2" />
              Advanced
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={onExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Results
                </DropdownMenuItem>
                <DropdownMenuItem onClick={clearFilters}>
                  Clear Filters
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="Search by name, email, membership number..."
              value={filters.query}
              onChange={(e) => handleFilterChange('query', e.target.value)}
            />
          </div>
          <Button onClick={() => onSearch(filters)}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>

        {showAdvanced && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.role} onValueChange={(value) => handleFilterChange('role', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Roles</SelectItem>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="vd_manager">VD Manager</SelectItem>
                <SelectItem value="branch_admin">Branch Admin</SelectItem>
                <SelectItem value="regional_admin">Regional Admin</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.province} onValueChange={(value) => handleFilterChange('province', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Province" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Provinces</SelectItem>
                <SelectItem value="WC">Western Cape</SelectItem>
                <SelectItem value="GP">Gauteng</SelectItem>
                <SelectItem value="KZN">KwaZulu-Natal</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.branch} onValueChange={(value) => handleFilterChange('branch', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Branches</SelectItem>
                <SelectItem value="cape-town">Cape Town Central</SelectItem>
                <SelectItem value="johannesburg">Johannesburg North</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {Object.entries(filters).map(([key, value]) => 
            value && (
              <Badge key={key} variant="secondary" className="cursor-pointer" 
                onClick={() => handleFilterChange(key as keyof SearchFilters, '')}>
                {key}: {value} ×
              </Badge>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MemberSearch;