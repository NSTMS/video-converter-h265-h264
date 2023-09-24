const express = require('express');
const app = express();
const port = 3001;

const formidableMiddleware = require('express-formidable');

const ffmpeg = require('ffmpeg');

const fs = require('fs');
const path = require("path")

const cors = require('cors')
const uploadPath = path.join(__dirname, "public")
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(formidableMiddleware({
//     encoding: "utf-8",
//     keepExtensions: true,
//     uploadDir: path.join(__dirname, "public")
// }));

app.use(cors())
app.post(
    "/api/upload",
    formidableMiddleware({
        encoding: "utf-8",
        uploadDir: uploadPath,
        keepExtensions: true,
    }),
    function (req, res) {
        const file = req.files.file;
        if (!file || !file.name) {
            res.sendStatus(400);
            return;
        }
        const inputFilePath = file.path;
        const outputFilePath = path.join(__dirname, 'converted', 'converted_video.mp4');
        try {
            var process = new ffmpeg(inputFilePath);
            process.then(function (video) {
                console.log(video);
                video.setVideoCodec('h264');
                console.log('is good');
            }, function (err) {
                console.log('Error: ' + err);
            });

            
        } catch (e) {
            console.log(e.code);
            console.log(e.msg);
        }
    }
);


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
    if (!fs.existsSync(path.join(__dirname, 'public'))) {
        fs.mkdir(path.join(__dirname, 'public'), (err) => {
            if (err) throw err;
        })
    }
});