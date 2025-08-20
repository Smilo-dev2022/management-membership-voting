import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';

const SignUp: React.FC = () => {
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    id_number: '',
    phone: '',
    address: '',
    ward: '',
    branch: '',
    region: '',
    province: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { email, password, ...profileData } = formData;

    const { error: signUpError } = await signUp(email, password, profileData);
    if (signUpError) {
      setError(signUpError);
    } else {
      setMessage('Success! Please check your email to confirm your account.');
    }
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
            <p className="text-sm text-gray-500">Create a New Account</p>
          </div>
        </div>

        <ScrollArea className="h-[60vh] pr-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg border-b pb-2">Account Details</h3>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="you@example.com" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <Input name="password" type="password" value={formData.password} onChange={handleInputChange} placeholder="••••••••" required />
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <h3 className="font-semibold text-lg border-b pb-2">Personal Information</h3>
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <Input name="full_name" value={formData.full_name} onChange={handleInputChange} placeholder="John Doe" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ID Number</label>
                <Input name="id_number" value={formData.id_number} onChange={handleInputChange} placeholder="South African ID Number" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contact Phone</label>
                <Input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="082 123 4567" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Full Address</label>
                <Input name="address" value={formData.address} onChange={handleInputChange} placeholder="123 Main Street, Suburb" />
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <h3 className="font-semibold text-lg border-b pb-2">Organizational Structure</h3>
               <div>
                <label className="block text-sm font-medium mb-1">Province</label>
                <Input name="province" value={formData.province} onChange={handleInputChange} placeholder="e.g., Gauteng" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Region</label>
                <Input name="region" value={formData.region} onChange={handleInputChange} placeholder="e.g., Johannesburg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Branch</label>
                <Input name="branch" value={formData.branch} onChange={handleInputChange} placeholder="e.g., Sandton" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ward</label>
                <Input name="ward" value={formData.ward} onChange={handleInputChange} placeholder="e.g., Ward 112" />
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700">
                {loading ? 'Creating account…' : 'Create Account'}
              </Button>
            </div>
            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}
            {message && (
              <p className="text-sm text-green-600 text-center">{message}</p>
            )}
          </form>
        </ScrollArea>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-green-700 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
