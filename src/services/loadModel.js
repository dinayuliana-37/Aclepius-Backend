const tf = require("@tensorflow/tfjs-node");

const loadModel = async () => {
  const modelUrl = process.env.MODEL_URL;
  console.log("Loading model from:", modelUrl);
  return await tf.loadGraphModel(modelUrl);
};

module.exports = loadModel;
