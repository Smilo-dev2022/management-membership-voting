import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { DollarSign, CreditCard, Receipt, Users, TrendingUp, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface Payment {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  type: 'membership' | 'donation';
  method: 'card' | 'bank_transfer' | 'cash';
  status: 'pending' | 'completed' | 'failed';
  date: string;
  receiptNumber?: string;
}

const PaymentSystem: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [paymentType, setPaymentType] = useState<'membership' | 'donation'>('membership');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank_transfer' | 'cash'>('card');
  const [memberName, setMemberName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      const formattedPayments = data?.map(p => ({
        id: p.id,
        memberId: p.member_id,
        memberName: p.member_name,
        amount: p.amount,
        type: p.type,
        method: p.method,
        status: p.status,
        date: p.created_at,
        receiptNumber: p.receipt_number
      })) || [];

      setPayments(formattedPayments);
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch payments", variant: "destructive" });
      console.error('Fetch payments error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const processPayment = async () => {
    if (!amount || parseFloat(amount) < 10) {
      toast({ title: "Error", description: "Minimum payment amount is R10", variant: "destructive" });
      return;
    }

    if (paymentType === 'membership' && !memberName.trim()) {
      toast({ title: "Error", description: "Member name is required for membership payments", variant: "destructive" });
      return;
    }

    try {
      // Call Supabase edge function for payment processing
      const { data, error } = await supabase.functions.invoke('process-payment', {
        body: {
          amount: parseFloat(amount),
          type: paymentType,
          method: paymentMethod,
          memberName: isAnonymous ? 'Anonymous' : memberName,
          isAnonymous
        }
      });

      if (error) throw error;

      const newPayment: Payment = {
        id: Date.now().toString(),
        memberId: data.memberId || 'ANON',
        memberName: isAnonymous ? 'Anonymous' : memberName,
        amount: parseFloat(amount),
        type: paymentType,
        method: paymentMethod,
        status: 'completed',
        date: new Date().toISOString().split('T')[0],
        receiptNumber: data.receiptNumber
      };

      toast({ title: "Success", description: `Payment of R${amount} processed successfully` });
      
      // Reset form and refetch payments
      setAmount('');
      setMemberName('');
      setIsAnonymous(false);
      fetchPayments();
    } catch (error) {
      console.error('Payment error:', error);
      toast({ title: "Error", description: "Payment processing failed", variant: "destructive" });
    }
  };

  const getTotalStats = () => {
    const total = payments.reduce((sum, p) => sum + p.amount, 0);
    const membership = payments.filter(p => p.type === 'membership').reduce((sum, p) => sum + p.amount, 0);
    const donations = payments.filter(p => p.type === 'donation').reduce((sum, p) => sum + p.amount, 0);
    return { total, membership, donations };
  };

  const stats = getTotalStats();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Payment System</h1>

      {/* Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">R{stats.total.toFixed(2)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Membership Fees</p>
                <p className="text-2xl font-bold">R{stats.membership.toFixed(2)}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Donations</p>
                <p className="text-2xl font-bold">R{stats.donations.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Process Payment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Process Payment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select value={paymentType} onValueChange={(value: 'membership' | 'donation') => setPaymentType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Payment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="membership">Membership Fee</SelectItem>
                <SelectItem value="donation">Donation</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={paymentMethod} onValueChange={(value: 'card' | 'bank_transfer' | 'cash') => setPaymentMethod(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card">Credit/Debit Card</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount (minimum R10)"
            min="10"
          />
          
          {paymentType === 'membership' && (
            <Input
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              placeholder="Member name"
            />
          )}
          
          {paymentType === 'donation' && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="anonymous"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
              />
              <label htmlFor="anonymous" className="text-sm">Anonymous donation</label>
            </div>
          )}
          
          <Button onClick={processPayment} className="w-full">
            <CreditCard className="h-4 w-4 mr-2" />
            Process Payment
          </Button>
        </CardContent>
      </Card>

      {/* Recent Payments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Recent Payments
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={fetchPayments} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-24">
              <p>Loading payments...</p>
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center text-gray-500 py-6">
              No payments found.
            </div>
          ) : (
            <div className="space-y-3">
              {payments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{payment.memberName}</p>
                    <p className="text-sm text-gray-500">
                      {payment.type === 'membership' ? 'Membership Fee' : 'Donation'} • {payment.method}
                    </p>
                    <p className="text-xs text-gray-400">{new Date(payment.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">R{payment.amount.toFixed(2)}</p>
                    <Badge variant={payment.status === 'completed' ? 'default' : 'secondary'}>
                      {payment.status}
                    </Badge>
                    {payment.receiptNumber && (
                      <p className="text-xs text-gray-400">{payment.receiptNumber}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSystem;