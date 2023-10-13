const express = require("express");
const app = express();
const port = 3001;

const uploadMiddleware = require("./static/uploadMiddleware")
const { FFMpegProgress } = require("ffmpeg-progress-wrapper");

const fs = require("fs");
const path = require("path");

const nedb = require("nedb");
let usersdb;

const cors = require("cors");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

let prgsMap = new Map();
const uploadPath = path.join(__dirname, "public");

app.post("/register", (req, res)=>{
  const {login, password} = req.body;
  res.setHeader("Content-Type", "application/json");

  usersdb.findOne({login}, (err, doc)=>{
    if(err) return res.json({ok: false, msg: err});
    if(doc) return res.json({ok: false, msg: "Login already in use"});
  
    usersdb.insert({login, password}, (err, newDoc)=>{
      if(err) return res.json({ok: false, msg: err});
      res.json({ok: true, id: newDoc._id});
    })
  })
})

app.post("/login", (req, res)=>{
  const {login, password} = req.body;
  res.setHeader("Content-Type", "application/json");

  usersdb.findOne({login, password}, (err, doc)=>{
    if(!doc) return res.json({ok: false, msg: "Incorrect user data"});
    res.json({ok: true, id: doc._id});
  })
})

app.get("/vids",(req, res)=>{
  const directoryPath = path.join(__dirname, "converted");
  fs.readdir(directoryPath, function (err, files) {
    if (err) return console.log('Unable to scan directory: ' + err);

    const vids = files.map(video=>{
      const vidStats = fs.statSync(path.join(__dirname, "converted", video));
      return {name: video, size: vidStats.size};
    })

    res.setHeader("Content-Type", "application/json");
    res.json({vids})
  });
})


app.get("/vid/:video", (req, res) => {
  const { video } = req.params;

  res.setHeader("Content-Type", "video/mp4");
  res.sendFile(path.join(__dirname, "converted", video));
});

app.get("/prg/:video", (req, res) => {
  const { video } = req.params;

  res.setHeader("Content-Type", "application/json");
  res.json({ perc: prgsMap[video] });
});

app.post(
  "/api/upload",
  uploadMiddleware(uploadPath),
  function (req, res) {
    const file = req.files.file;
    if (!file || !file.name) {
      res.sendStatus(400);
      return;
    }
    const inputFilePath = file.path;
    const convName = `conv-${file.name}`;

    const outputFolder = path.join(__dirname, "converted");

    let outputFilePath,
      i = 0;
    do {
      let _convName = convName;

      if (i > 0) {
        _convName = _convName.split(".");
        _convName[_convName.length - 2] += `(${i})`;
        _convName = _convName.join(".");
      }

      outputFilePath = path.join(outputFolder, _convName);
      i++;
    } while (fs.existsSync(outputFilePath));

    try {
      prgsMap[convName] = 0;
      res.setHeader("Content-Type", "application/json");
      res.json({ video: convName });

      const process = new FFMpegProgress([
        "-i",
        inputFilePath,
        "-c:v",
        "h264",
        outputFilePath,
      ]);

      process.on("progress", (progress) => {
        prgsMap[convName] = progress.progress * 100000;
      });

      process.once("end", () => {
        prgsMap[convName] = "100";
      });
    } catch (e) {
      console.log(e);
    }
  }
);

const checkMkDir = (filePath)=>{
  if (!fs.existsSync(filePath)) {
    fs.mkdir(filePath, (err) => {
      if (err) throw err;
    });
  }
}

const dirs = ["public", "converted", "data"];
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
  dirs.forEach(dir=>checkMkDir(path.join(__dirname, dir)));

  usersdb = new nedb(path.join(__dirname, "data", "users.db"));
  usersdb.loadDatabase();
});
