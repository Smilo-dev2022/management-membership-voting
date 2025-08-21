import React, { useState, useEffect, useMemo } from 'react';
import { iecApiService, VotingStationLocation, Province, Municipality } from '@/services/iecApi';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

export default function VotingStationList() {
  const [votingStations, setVotingStations] = useState<VotingStationLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);

  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);

        const elections = await iecApiService.getElectionInfo();
        if (elections.length > 0) {
          const latestElectionId = elections[0].id;
          const stations = await iecApiService.getVotingStations(latestElectionId);
          setVotingStations(stations);
        }

        const provs = await iecApiService.getProvinces();
        setProvinces(provs);

      } catch (err) {
        setError('Failed to fetch voting stations.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchMunicipalities = async () => {
      if (selectedProvince && selectedProvince !== 'all') {
        const munis = await iecApiService.getMunicipalities(selectedProvince);
        setMunicipalities(munis);
      } else {
        setMunicipalities([]);
      }
      setSelectedMunicipality('all');
    };
    fetchMunicipalities();
  }, [selectedProvince]);

  const filteredStations = useMemo(() => {
    return votingStations
      .filter(station =>
        (selectedProvince === 'all' || station.ProvinceID.toString() === selectedProvince) &&
        (selectedMunicipality === 'all' || station.MunicipalityID.toString() === selectedMunicipality) &&
        (station.VotingDistrict.toLowerCase().includes(searchTerm.toLowerCase()) ||
         station.VDAddress.toLowerCase().includes(searchTerm.toLowerCase()))
      );
  }, [votingStations, selectedProvince, selectedMunicipality, searchTerm]);

  if (loading) {
    return <div>Loading voting stations...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Select value={selectedProvince} onValueChange={setSelectedProvince}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Province" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Provinces</SelectItem>
            {provinces.map(p => (
              <SelectItem key={p.ProvinceID} value={p.ProvinceID.toString()}>{p.Province}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedMunicipality} onValueChange={setSelectedMunicipality} disabled={!municipalities.length}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Municipality" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Municipalities</SelectItem>
            {municipalities.map(m => (
              <SelectItem key={m.MunicipalityID} value={m.MunicipalityID.toString()}>{m.Municipality}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="Search by district or address..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Voting District</TableHead>
              <TableHead>Province</TableHead>
              <TableHead>Municipality</TableHead>
              <TableHead>Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStations.map((station, index) => (
              <TableRow key={index}>
                <TableCell>{station.VotingDistrict}</TableCell>
                <TableCell>{station.Province}</TableCell>
                <TableCell>{station.Municipality}</TableCell>
                <TableCell>{station.VDAddress}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
