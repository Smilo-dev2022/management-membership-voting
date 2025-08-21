import React, { useState } from 'react';
import { iecApiService, VotingStation } from '@/services/iecApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function FindStationByVDNumber() {
  const [vdNumber, setVdNumber] = useState<string>('');
  const [station, setStation] = useState<VotingStation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    const vdNum = parseInt(vdNumber, 10);

    if (isNaN(vdNum)) {
      setError('Please enter a valid VD Number.');
      return;
    }

    setLoading(true);
    setError(null);
    setStation(null);

    try {
      const result = await iecApiService.getVotingStationByVDNumber(vdNum);
      setStation(result);
    } catch (err) {
      setError('Failed to find a voting station with this VD Number. Please check the number and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <Input
          type="number"
          placeholder="Enter VD Number..."
          value={vdNumber}
          onChange={(e) => setVdNumber(e.target.value)}
        />
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
        </Button>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      {station && (
        <Card>
          <CardHeader>
            <CardTitle>{station.Name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold">Location</h4>
                <p>{station.Location.VDAddress}</p>
                <p>{station.Location.Town}, {station.Location.Suburb}</p>
              </div>
              <div>
                <h4 className="font-semibold">Delimitation</h4>
                <p>Province: {station.Delimitation.Province}</p>
                <p>Municipality: {station.Delimitation.Municipality}</p>
                <p>Ward: {station.Delimitation.WardID}</p>
                <p>VD Number: {station.Delimitation.VDNumber}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
