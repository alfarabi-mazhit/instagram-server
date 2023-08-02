const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userPostsDir = path.join(
      "./public/users/",
      req.user.id.toString(),
      "/posts/"
    );
    fs.mkdirSync(userPostsDir, { recursive: true });
    cb(null, userPostsDir);
  },
  filename: function (req, file, cb) {
    let ext = file.originalname.split(".");
    ext = ext[ext.length - 1];
    const filename =
      (req.user.id || file.originalname) + "_" + Date.now() + "." + ext;
    cb(null, filename);
  },
});
const upload = multer({ storage });
module.exports = { upload };
