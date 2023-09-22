const express = require('express');
const path = require("path")
const formidableMiddleware = require('express-formidable');
const formidable = require('formidable');
const fs = require('fs');
const app = express();
const port = 3001;
const ffmpeg = require('ffmpeg');
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
        console.log(ffmpeg)
        try {
            var process = new ffmpeg(inputFilePath);
            process.then(function (video) {
                // Callback mode
                video.setVideoCodec('h.264')
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
});