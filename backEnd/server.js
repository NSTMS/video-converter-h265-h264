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

let prgsMap = new Map();

app.get('/vid/:video',(req, res)=>{
    const {video} = req.params;

    res.setHeader('Content-Type', 'video/mp4');
    res.sendFile(path.join(__dirname, 'converted', video));
})

app.get('/prg/:video',(req, res)=>{
    const {video} = req.params;

    res.setHeader('Content-Type', 'application/json');
    res.json({perc: prgsMap[video]});
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
        const convName = `conv-${file.name}`;

        const outputFolder = path.join(__dirname, 'converted');

        let outputFilePath, i = 0;
        do{
            let _convName = convName;

            if(i > 0){
                _convName = _convName.split('.');
                _convName[_convName.length - 2] += `(${i})`;
                _convName = _convName.join('.');
            }

            outputFilePath = path.join(outputFolder, _convName);
            i++;
        }while(fs.existsSync(outputFilePath))
         

        try {
            prgsMap[convName] = 0;
            res.setHeader('Content-Type', 'application/json');
            res.json({video: convName});

            const process = new FFMpegProgress(['-i', inputFilePath,'-c:v', 'h264',  outputFilePath]);    

            process.on('progress', (progress) => {
                prgsMap[convName] = progress.progress * 10000;
            });

            process.once('end', ()=>{
                prgsMap[convName] = "End";
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