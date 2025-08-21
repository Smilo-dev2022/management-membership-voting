import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, MapPin, Calendar, Search, IdCard } from 'lucide-react';
import { iecApiService, VotingDistrict, ElectionInfo } from '@/services/iecApi';
import type { VoterAllDetails } from '@/types';

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
  const [voterIdInput, setVoterIdInput] = useState<string>('');
  const [voterDetails, setVoterDetails] = useState<VoterAllDetails | null>(null);

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

  const lookupVoterDetails = async () => {
    if (!voterIdInput) {
      setError('Please enter an ID number');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await iecApiService.getVoterAllDetails(voterIdInput);
      setVoterDetails(data);
    } catch (error) {
      console.error('Failed to load voter details:', error);
      setError('Failed to load voter details.');
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
          <IdCard className="h-4 w-4" />
          Voter Details
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
              Voter Details Lookup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter ID number"
                value={voterIdInput}
                onChange={(e) => setVoterIdInput(e.target.value)}
              />
              <Button onClick={lookupVoterDetails} disabled={loading || !voterIdInput} className="flex items-center gap-2">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Search
              </Button>
            </div>

            {voterDetails && (
              <div className="space-y-4">
                <Card className="p-4">
                  <h4 className="font-semibold mb-2">Voter</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div><span className="text-muted-foreground">ID:</span> {voterDetails.Voter.Id}</div>
                    <div><span className="text-muted-foreground">Status:</span> {voterDetails.Voter.VoterStatus} (#{voterDetails.Voter.VoterStatusID})</div>
                    <div><span className="text-muted-foreground">Registered:</span> {voterDetails.Voter.bRegistered ? 'Yes' : 'No'}</div>
                    <div><span className="text-muted-foreground">VoterId:</span> {voterDetails.Voter.VoterId}</div>
                    {voterDetails.Voter.VotingStation && (
                      <div className="md:col-span-2 mt-2">
                        <div className="font-medium">Voting Station: {voterDetails.Voter.VotingStation.Name}</div>
                        <div className="text-muted-foreground">
                          Ward {voterDetails.Voter.VotingStation.Delimitation.WardID}, {voterDetails.Voter.VotingStation.Delimitation.Municipality}, {voterDetails.Voter.VotingStation.Delimitation.Province}
                        </div>
                        <div className="text-muted-foreground">
                          {voterDetails.Voter.VotingStation.Location.Street}, {voterDetails.Voter.VotingStation.Location.Suburb}, {voterDetails.Voter.VotingStation.Location.Town}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>

                {voterDetails.WardCouncilor && (
                  <Card className="p-4">
                    <h4 className="font-semibold mb-2">Ward Councilor</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div><span className="text-muted-foreground">Name:</span> {voterDetails.WardCouncilor.Name}</div>
                      <div><span className="text-muted-foreground">Ward:</span> {voterDetails.WardCouncilor.WardID}</div>
                      <div><span className="text-muted-foreground">Province:</span> {voterDetails.WardCouncilor.Province}</div>
                      <div><span className="text-muted-foreground">Municipality:</span> {voterDetails.WardCouncilor.MunicipalityID}</div>
                      {voterDetails.WardCouncilor.PartyDetail && (
                        <div className="md:col-span-2">
                          <div className="text-muted-foreground">Party: {voterDetails.WardCouncilor.PartyDetail.Name} ({voterDetails.WardCouncilor.PartyDetail.Abbreviation})</div>
                        </div>
                      )}
                    </div>
                  </Card>
                )}

                {voterDetails.SpecialVoter && (
                  <Card className="p-4">
                    <h4 className="font-semibold mb-2">Special Voter</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div><span className="text-muted-foreground">Status:</span> {voterDetails.SpecialVoter.SpecialVotesStatus}</div>
                      <div><span className="text-muted-foreground">Application:</span> {voterDetails.SpecialVoter.ApplicationStatus}</div>
                      <div><span className="text-muted-foreground">Open:</span> {voterDetails.SpecialVoter.IsOpen ? 'Yes' : 'No'}</div>
                    </div>
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