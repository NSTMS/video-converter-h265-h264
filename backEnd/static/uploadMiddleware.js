const formidableMiddleware = require("express-formidable");
const path = require("path");

module.exports = (uploadDir) => {
    return formidableMiddleware(
        {
          encoding: "utf-8",
          uploadDir: uploadDir,
          keepExtensions: true,
        },
        [
          {
            event: "fileBegin",
            action: (_, __, ___, name, file) => {
              file.path = path.join(__dirname, "public", file.name);
            },
          },
        ]
      )
}