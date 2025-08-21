import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, MapPin, Calendar, Search, User, Crosshair } from 'lucide-react';
import { iecApiService, VotingDistrict, ElectionInfo, VoterAllDetailsExt, WardCouncilor, VotingStation, DelimitationLookup } from '@/services/iecApi';

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
  const [activeTab, setActiveTab] = useState<'districts' | 'elections' | 'voter' | 'delimitation'>('districts');

  // Voter lookup state
  const [idNumber, setIdNumber] = useState<string>('');
  const [voterId, setVoterId] = useState<string>('');
  const [voterDetails, setVoterDetails] = useState<VoterAllDetailsExt | null>(null);
  const [voterLoading, setVoterLoading] = useState(false);

  // Delimitation lookup state
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [delimitation, setDelimitation] = useState<DelimitationLookup | null>(null);
  const [councilor, setCouncilor] = useState<WardCouncilor | null>(null);
  const [votingStation, setVotingStation] = useState<VotingStation | null>(null);
  const [delimLoading, setDelimLoading] = useState(false);

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

  const lookupVoterByIdNumber = async () => {
    if (!idNumber.trim()) return;
    setVoterLoading(true);
    setError(null);
    try {
      const data = await iecApiService.getVoterAllDetailsByIdNumber(idNumber.trim());
      setVoterDetails(data);
    } catch (error) {
      console.error('Failed to lookup voter by ID number:', error);
      setError('Failed to load voter details.');
      setVoterDetails(null);
    } finally {
      setVoterLoading(false);
    }
  };

  const lookupVoterByVoterId = async () => {
    if (!voterId.trim()) return;
    setVoterLoading(true);
    setError(null);
    try {
      const data = await iecApiService.getVoterAllDetailsByVoterId(voterId.trim());
      setVoterDetails(data);
    } catch (error) {
      console.error('Failed to lookup voter by Voter ID:', error);
      setError('Failed to load voter details.');
      setVoterDetails(null);
    } finally {
      setVoterLoading(false);
    }
  };

  const useBrowserLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(String(pos.coords.latitude));
        setLongitude(String(pos.coords.longitude));
      },
      () => setError('Unable to retrieve your location.')
    );
  };

  const lookupDelimitationByCoordinates = async () => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return;
    setDelimLoading(true);
    setError(null);
    try {
      const del = await iecApiService.getDelimitationByCoordinates(lat, lng);
      setDelimitation(del);
      const [c, vs] = await Promise.all([
        iecApiService.getWardCouncilorByCoordinates(lat, lng).catch(() => null),
        iecApiService.getVotingStationDetailsByLocation(lat, lng).catch(() => null),
      ]);
      setCouncilor(c as any);
      setVotingStation(vs as any);
    } catch (error) {
      console.error('Failed to lookup delimitation by coordinates:', error);
      setError('Failed to load delimitation information.');
      setDelimitation(null);
      setCouncilor(null);
      setVotingStation(null);
    } finally {
      setDelimLoading(false);
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
          <User className="h-4 w-4" />
          Voter Lookup
        </Button>
        <Button
          variant={activeTab === 'delimitation' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('delimitation')}
          className="flex items-center gap-2"
        >
          <Crosshair className="h-4 w-4" />
          Delimitation
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
              <User className="h-5 w-5" />
              Voter Lookup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">ID Number</label>
                <div className="flex gap-2">
                  <Input value={idNumber} onChange={(e) => setIdNumber(e.target.value)} placeholder="Enter 13-digit ID number" />
                  <Button onClick={lookupVoterByIdNumber} disabled={voterLoading || !idNumber.trim()}>
                    {voterLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Voter ID</label>
                <div className="flex gap-2">
                  <Input value={voterId} onChange={(e) => setVoterId(e.target.value)} placeholder="Enter Voter ID" />
                  <Button onClick={lookupVoterByVoterId} disabled={voterLoading || !voterId.trim()}>
                    {voterLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>

            {voterLoading && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="ml-2">Loading voter details...</span>
              </div>
            )}

            {voterDetails && (
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="p-4">
                  <h4 className="font-semibold mb-2">Status</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div>Registered: {voterDetails.Voter?.bRegistered ? 'Yes' : 'No'}</div>
                    <div>Status: {voterDetails.Voter?.VoterStatus}</div>
                  </div>
                </Card>
                {voterDetails.Voter?.VotingStation && (
                  <Card className="p-4">
                    <h4 className="font-semibold mb-2">Voting Station</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div>Name: {voterDetails.Voter.VotingStation.Name}</div>
                      {voterDetails.Voter.VotingStation.Location?.VDAddress && (
                        <div>Address: {voterDetails.Voter.VotingStation.Location.VDAddress}</div>
                      )}
                      {voterDetails.Voter.VotingStation.Delimitation && (
                        <div>
                          VD: {voterDetails.Voter.VotingStation.Delimitation.VDNumber} | Ward: {voterDetails.Voter.VotingStation.Delimitation.WardID}
                        </div>
                      )}
                    </div>
                  </Card>
                )}
                {voterDetails.WardCouncilor && (
                  <Card className="p-4 md:col-span-2">
                    <h4 className="font-semibold mb-2">Ward Councilor</h4>
                    <div className="text-sm text-muted-foreground">
                      <div>Name: {voterDetails.WardCouncilor.Name}</div>
                      {voterDetails.WardCouncilor.PartyDetail && (
                        <div>Party: {voterDetails.WardCouncilor.PartyDetail.Name} ({voterDetails.WardCouncilor.PartyDetail.Abbreviation})</div>
                      )}
                    </div>
                  </Card>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'delimitation' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crosshair className="h-5 w-5" />
              Delimitation by Coordinates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Latitude</label>
                <Input type="number" value={latitude} onChange={(e) => setLatitude(e.target.value)} placeholder="e.g. -26.2041" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Longitude</label>
                <Input type="number" value={longitude} onChange={(e) => setLongitude(e.target.value)} placeholder="e.g. 28.0473" />
              </div>
              <div className="flex items-end gap-2">
                <Button onClick={lookupDelimitationByCoordinates} disabled={delimLoading || !latitude || !longitude}>Lookup</Button>
                <Button variant="outline" onClick={useBrowserLocation} title="Use my current location">
                  <Crosshair className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {delimLoading && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="ml-2">Loading delimitation...</span>
              </div>
            )}

            {(delimitation || councilor || votingStation) && (
              <div className="grid gap-4 md:grid-cols-3">
                {delimitation && (
                  <Card className="p-4">
                    <h4 className="font-semibold mb-2">Delimitation</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>Province: {delimitation.Province} (ID {delimitation.ProvinceID})</div>
                      <div>Municipality: {delimitation.Municipality} (ID {delimitation.MunicipalityID})</div>
                      <div>Ward: {delimitation.WardID}</div>
                      <div>VD: {delimitation.VDNumber}</div>
                    </div>
                  </Card>
                )}
                {councilor && (
                  <Card className="p-4">
                    <h4 className="font-semibold mb-2">Ward Councilor</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>Name: {councilor.Name}</div>
                      {councilor.PartyDetail && (
                        <div>Party: {councilor.PartyDetail.Name} ({councilor.PartyDetail.Abbreviation})</div>
                      )}
                    </div>
                  </Card>
                )}
                {votingStation && (
                  <Card className="p-4">
                    <h4 className="font-semibold mb-2">Nearest Voting Station</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>Name: {votingStation.Name}</div>
                      {votingStation.Location?.VDAddress && (
                        <div>Address: {votingStation.Location.VDAddress}</div>
                      )}
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