import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface VoteOption {
  id: string;
  text: string;
  votes: number;
}

export interface Vote {
  id: string;
  title: string;
  description: string;
  level: 'branch' | 'region' | 'province' | 'national' | 'vd';
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'pending';
  totalVoters: number;
  votedCount: number;
  options: VoteOption[];
  winner?: string;
}

export const useVotes = () => {
  const [activeVotes, setActiveVotes] = useState<Vote[]>([]);
  const [completedVotes, setCompletedVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: votesData, error: votesError } = await supabase
        .from('votes')
        .select('*, options:vote_options(*)');

      if (votesError) throw votesError;

      const now = new Date();
      const allVotes: Vote[] = votesData.map(v => ({
          ...v,
          startDate: v.start_date,
          endDate: v.end_date,
          totalVoters: v.total_voters,
          votedCount: v.voted_count,
      }));

      setActiveVotes(allVotes.filter(v => v.status === 'active' && new Date(v.endDate) > now));
      setCompletedVotes(allVotes.filter(v => v.status === 'completed' || new Date(v.endDate) <= now));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch votes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createVote = async (voteData: Omit<Vote, 'id' | 'totalVoters' | 'votedCount' | 'options' | 'winner'> & { options: string[] }) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Create the vote
      const { data: vote, error: voteError } = await supabase
        .from('votes')
        .insert({
          title: voteData.title,
          description: voteData.description,
          level: voteData.level,
          status: voteData.status,
          start_date: voteData.startDate,
          end_date: voteData.endDate,
        })
        .select()
        .single();

      if (voteError) throw voteError;

      // 2. Create the vote options
      const optionsToInsert = voteData.options.map(optionText => ({
        vote_id: vote.id,
        text: optionText,
      }));

      const { error: optionsError } = await supabase
        .from('vote_options')
        .insert(optionsToInsert);

      if (optionsError) throw optionsError;

      // 3. Refresh the votes list
      await fetchVotes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create vote');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVotes();
  }, [fetchVotes]);

  return {
    activeVotes,
    completedVotes,
    loading,
    error,
    fetchVotes,
    createVote
  };
};
