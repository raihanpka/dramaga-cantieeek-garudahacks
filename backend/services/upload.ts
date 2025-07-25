import { dirname, join } from "path";

import multer from "multer";

if (process.env.VERCEL) {
  throw new Error("File upload is not supported on Vercel. Please use cloud storage (Supabase/S3) for production uploads.");
}

// Use __dirname for CommonJS compatibility
const __dirname = process.cwd();

const storage = multer.diskStorage({
  destination: join(__dirname, "../../uploads"),
  filename: (_, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({ storage });