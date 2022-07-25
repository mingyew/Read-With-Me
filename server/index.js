const express = require("express");
const cors = require("cors");
const { Translate } = require("@google-cloud/translate").v2;

const translate = new Translate({
  projectId: "project_id=read-with-me-354921",
  keyFilename: "read-with-me-354921-a36e6788bf36.json",
});

const PORT = process.env.PORT || 3001;

const app = express();
const corsOptions = {
  origin: "http://localhost:3000",
};

app.use(express.json());
app.use(cors(corsOptions));

const translateText = async (text) => {
  // The target language
  const target = "ru";

  // Translates some text into Russian
  const [translation] = await translate.translate(text, target);
  return translation;
};

app.post("/api/fetch-stories", async (req, res) => {
  const text = req.body.text;
  const translation = await translateText(text);
  res.json({ translated: translation });
});

app.post("/api/translate-text", async (req, res) => {
  const text = req.body.text;
  const translation = await translateText(text);
  res.json({ translated: translation });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
