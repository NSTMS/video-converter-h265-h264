const express = require('express');
const app = express();
const port = 3001;

const formidableMiddleware = require('express-formidable');

const {FFMpegProgress} = require('ffmpeg-progress-wrapper');

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

app.get('/vid/:video',(req, res)=>{
    const {video} = req.params;

    res.setHeader('Content-Type', 'video/mp4');
    res.sendFile(path.join(__dirname, 'converted', video));
})

app.post(
    "/api/upload",
    formidableMiddleware({
        encoding: "utf-8",
        uploadDir: uploadPath,
        keepExtensions: true,
    },
    [
        {
            event: 'fileBegin',
            action: (_, __, ___, name, file)=>{
                file.path = path.join(__dirname, 'public', file.name);
            } 
        }
    ]),
    function (req, res) {
        const file = req.files.file;
        if (!file || !file.name) {
            res.sendStatus(400);
            return;
        }
        const inputFilePath = file.path;
        const outputFilePath = path.join(__dirname, 'converted', `conv-${file.name}`);
        try {
            const process = new FFMpegProgress(['-i', inputFilePath,'-c:v', 'h264',  outputFilePath]);
            // process.on('raw', ()=>{
            //     console.log("Raw");
            // });
    
            // process.once('details', (details) => console.log(JSON.stringify(details)));

            process.on('progress', (progress) => console.log(progress.frame));

            process.once('end', ()=>{
                console.log("End")
                res.setHeader('Content-Type', 'video/mp4');
                res.sendFile(outputFilePath);
            });
            
        } catch (e) {
            console.log(e);
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
    if (!fs.existsSync(path.join(__dirname, 'converted'))) {
        fs.mkdir(path.join(__dirname, 'converted'), (err) => {
            if (err) throw err;
        })
    }
});