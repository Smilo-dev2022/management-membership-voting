import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, IdCard, MapPin } from 'lucide-react';
import { iecApiService } from '@/services/iecApi';
import type { VoterExt } from '@/types';

const VoterLookup: React.FC = () => {
	const [voterId, setVoterId] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [result, setResult] = useState<VoterExt | null>(null);

	const onSearch = async () => {
		setLoading(true);
		setError(null);
		setResult(null);
		try {
			if (!voterId.trim()) {
				setError('Please enter a Voter ID.');
				return;
			}
			const data = await iecApiService.getVoterExtByVoterId(voterId.trim());
			setResult(data as unknown as VoterExt);
		} catch (e: any) {
			setError(e?.message || 'Failed to fetch voter details');
		} finally {
			setLoading(false);
		}
	};

	return (
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
						value={voterId}
						onChange={(e) => setVoterId(e.target.value)}
						placeholder="Enter Voter ID"
					/>
					<Button onClick={onSearch} disabled={loading}>
						{loading ? (
							<>
								<Loader2 className="h-4 w-4 animate-spin mr-2" />
								Searching...
							</>
						) : (
							'Search'
						)}
					</Button>
				</div>

				{error && (
					<div className="p-3 bg-red-100 text-red-700 rounded border border-red-300">{error}</div>
				)}

				{result && (
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<div>
								<div className="text-sm text-muted-foreground">Voter ID</div>
								<div className="font-medium">{result.Id}</div>
							</div>
							<Badge variant={result.bRegistered ? 'default' : 'secondary'}>
								{result.VoterStatus} (ID: {result.VoterStatusID})
							</Badge>
						</div>

						{result.VotingStation && (
							<div className="space-y-2">
								<div className="font-semibold flex items-center gap-2">
									<MapPin className="h-4 w-4" /> Voting Station: {result.VotingStation.Name}
								</div>
								<div className="text-sm">
									<div>
										<strong>Delimitation:</strong> Province {result.VotingStation.Delimitation.Province} (#{result.VotingStation.Delimitation.ProvinceID}) • Municipality {result.VotingStation.Delimitation.Municipality} (#{result.VotingStation.Delimitation.MunicipalityID}) • Ward #{result.VotingStation.Delimitation.WardID} • VD #{result.VotingStation.Delimitation.VDNumber}
									</div>
									<div className="mt-1">
										<strong>Location:</strong> {result.VotingStation.Location.Street}, {result.VotingStation.Location.Suburb}, {result.VotingStation.Location.Town}
										<div className="text-muted-foreground">
											{result.VotingStation.Location.VDAddress}
										</div>
										<div className="text-muted-foreground">
											Lat: {result.VotingStation.Location.Latitude}, Lng: {result.VotingStation.Location.Longitude}
										</div>
									</div>
								</div>
							</div>
						)}

						<div className="text-sm text-muted-foreground">
							bVDPortionLost: {String(result.bVDPortionLost)} • bSendAddressMsg: {String(result.bSendAddressMsg)}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default VoterLookup;