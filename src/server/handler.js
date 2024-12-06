const predictClassification = require("../services/inferenceService");
const crypto = require("crypto");
const storeData = require("../services/storeData");
const { Firestore } = require("@google-cloud/firestore");

const postPredictHandler = async (request, h) => {
  const { image } = request.payload;
  const { model } = request.server.app;

  const { label, suggestion } = await predictClassification(model, image);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const data = {
    id,
    result: label,
    suggestion,
    createdAt,
  };

  await storeData(id, data);

  return h
    .response({
      status: "success",
      message: "Model is predicted successfully",
      data: data,
    })
    .code(201);
};

const getHistoriesHandler = async (request, h) => {
  const db = new Firestore();
  const predictCollection = db.collection("predictions");
  const predictSnapshot = await predictCollection.get();
  const predictData = predictSnapshot.docs.map((doc) => doc.data());
  return h.response({ status: "success", data: predictData }).code(200);
};

module.exports = { postPredictHandler, getHistoriesHandler };
