const express = require("express");
const cors = require("cors");
const { Translate } = require("@google-cloud/translate").v2;
var mysql = require("mysql2");

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

//TRANSLATE
const translateText = async (text, targetedLang) => {
  const translation = await translate.translate(text, targetedLang);
  // this returns an array with 1 object:
  return translation[0];
};

const translateStory = async (story, targetedLang) => {
  var translatedStory = {};
  try {
    translatedStory.title = await translateText(story.text.title, targetedLang);
    translatedStory.body = await translateText(story.text.body, targetedLang);
    translatedStory.author = await translateText(
      story.text.author,
      targetedLang
    );
    return translatedStory;
  } catch (err) {
    console.log("Sorry! Translation did not work: " + err);
    return null;
  }
};

app.post("/api/translate-text", async (req, res) => {
  const translation = await translateStory(req.body, req.body.language);
  res.json({ translated: translation });
});

//USER DATABASE

var db = mysql.createConnection({
  user: "readwithme",
  host: "127.0.0.1",
  password: "readwithme12345",
  database: "savedstories",
  port: 3005,
});

app.post("/create-user", async (req, res) => {
  const username = req.body.username;
  db.query(
    "INSERT INTO user (savedlinks.user) VALUES (?)",
    [username],
    (err, results) => {
      console.log(err);
    }
  );
});

db.query(
  "INSERT INTO savedlinks.user (username) VALUES (?)",
  ["test"],
  (err, results) => {
    console.log(err);
  }
);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
