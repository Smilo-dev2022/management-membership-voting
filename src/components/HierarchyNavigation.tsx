import React, { useState } from 'react';
import { ChevronDown, MapPin, Building, Users, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface HierarchyNavigationProps {
  currentLevel: string;
  onNavigate: (level: string, id: string) => void;
}

const HierarchyNavigation: React.FC<HierarchyNavigationProps> = ({ currentLevel, onNavigate }) => {
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedVD, setSelectedVD] = useState('');

  // Mock data - replace with real data from context/API
  const provinces = [
    { id: 'gauteng', name: 'Gauteng', color: 'bg-orange-500' },
    { id: 'western-cape', name: 'Western Cape', color: 'bg-orange-500' },
    { id: 'kwazulu-natal', name: 'KwaZulu-Natal', color: 'bg-orange-500' }
  ];

  const regions = [
    { id: 'ekurhuleni', name: 'Ekurhuleni', provinceId: 'gauteng' },
    { id: 'johannesburg', name: 'Johannesburg', provinceId: 'gauteng' }
  ];

  const branches = [
    { id: 'branch-1', name: 'Branch Alpha', regionId: 'ekurhuleni', color: 'bg-green-500' },
    { id: 'branch-2', name: 'Branch Beta', regionId: 'ekurhuleni', color: 'bg-green-500' }
  ];

  const vds = [
    { id: 'vd-1', name: 'VD 001', branchId: 'branch-1' },
    { id: 'vd-2', name: 'VD 002', branchId: 'branch-1' }
  ];

  const getBreadcrumbs = () => {
    const breadcrumbs = [{ label: 'National', level: 'national', color: 'bg-red-500' }];
    
    if (selectedProvince) {
      const province = provinces.find(p => p.id === selectedProvince);
      if (province) breadcrumbs.push({ label: province.name, level: 'province', color: province.color });
    }
    
    if (selectedRegion) {
      const region = regions.find(r => r.id === selectedRegion);
      if (region) breadcrumbs.push({ label: region.name, level: 'region', color: 'bg-blue-500' });
    }
    
    if (selectedBranch) {
      const branch = branches.find(b => b.id === selectedBranch);
      if (branch) breadcrumbs.push({ label: branch.name, level: 'branch', color: branch.color });
    }
    
    if (selectedVD) {
      const vd = vds.find(v => v.id === selectedVD);
      if (vd) breadcrumbs.push({ label: vd.name, level: 'vd', color: 'bg-gray-500' });
    }
    
    return breadcrumbs;
  };

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 mb-4">
        <Home className="h-4 w-4 text-gray-500" />
        {getBreadcrumbs().map((crumb, index) => (
          <React.Fragment key={crumb.level}>
            {index > 0 && <span className="text-gray-400">/</span>}
            <Badge 
              variant="secondary" 
              className={`${crumb.color} text-white cursor-pointer hover:opacity-80`}
              onClick={() => onNavigate(crumb.level, '')}
            >
              {crumb.label}
            </Badge>
          </React.Fragment>
        ))}
      </div>

      {/* Hierarchy Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Select value={selectedProvince} onValueChange={setSelectedProvince}>
          <SelectTrigger>
            <MapPin className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Select Province" />
          </SelectTrigger>
          <SelectContent>
            {provinces.map(province => (
              <SelectItem key={province.id} value={province.id}>
                {province.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedRegion} onValueChange={setSelectedRegion} disabled={!selectedProvince}>
          <SelectTrigger>
            <Building className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Select Region" />
          </SelectTrigger>
          <SelectContent>
            {regions.filter(r => r.provinceId === selectedProvince).map(region => (
              <SelectItem key={region.id} value={region.id}>
                {region.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedBranch} onValueChange={setSelectedBranch} disabled={!selectedRegion}>
          <SelectTrigger>
            <Users className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Select Branch" />
          </SelectTrigger>
          <SelectContent>
            {branches.filter(b => b.regionId === selectedRegion).map(branch => (
              <SelectItem key={branch.id} value={branch.id}>
                {branch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedVD} onValueChange={setSelectedVD} disabled={!selectedBranch}>
          <SelectTrigger>
            <Home className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Select VD" />
          </SelectTrigger>
          <SelectContent>
            {vds.filter(v => v.branchId === selectedBranch).map(vd => (
              <SelectItem key={vd.id} value={vd.id}>
                {vd.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default HierarchyNavigation;