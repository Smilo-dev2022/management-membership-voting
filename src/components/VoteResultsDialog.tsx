import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Vote } from '@/hooks/useVotes';
import { Progress } from '@/components/ui/progress';

interface VoteResultsDialogProps {
  vote: Vote | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VoteResultsDialog: React.FC<VoteResultsDialogProps> = ({ vote, isOpen, onClose }) => {
  if (!vote) return null;

  const totalVotes = vote.options.reduce((sum, option) => sum + option.votes, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{vote.title}</DialogTitle>
          <DialogDescription>
            Final results for the vote held from {new Date(vote.startDate).toLocaleDateString()} to {new Date(vote.endDate).toLocaleDateString()}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="font-bold text-lg">
            Winner: {vote.winner || 'Not determined'}
          </div>
          <div className="text-sm text-gray-500">
            Total Votes Cast: {totalVotes} / {vote.totalVoters}
          </div>
          <div className="space-y-4">
            {vote.options
              .sort((a, b) => b.votes - a.votes)
              .map(option => (
                <div key={option.id}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{option.text}</span>
                    <span className="text-sm text-gray-600">{option.votes} votes</span>
                  </div>
                  <Progress value={(option.votes / (totalVotes || 1)) * 100} />
                </div>
              ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
