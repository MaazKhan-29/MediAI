import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Smartphone, Building2, Banknote, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { paymentsAPI } from '@/lib/api';

const methodIcons: Record<string, React.ElementType> = {
  card: CreditCard,
  upi: Smartphone,
  netbanking: Building2,
  cash: Banknote,
};

const methodLabels: Record<string, string> = {
  card: 'Card',
  upi: 'UPI',
  netbanking: 'Net Banking',
  cash: 'Cash',
};

const statusStyles: Record<string, string> = {
  success: 'bg-green-500/10 text-green-600',
  created: 'bg-amber-500/10 text-amber-600',
  failed: 'bg-red-500/10 text-red-600',
  refunded: 'bg-blue-500/10 text-blue-600',
};

export default function PatientPayments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const { data } = await paymentsAPI.getMy();
      setPayments(data.data || []);
    } catch (error) {
      console.error('Failed to load payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPaid = payments
    .filter(p => p.status === 'success')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading text-2xl font-bold text-foreground">Payment History</h1>
        <p className="mt-1 text-muted-foreground">View all your payment transactions</p>
      </motion.div>

      {/* Summary Cards */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-border bg-card p-4 shadow-card"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Paid</p>
              <p className="text-lg font-bold text-foreground">₹{totalPaid}</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-xl border border-border bg-card p-4 shadow-card"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Transactions</p>
              <p className="text-lg font-bold text-foreground">{payments.length}</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-border bg-card p-4 shadow-card"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Successful</p>
              <p className="text-lg font-bold text-foreground">{payments.filter(p => p.status === 'success').length}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Payment List */}
      <div className="mt-6 space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
          ))
        ) : payments.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <CreditCard className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No payment history yet</p>
            <p className="text-sm text-muted-foreground mt-1">Payments will appear here after you complete a transaction</p>
          </div>
        ) : (
          payments.map((payment, index) => {
            const MethodIcon = methodIcons[payment.paymentMethod] || CreditCard;
            return (
              <motion.div
                key={payment._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-xl border border-border bg-card p-4 shadow-card"
              >
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MethodIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">
                        {payment.doctor?.name || 'Doctor'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {payment.doctor?.specialization || ''}
                      </p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {payment.appointment?.date || ''} at {payment.appointment?.time || ''}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          via {methodLabels[payment.paymentMethod] || 'Unknown'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[payment.status] || ''}`}>
                      {payment.status}
                    </span>
                    <span className="text-lg font-bold text-foreground">₹{payment.amount}</span>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
