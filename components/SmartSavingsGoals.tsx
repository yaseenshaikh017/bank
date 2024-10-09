// components/SmartSavingsGoals.tsx

import { useEffect, useState } from 'react';
import { getSmartSavingsGoal } from '../lib/actions/savings.actions';

export default function SmartSavingsGoals({ userId }) {
  const [savingsGoal, setSavingsGoal] = useState(null);

  useEffect(() => {
    async function fetchSavingsGoal() {
      const goal = await getSmartSavingsGoal(userId);
      setSavingsGoal(goal);
    }
    fetchSavingsGoal();
  }, [userId]);

  return (
    <div className="savings-goals">
      <h2>Your Smart Savings Goal</h2>
      {savingsGoal ? (
        <div>
          <p>Based on your spending, you should aim to save:</p>
          <h3>{savingsGoal} USD this month</h3>
        </div>
      ) : (
        <p>Loading your savings goal...</p>
      )}
    </div>
  );
}
