import { dirname, join } from "path";
import multer from "multer";

// Use __dirname for CommonJS compatibility
const __dirname = process.cwd();

const storage = multer.diskStorage({
  destination: join(__dirname, "../../uploads"),
  filename: (_, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({ storage });