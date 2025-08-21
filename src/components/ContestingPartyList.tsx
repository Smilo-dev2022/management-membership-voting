import React, { useState, useEffect } from 'react';
import { iecApiService, Party } from '@/services/iecApi';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';

interface ContestingPartyListProps {
  electoralEventID: string;
}

export default function ContestingPartyList({ electoralEventID }: ContestingPartyListProps) {
  const [parties, setParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!electoralEventID) return;

    const fetchParties = async () => {
      try {
        setLoading(true);
        const data = await iecApiService.getContestingParties(electoralEventID);
        setParties(data);
      } catch (err) {
        setError('Failed to fetch contesting parties.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchParties();
  }, [electoralEventID]);

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
  );
}
