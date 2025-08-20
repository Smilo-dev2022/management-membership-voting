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

  const castVote = async (voteId: string, optionId: string) => {
    // This function assumes an RPC function named `cast_vote` exists in Supabase
    // which handles the transaction of checking for duplicate votes,
    // and incrementing the vote counts.
    //
    // Example SQL for the RPC function:
    // CREATE FUNCTION cast_vote(vote_id_in uuid, option_id_in uuid)
    // RETURNS void AS $$
    // DECLARE
    //   current_user_id uuid := auth.uid();
    // BEGIN
    //   -- Check for duplicate vote
    //   IF EXISTS (SELECT 1 FROM user_votes WHERE user_id = current_user_id AND vote_id = vote_id_in) THEN
    //     RAISE EXCEPTION 'User has already voted.';
    //   END IF;
    //
    //   -- Record the vote
    //   INSERT INTO user_votes(user_id, vote_id) VALUES(current_user_id, vote_id_in);
    //
    //   -- Increment option count
    //   UPDATE vote_options SET votes = votes + 1 WHERE id = option_id_in;
    //
    //   -- Increment total voted count
    //   UPDATE votes SET voted_count = voted_count + 1 WHERE id = vote_id_in;
    // END;
    // $$ LANGUAGE plpgsql;

    try {
      const { error } = await supabase.rpc('cast_vote', {
        vote_id_in: voteId,
        option_id_in: optionId
      });

      if (error) throw error;

      await fetchVotes();
    } catch (err) {
      console.error(err);
      throw new Error(err instanceof Error ? err.message : 'Failed to cast vote');
    }
  };

  return {
    activeVotes,
    completedVotes,
    loading,
    error,
    fetchVotes,
    createVote,
    castVote
  };
};
