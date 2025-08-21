import React, { useState, useEffect } from 'react';
import { iecApiService, Party, Province, Municipality } from '@/services/iecApi';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ContestingPartyListProps {
  electoralEventID: string;
}

export default function ContestingPartyList({ electoralEventID }: ContestingPartyListProps) {
  const [parties, setParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>('all');

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const data = await iecApiService.getProvinces();
        setProvinces(data);
      } catch (err) {
        console.error('Failed to fetch provinces:', err);
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchMunicipalities = async () => {
      if (selectedProvince && selectedProvince !== 'all') {
        try {
          const data = await iecApiService.getMunicipalities(selectedProvince);
          setMunicipalities(data);
        } catch (err) {
          console.error('Failed to fetch municipalities:', err);
          setMunicipalities([]);
        }
      } else {
        setMunicipalities([]);
      }
      setSelectedMunicipality('all');
    };
    fetchMunicipalities();
  }, [selectedProvince]);

  useEffect(() => {
    if (!electoralEventID) return;

    const fetchParties = async () => {
      try {
        setLoading(true);
        setError(null);
        const provinceId = selectedProvince === 'all' ? undefined : parseInt(selectedProvince, 10);
        const municipalityId = selectedMunicipality === 'all' ? undefined : parseInt(selectedMunicipality, 10);
        const data = await iecApiService.getContestingParties(electoralEventID, provinceId, municipalityId);
        setParties(data);
      } catch (err) {
        setError('Failed to fetch contesting parties.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchParties();
  }, [electoralEventID, selectedProvince, selectedMunicipality]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="ml-2 text-sm">Loading parties...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-sm p-4">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-4">
        <Select value={selectedProvince} onValueChange={setSelectedProvince}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by Province" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Provinces</SelectItem>
            {provinces.map(p => (
              <SelectItem key={p.ProvinceID} value={p.ProvinceID.toString()}>{p.Province}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedMunicipality} onValueChange={setSelectedMunicipality} disabled={selectedProvince === 'all'}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by Municipality" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Municipalities</SelectItem>
            {municipalities.map(m => (
              <SelectItem key={m.MunicipalityID} value={m.MunicipalityID.toString()}>{m.Municipality}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Logo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Abbreviation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parties.map((party) => (
              <TableRow key={party.ID}>
                <TableCell>
                  <Avatar>
                    <AvatarImage src={party.LogoUrl} alt={party.Abbreviation} />
                    <AvatarFallback>{party.Abbreviation.charAt(0)}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>{party.Name}</TableCell>
                <TableCell>{party.Abbreviation}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
