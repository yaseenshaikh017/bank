"use client";

import React, { useEffect, useState } from "react";
import useTransactionData from "@/hooks/useTransactionData";
import { predictSavingsGoal } from "@/lib/ai-model";

// List of random savings tips
const savingsTips = [
  "Automate your savings so a portion of your income goes directly to a savings account.",
  "Track your expenses to identify unnecessary spending.",
  "Set realistic savings goals and monitor your progress regularly.",
  "Consider reducing your subscription services to save money each month.",
  "Pack your lunch instead of dining out to save money on food.",
  "Take advantage of discounts, coupons, and sales when making purchases.",
  "Review and negotiate your bills for services like insurance, phone, and internet.",
  "Use cash-back or rewards credit cards wisely to earn while you spend.",
  "Create a monthly budget and stick to it.",
  "Shop in bulk for items you use frequently to save money over time.",
  "Reduce impulse buying by waiting 24 hours before making a purchase.",
  "Limit dining out and prepare meals at home to save money.",
  "Invest in energy-efficient appliances to reduce utility costs.",
  "Cancel unused memberships or subscriptions.",
  "Save spare change in a separate jar or account and watch it add up."
];

const SmartSavingsPage = () => {
  const [savingsGoal, setSavingsGoal] = useState(0); // Suggested savings
  const [customGoal, setCustomGoal] = useState(1000); // User-set goal
  const [tips, setTips] = useState([]);
  const [progress, setProgress] = useState(0); // Progress for savings goal
  const { transactions } = useTransactionData();

  // Fetch and set the suggested savings goal based on transactions (this doesn't change with the custom goal)
  useEffect(() => {
    const fetchSavingsGoal = async () => {
      if (transactions && transactions.length > 0) {
        const predictedGoal = await predictSavingsGoal(transactions);
        setSavingsGoal(predictedGoal); // Only set once based on prediction
        // Calculate initial progress based on the predicted goal and default custom goal
        const savedAmount = predictedGoal * 0.4; // Assume 40% already saved for illustration
        setProgress(Math.min((savedAmount / customGoal) * 100, 100)); // Initial progress calculation
      }
    };
    fetchSavingsGoal();
  }, [transactions]); // Suggested savings only depends on transactions, not on the custom goal

  // Handle progress recalculation when custom goal changes
  const handleGoalChange = (e) => {
    const newGoal = Number(e.target.value);
    if (!isNaN(newGoal) && newGoal > 0) {
      setCustomGoal(newGoal);
      // Recalculate the progress bar based on the custom goal
      const savedAmount = savingsGoal * 0.4; // Assuming 40% already saved
      setProgress(Math.min((savedAmount / newGoal) * 100, 100));
    }
  };

  // Handle random savings tips generation
  const handleImproveSavings = () => {
    const shuffledTips = savingsTips.sort(() => 0.5 - Math.random());
    const selectedTips = shuffledTips.slice(0, 4); // Select 4 random tips
    setTips(selectedTips); // Update the state with new tips
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      {/* Card Container */}
      <div className="bg-white shadow-md rounded-lg p-6 w-11/12 md:w-2/3 lg:w-1/2">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">Smart Savings Goals</h1>
          <p className="text-lg text-gray-600 mb-4">
            Your suggested savings for this month is:
          </p>
          {/* Savings Display (doesn't change when custom goal is updated) */}
          <div className="bg-blue-100 text-blue-800 rounded-lg py-3 px-4 inline-block text-3xl font-bold">
            ${savingsGoal.toFixed(2)}
          </div>
        </div>

        {/* Custom Goal Input */}
        <div className="mt-6 flex flex-col items-center">
          <label className="text-lg font-semibold text-gray-700 mb-2" htmlFor="goal">
            Set Your Savings Goal:
          </label>
          <input
            type="number"
            id="goal"
            value={customGoal}
            onChange={handleGoalChange}
            className="border rounded-lg py-2 px-4 text-center text-lg w-2/3"
            min="1"
          />
        </div>

        {/* Progress Bar Section */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Savings Progress:</h2>
          <div className="relative pt-1">
            <div className="overflow-hidden h-6 mb-4 text-xs flex rounded bg-blue-200">
              <div
                style={{ width: `${progress}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
              >
                {progress.toFixed(2)}%
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Goal: Save ${customGoal} | Progress: ${savingsGoal.toFixed(2)}
          </p>
        </div>

        {/* Improve Savings Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleImproveSavings}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-all duration-200 ease-in-out hover:scale-105"
          >
            Improve Savings
          </button>
        </div>

        {/* Display Savings Tips */}
        {tips.length > 0 && (
          <div className="mt-6 bg-blue-100 p-4 rounded-lg shadow-md transition-transform transform hover:scale-105 duration-300">
            <h2 className="text-xl font-semibold text-blue-800 mb-2">Here are some tips to improve your savings:</h2>
            <ul className="list-disc ml-6 text-blue-800">
              {tips.map((tip, index) => (
                <li key={index} className="mb-2">{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartSavingsPage;
