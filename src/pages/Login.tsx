import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Login: React.FC = () => {
  const { signInWithOtp } = useAuth();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const { error } = await signInWithOtp(email);
    if (error) setStatus(error);
    else setStatus('Check your email for the magic link.');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-700 via-yellow-500 to-black">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">MK</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">uMkhonto weSizwe Party</h1>
            <p className="text-sm text-gray-500">Management System</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700">
            {loading ? 'Sending magic link…' : 'Send magic link'}
          </Button>
          {status && (
            <p className="text-sm text-gray-600 text-center">{status}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;

