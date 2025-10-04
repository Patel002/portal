import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "../attach/upload_cv");
const uploadDir1 = path.join(__dirname, "../attach/uploads");

[uploadDir, uploadDir1].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "upload_cv") {
      cb(null, uploadDir);
    } else if (file.fieldname === "profile_img") {
      cb(null, uploadDir1);
    } else {
      cb(new Error("Invalid field name"), null);
    }
  },


  
  filename: function (req, file, cb) {
    
    const ext = path.extname(file.originalname); 
    const baseName = path.basename(file.originalname, ext);
    const timeStamp = Date.now();
  
  
    const newFileName = `${timeStamp}_${baseName}${ext}`;

    const filePath =
      file.fieldname === "upload_cv"
        ? path.join(uploadDir, newFileName)
        : path.join(uploadDir1, newFileName);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); 
    }

    cb(null, newFileName);
  },
});

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
