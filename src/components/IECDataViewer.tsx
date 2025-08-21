import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, MapPin, Calendar, Search, IdCard } from 'lucide-react';
import { iecApiService, VotingDistrict, ElectionInfo, VoterAllDetails } from '@/services/iecApi';

export const IECDataViewer: React.FC = () => {
  const [provinces, setProvinces] = useState<any[]>([]);
  const [municipalities, setMunicipalities] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [votingDistricts, setVotingDistricts] = useState<VotingDistrict[]>([]);
  const [elections, setElections] = useState<ElectionInfo[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>('');
  const [selectedWard, setSelectedWard] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'districts' | 'elections' | 'voter'>('districts');

  // Voter lookup state
  const [idNumber, setIdNumber] = useState<string>('');
  const [voterResult, setVoterResult] = useState<VoterAllDetails | null>(null);
  const [voterLoading, setVoterLoading] = useState(false);
  const [voterError, setVoterError] = useState<string | null>(null);

  useEffect(() => {
    loadProvinces();
    loadElections();
  }, []);

  const loadProvinces = async () => {
    try {
      setError(null);
      const data = await iecApiService.getProvinces();
      setProvinces(data);
    } catch (error) {
      console.error('Failed to load provinces:', error);
      setError('Failed to load provinces. Please check the API connection.');
    }
  };

  const loadMunicipalities = async (provinceId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await iecApiService.getMunicipalities(provinceId);
      setMunicipalities(data);
      setWards([]);
      setVotingDistricts([]);
    } catch (error) {
      console.error('Failed to load municipalities:', error);
      setError('Failed to load municipalities.');
    } finally {
      setLoading(false);
    }
  };

  const loadWards = async (municipalityId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await iecApiService.getWards(municipalityId);
      setWards(data);
      setVotingDistricts([]);
    } catch (error) {
      console.error('Failed to load wards:', error);
      setError('Failed to load wards.');
    } finally {
      setLoading(false);
    }
  };

  const loadVotingDistricts = async (wardId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await iecApiService.getVotingDistrictsByWard(wardId, false);
      setVotingDistricts(data);
    } catch (error) {
      console.error('Failed to load voting districts:', error);
      setError('Failed to load voting districts.');
    } finally {
      setLoading(false);
    }
  };

  const loadElections = async () => {
    try {
      setError(null);
      const data = await iecApiService.getElectionInfo();
      setElections(data);
    } catch (error) {
      console.error('Failed to load elections:', error);
      setError('Failed to load election information.');
    }
  };

  const onLookupVoter = async () => {
    setVoterError(null);
    setVoterResult(null);
    if (!idNumber) {
      setVoterError('Please enter an ID number.');
      return;
    }
    setVoterLoading(true);
    try {
      const data = await iecApiService.getVoterAllDetailsByIdNumber(idNumber.trim());
      setVoterResult(data);
    } catch (err: any) {
      console.error('Failed to fetch voter details:', err);
      setVoterError('Failed to fetch voter details. Verify the ID number and try again.');
    } finally {
      setVoterLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}
      <div className="flex space-x-2 border-b">
        <Button
          variant={activeTab === 'districts' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('districts')}
          className="flex items-center gap-2"
        >
          <MapPin className="h-4 w-4" />
          Voting Districts
        </Button>
        <Button
          variant={activeTab === 'elections' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('elections')}
          className="flex items-center gap-2"
        >
          <Calendar className="h-4 w-4" />
          Elections
        </Button>
        <Button
          variant={activeTab === 'voter' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('voter')}
          className="flex items-center gap-2"
        >
          <IdCard className="h-4 w-4" />
          Voter Lookup
        </Button>
      </div>

      {activeTab === 'districts' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Find Voting Districts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                value={selectedProvince}
                onValueChange={(value) => {
                  setSelectedProvince(value);
                  setSelectedMunicipality('');
                  setSelectedWard('');
                  loadMunicipalities(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Province" />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((province) => (
                    <SelectItem key={province.id} value={province.id}>
                      {province.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedMunicipality}
                onValueChange={(value) => {
                  setSelectedMunicipality(value);
                  setSelectedWard('');
                  loadWards(value);
                }}
                disabled={!selectedProvince}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Municipality" />
                </SelectTrigger>
                <SelectContent>
                  {municipalities.map((municipality) => (
                    <SelectItem key={municipality.id} value={municipality.id}>
                      {municipality.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedWard}
                onValueChange={(value) => {
                  setSelectedWard(value);
                  loadVotingDistricts(value);
                }}
                disabled={!selectedMunicipality}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Ward" />
                </SelectTrigger>
                <SelectContent>
                  {wards.map((ward) => (
                    <SelectItem key={ward.id} value={ward.id}>
                      Ward {ward.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Loading...</span>
              </div>
            )}

            {votingDistricts.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold">Voting Districts:</h4>
                <div className="grid gap-2">
                  {votingDistricts.map((district) => (
                    <Card key={district.id} className="p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium">{district.name}</h5>
                          {district.address && (
                            <p className="text-sm text-muted-foreground">{district.address}</p>
                          )}
                        </div>
                        <Badge variant="outline">{district.id}</Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'elections' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Election Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {elections.map((election) => (
                <Card key={election.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{election.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Date: {new Date(election.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">Type: {election.type}</p>
                    </div>
                    <Badge variant={election.status === 'Completed' ? 'secondary' : 'default'}>
                      {election.status}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'voter' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IdCard className="h-5 w-5" />
              Voter Lookup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 items-center">
              <Input
                placeholder="Enter ID Number"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') onLookupVoter(); }}
              />
              <Button onClick={onLookupVoter} disabled={voterLoading} className="flex items-center gap-2">
                {voterLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Lookup
              </Button>
            </div>
            {voterError && (
              <div className="p-3 text-sm rounded border border-red-300 text-red-700 bg-red-50">{voterError}</div>
            )}

            {voterResult && (
              <div className="space-y-4">
                <Card className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">Voter</h4>
                      <p className="text-sm text-muted-foreground">ID: {voterResult.Voter?.Id || '—'}</p>
                      <p className="text-sm">Status: {voterResult.Voter?.VoterStatus || 'Unknown'}</p>
                      <p className="text-sm">Registered: {voterResult.Voter?.bRegistered ? 'Yes' : 'No'}</p>
                    </div>
                    {voterResult.Voter?.VotingStation?.Name && (
                      <Badge variant="outline">{voterResult.Voter?.VotingStation?.Name}</Badge>
                    )}
                  </div>
                  {voterResult.Voter?.VotingStation?.Location && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      <div>{voterResult.Voter.VotingStation.Location.Town} {voterResult.Voter.VotingStation.Location.Suburb}</div>
                      <div>{voterResult.Voter.VotingStation.Location.Street}</div>
                      <div>{voterResult.Voter.VotingStation.Location.VDAddress}</div>
                    </div>
                  )}
                </Card>

                {voterResult.WardCouncilor && (
                  <Card className="p-4">
                    <h4 className="font-semibold mb-1">Ward Councillor</h4>
                    <p className="text-sm">Name: {voterResult.WardCouncilor.Name || '—'}</p>
                    <p className="text-sm">Party: {voterResult.WardCouncilor.PartyName || voterResult.WardCouncilor.PartyDetail?.Name || '—'}</p>
                    <p className="text-sm">Ward: {voterResult.WardCouncilor.WardID || voterResult.WardCouncilor.Delimitation?.WardID || '—'}</p>
                  </Card>
                )}

                {voterResult.SpecialVoter && (
                  <Card className="p-4">
                    <h4 className="font-semibold mb-1">Special Vote</h4>
                    <p className="text-sm">Status: {voterResult.SpecialVoter.SpecialVotesStatus || '—'}</p>
                    <p className="text-sm">Application: {voterResult.SpecialVoter.ApplicationStatus || '—'}</p>
                  </Card>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};