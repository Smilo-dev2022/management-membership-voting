import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, MapPin, Calendar, Search } from 'lucide-react';
import { iecApiService, VotingDistrict, ElectionInfo, VoterAllDetailsExt } from '@/services/iecApi';

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
  const [idInput, setIdInput] = useState<string>('');
  const [voterDetails, setVoterDetails] = useState<VoterAllDetailsExt | null>(null);

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

  const lookupVoter = async () => {
    if (!idInput) return;
    setLoading(true);
    setError(null);
    try {
      const data = await iecApiService.getVoterAllDetailsExt(idInput);
      setVoterDetails(data);
    } catch (error) {
      console.error('Failed to lookup voter:', error);
      setError('Failed to lookup voter details.');
      setVoterDetails(null);
    } finally {
      setLoading(false);
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
          <Search className="h-4 w-4" />
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
              <Search className="h-5 w-5" />
              Voter Lookup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter ID number"
                value={idInput}
                onChange={(e) => setIdInput(e.target.value)}
              />
              <Button onClick={lookupVoter} disabled={!idInput || loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="ml-2">Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    Search
                  </>
                )}
              </Button>
            </div>

            {voterDetails && (
              <div className="grid gap-4">
                <Card className="p-4">
                  <h4 className="font-semibold mb-2">Voter</h4>
                  <div className="text-sm space-y-1">
                    <div><span className="font-medium">Id:</span> {voterDetails.Voter?.Id || '-'}</div>
                    <div><span className="font-medium">Status:</span> {voterDetails.Voter?.VoterStatus || '-'}</div>
                    <div><span className="font-medium">Registered:</span> {String(voterDetails.Voter?.bRegistered ?? '-')}</div>
                    <div><span className="font-medium">Voting Station:</span> {voterDetails.Voter?.VotingStation?.Name || '-'}</div>
                    <div><span className="font-medium">Province:</span> {voterDetails.Voter?.VotingStation?.Delimitation?.Province || '-'}</div>
                    <div><span className="font-medium">Municipality:</span> {voterDetails.Voter?.VotingStation?.Delimitation?.Municipality || '-'}</div>
                    <div><span className="font-medium">Ward:</span> {voterDetails.Voter?.VotingStation?.Delimitation?.WardID ?? '-'}</div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-semibold mb-2">Ward Councilor</h4>
                  <div className="text-sm space-y-1">
                    <div><span className="font-medium">Name:</span> {voterDetails.WardCouncilor?.Name || '-'}</div>
                    <div><span className="font-medium">Party:</span> {voterDetails.WardCouncilor?.PartyName || voterDetails.WardCouncilor?.PartyDetail?.Name || '-'}</div>
                    <div><span className="font-medium">Abbrev:</span> {voterDetails.WardCouncilor?.PartyAbbreviation || voterDetails.WardCouncilor?.PartyDetail?.Abbreviation || '-'}</div>
                    <div><span className="font-medium">Province:</span> {voterDetails.WardCouncilor?.Province || '-'}</div>
                    <div><span className="font-medium">Municipality:</span> {voterDetails.WardCouncilor?.Delimitation?.Municipality || '-'}</div>
                    <div><span className="font-medium">Ward:</span> {voterDetails.WardCouncilor?.WardID ?? '-'}</div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-semibold mb-2">Special Voter</h4>
                  <div className="text-sm space-y-1">
                    <div><span className="font-medium">Status:</span> {voterDetails.SpecialVoter?.SpecialVotesStatus || '-'}</div>
                    <div><span className="font-medium">Application:</span> {voterDetails.SpecialVoter?.ApplicationStatus || '-'}</div>
                    <div><span className="font-medium">Open:</span> {String(voterDetails.SpecialVoter?.IsOpen ?? '-')}</div>
                  </div>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};