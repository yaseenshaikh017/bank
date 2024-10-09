import * as tf from '@tensorflow/tfjs';

// Preprocess the data (normalize amounts and one-hot encode categories)
function preprocessData(transactionHistory) {
  // Extract and normalize the amounts
  const amounts = transactionHistory.map(t => t.amount);
  const amountTensor = tf.tensor1d(amounts);
  const amountMean = amountTensor.mean();
  const amountStd = tf.moments(amountTensor).variance.sqrt();

  const normalizedAmounts = transactionHistory.map(t => {
    return {
      ...t,
      normalizedAmount: (t.amount - amountMean.arraySync()) / amountStd.arraySync(),
    };
  });

  // One-hot encode the categories
  const categories = [...new Set(transactionHistory.map(t => t.category))];
  const oneHotEncodedData = normalizedAmounts.map(t => {
    const categoryVector = categories.map(c => (c === t.category ? 1 : 0));
    return { ...t, categoryVector };
  });

  return oneHotEncodedData;
}

// Prepare the inputs and outputs for the model
function prepareData(transactionHistory) {
  const inputs = [];
  const outputs = [];

  transactionHistory.forEach(transaction => {
    const input = [
      transaction.normalizedAmount,
      ...transaction.categoryVector,
    ];
    inputs.push(input);
    // Assuming savingsGoal is the target (use 0 if it's undefined)
    outputs.push(transaction.savingsGoal || 0);
  });

  return {
    inputs: tf.tensor2d(inputs),
    outputs: tf.tensor2d(outputs, [outputs.length, 1]), // Ensure outputs are 2D
  };
}

// Build and train the neural network model
export const buildAndTrainModel = async (transactionHistory) => {
  // Preprocess and prepare data
  const preprocessedData = preprocessData(transactionHistory);
  const { inputs, outputs } = prepareData(preprocessedData);

  // Build the model with added complexity
  const model = tf.sequential();
  
  // Input layer
  model.add(tf.layers.dense({ units: 128, activation: 'relu', inputShape: [inputs.shape[1]] }));
  
  // Hidden layers
  model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 16, activation: 'relu' }));

  // Output layer (1 unit for regression)
  model.add(tf.layers.dense({ units: 1, activation: 'linear' }));

  // Compile the model with Adam optimizer and a dynamic learning rate
  model.compile({
    optimizer: tf.train.adam(0.001),  // Smaller learning rate for better convergence
    loss: 'meanSquaredError',
  });

  // Train the model with more epochs and adjusted batch size
  await model.fit(inputs, outputs, {
    epochs: 100,  // Increase epochs for better training
    batchSize: 16,  // You can adjust batch size based on data size
  });

  return model;
};

// Function to predict the savings goal using the trained model
export const predictSavingsGoal = async (transactionHistory) => {
  // Ensure non-empty transaction history
  if (!transactionHistory || transactionHistory.length === 0) {
    return 0;  // Return 0 if there is no data
  }

  const model = await buildAndTrainModel(transactionHistory);

  // Preprocess the data again for predictions
  const preprocessedData = preprocessData(transactionHistory);
  const { inputs } = prepareData(preprocessedData);
  
  // Make predictions
  const prediction = model.predict(inputs);
  const predictedSavingsGoal = prediction.dataSync();  // Get the prediction result

  return predictedSavingsGoal[0];  // Return the raw prediction

};
