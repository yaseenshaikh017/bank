// lib/actions/savings.actions.ts
import { buildAndTrainModel, predictSavingsGoal } from '@/lib/ai-model';

export const getSavingsPrediction = async (transactionHistory) => {
  const model = await buildAndTrainModel(transactionHistory);
  const savingsGoal = await predictSavingsGoal(model, transactionHistory);
  return savingsGoal;
};
