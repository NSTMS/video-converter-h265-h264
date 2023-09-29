const formidableMiddleware = require("express-formidable");

module.exports = () => {
    return formidableMiddleware(
        {
          encoding: "utf-8",
          uploadDir: uploadPath,
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