import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

console.log('Tally Votes function started.');

// It's important to use the SERVICE_ROLE_KEY for admin-level access.
// This would be set as an environment variable in the Supabase Function's settings.
const supabaseAdmin = createClient(
  // Supabase API URL and Service Role Key are injected automatically as env vars
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

Deno.serve(async (_req) => {
  try {
    const now = new Date().toISOString();
    console.log(`Checking for votes that ended before: ${now}`);

    // 1. Find all active votes that have ended
    const { data: expiredVotes, error: fetchError } = await supabaseAdmin
      .from('votes')
      .select('id, title')
      .eq('status', 'active')
      .lt('end_date', now);

    if (fetchError) {
      throw fetchError;
    }

    if (!expiredVotes || expiredVotes.length === 0) {
      console.log('No active votes have ended. Exiting.');
      return new Response(JSON.stringify({ message: 'No votes to tally.' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    console.log(`Found ${expiredVotes.length} votes to tally.`);
    const tallyResults = [];

    for (const vote of expiredVotes) {
      console.log(`Tallying vote: "${vote.title}" (ID: ${vote.id})`);

      // 2. For each expired vote, find the winning option
      const { data: options, error: optionsError } = await supabaseAdmin
        .from('vote_options')
        .select('text, votes')
        .eq('vote_id', vote.id)
        .order('votes', { ascending: false });

      if (optionsError) {
        console.error(`Error fetching options for vote ${vote.id}:`, optionsError.message);
        continue; // Skip to next vote
      }

      const winner = options && options.length > 0 ? options[0].text : 'No winner';
      console.log(`Winner for vote ${vote.id} is: ${winner}`);

      // 3. Update the vote status to 'completed' and set the winner
      const { error: updateError } = await supabaseAdmin
        .from('votes')
        .update({ status: 'completed', winner: winner })
        .eq('id', vote.id);

      if (updateError) {
        console.error(`Error updating vote ${vote.id}:`, updateError.message);
        tallyResults.push({ voteId: vote.id, status: 'failed', error: updateError.message });
      } else {
        console.log(`Successfully tallied vote ${vote.id}.`);
        tallyResults.push({ voteId: vote.id, status: 'tallied', winner: winner });
      }
    }

    return new Response(JSON.stringify({ message: 'Vote tallying process completed.', results: tallyResults }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('An unexpected error occurred:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
