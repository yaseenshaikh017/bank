import React, { useEffect, useState } from 'react';
import { getSavingsPrediction } from '/Users/yaseenshaikh/Desktop/saas/saas/banking-main/lib/actions/savings.actions.ts';

const Dashboard = () => {
  const [savingsGoal, setSavingsGoal] = useState(0);

  useEffect(() => {
    const fetchSavings = async () => {
      const response = await getSavingsPrediction();
      setSavingsGoal(response);
    };
    fetchSavings();
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-widget">
        <h2>Smart Savings Goals</h2>
        <p>Your suggested savings for this month is: ${savingsGoal}</p>
      </div>
      {/* Other dashboard components */}
    </div>
  );
};

export default Dashboard;
