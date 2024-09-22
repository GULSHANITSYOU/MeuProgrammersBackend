import multer from "multer";

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/Temp/"); // Directory to store files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Unique file names
  },
});

// Initialize multer with the storage engine
export const upload = multer({ storage: storage });
