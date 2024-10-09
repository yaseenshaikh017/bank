import { useState, useEffect } from 'react';
import { getTransactionsByBankId } from '@/lib/actions/transaction.actions';

const mockTransactions = [
  { amount: 500, category: "Food", savingsGoal: 50, channel: "online" },
  { amount: 300, category: "Travel", savingsGoal: 30, channel: "online" },
  { amount: 200, category: "Bills", savingsGoal: 20, channel: "offline" },
];

const useTransactionData = (bankId) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        if (bankId) {
          const result = await getTransactionsByBankId({ bankId });
          if (result && result.documents) {
            setTransactions(result.documents);
          }
        } else {
          setTransactions(mockTransactions); // Mock data for testing
        }
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [bankId]);

  return { transactions, loading };
};

export default useTransactionData;
