import React, { useState } from 'react';
import { useVotes } from '@/hooks/useVotes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Vote, 
  Plus, 
  Calendar, 
  Users, 
  CheckCircle,
  Clock,
  BarChart3,
  Shield,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { VoteResultsDialog } from './VoteResultsDialog';
import { Vote as VoteType } from '@/hooks/useVotes';

const VotingSystem: React.FC = () => {
  const {
    activeVotes,
    completedVotes,
    loading,
    error,
    createVote: createVoteInDb,
    castVote,
  } = useVotes();
  const { toast } = useToast();
  const [newVote, setNewVote] = useState({ title: '', description: '', options: ['', ''], level: 'branch' as const, startDate: '', endDate: '' });
  const [castingVote, setCastingVote] = useState<string | null>(null);
  const [viewingResults, setViewingResults] = useState<VoteType | null>(null);

  const addOption = () => {
    setNewVote(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const updateOption = (index: number, value: string) => {
    setNewVote(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  const createVote = async () => {
    await createVoteInDb({
      ...newVote,
      status: 'pending', // Or determine status based on dates
    });
    setNewVote({ title: '', description: '', options: ['', ''], level: 'branch', startDate: '', endDate: '' });
  };

  const handleCastVote = async (voteId: string, optionId: string) => {
    setCastingVote(optionId);
    try {
      await castVote(voteId, optionId);
      toast({
        title: 'Vote Cast Successfully',
        description: 'Your vote has been recorded.',
      });
    } catch (error) {
      toast({
        title: 'Error Casting Vote',
        description: (error as Error).message,
        variant: 'destructive',
      });
    } finally {
      setCastingVote(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Voting System</h2>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Votes</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="create">Create New</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {loading && activeVotes.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading active votes...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeVotes.map((vote) => (
                <Card key={vote.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{vote.title}</CardTitle>
                      <Badge variant="default" className="capitalize">{vote.level}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{vote.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Ends: {new Date(vote.endDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {vote.votedCount}/{vote.totalVoters} voted
                      </div>
                    </div>

                    <Progress value={(vote.votedCount / vote.totalVoters) * 100} className="h-2" />

                    <div className="space-y-2">
                      {vote.options.map((option) => (
                        <div key={option.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div>
                            <span className="font-medium">{option.text}</span>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <span>{option.votes} votes</span>
                              <Progress
                                value={(option.votes / (vote.votedCount || 1)) * 100}
                                className="w-16 h-2"
                              />
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleCastVote(vote.id, option.id)}
                            disabled={castingVote !== null}
                          >
                            {castingVote === option.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              'Vote'
                            )}
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <BarChart3 className="h-4 w-4 mr-1" />
                        View Results
                      </Button>
                      <Button size="sm" variant="outline">
                        <Shield className="h-4 w-4 mr-1" />
                        Audit Trail
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {loading && completedVotes.length === 0 ? (
             <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading completed votes...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {completedVotes.map((vote) => (
                <Card key={vote.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{vote.title}</CardTitle>
                      <Badge variant="secondary" className="capitalize">{vote.level}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                        Completed: {new Date(vote.endDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {vote.votedCount}/{vote.totalVoters} voted
                      </div>
                    </div>

                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm font-medium text-green-800">
                        Winner: {vote.winner}
                      </p>
                    </div>

                    <Button size="sm" variant="outline" className="w-full" onClick={() => setViewingResults(vote)}>
                      <BarChart3 className="h-4 w-4 mr-1" />
                      View Full Results
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Vote className="h-5 w-5 mr-2" />
                Create New Vote
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Vote Title</label>
                <Input
                  value={newVote.title}
                  onChange={(e) => setNewVote(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter vote title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={newVote.description}
                  onChange={(e) => setNewVote(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this vote is about"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Level</label>
                  {/* TODO: Replace with Select component */}
                  <Input value={newVote.level} onChange={(e) => setNewVote(prev => ({ ...prev, level: e.target.value as any }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Start Date</label>
                  <Input type="date" value={newVote.startDate} onChange={(e) => setNewVote(prev => ({ ...prev, startDate: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">End Date</label>
                  <Input type="date" value={newVote.endDate} onChange={(e) => setNewVote(prev => ({ ...prev, endDate: e.target.value }))} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Options</label>
                <div className="space-y-2">
                  {newVote.options.map((option, index) => (
                    <Input
                      key={index}
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                    />
                  ))}
                </div>
                <Button variant="outline" size="sm" onClick={addOption} className="mt-2">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Option
                </Button>
              </div>

              <div className="flex space-x-4">
                <Button onClick={createVote} disabled={!newVote.title.trim() || loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Vote'}
                </Button>
                <Button variant="outline" disabled={loading}>
                  <Clock className="h-4 w-4 mr-2" />
                  Schedule for Later
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <VoteResultsDialog
        isOpen={!!viewingResults}
        onClose={() => setViewingResults(null)}
        vote={viewingResults}
      />
    </div>
  );
};

export default VotingSystem;
                  </div>
                  <p className="text-sm text-gray-600">{vote.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Ends: {vote.endDate}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {vote.votedCount}/{vote.totalVoters} voted
                    </div>
                  </div>
                  
                  <Progress value={(vote.votedCount / vote.totalVoters) * 100} className="h-2" />
                  
                  <div className="space-y-2">
                    {vote.options.map((option) => (
                      <div key={option.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="font-medium">{option.text}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{option.votes} votes</span>
                          <Progress 
                            value={(option.votes / vote.votedCount) * 100} 
                            className="w-16 h-2" 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <BarChart3 className="h-4 w-4 mr-1" />
                      View Results
                    </Button>
                    <Button size="sm" variant="outline">
                      <Shield className="h-4 w-4 mr-1" />
                      Audit Trail
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {completedVotes.map((vote) => (
              <Card key={vote.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{vote.title}</CardTitle>
                    <Badge variant="secondary" className="capitalize">{vote.level}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                      Completed: {vote.endDate}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {vote.votedCount}/{vote.totalVoters} voted
                    </div>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-800">
                      Winner: {vote.winner}
                    </p>
                  </div>
                  
                  <Button size="sm" variant="outline" className="w-full">
                    <BarChart3 className="h-4 w-4 mr-1" />
                    View Full Results
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Vote className="h-5 w-5 mr-2" />
                Create New Vote
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Vote Title</label>
                <Input 
                  value={newVote.title}
                  onChange={(e) => setNewVote(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter vote title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea 
                  value={newVote.description}
                  onChange={(e) => setNewVote(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this vote is about"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Options</label>
                <div className="space-y-2">
                  {newVote.options.map((option, index) => (
                    <Input 
                      key={index}
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                    />
                  ))}
                </div>
                <Button variant="outline" size="sm" onClick={addOption} className="mt-2">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Option
                </Button>
              </div>
              
              <div className="flex space-x-4">
                <Button onClick={createVote} disabled={!newVote.title.trim()}>
                  Create Vote
                </Button>
                <Button variant="outline">
                  <Clock className="h-4 w-4 mr-2" />
                  Schedule for Later
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VotingSystem;