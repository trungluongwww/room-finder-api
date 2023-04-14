import multer from "multer";
import path from "path";
import random from "../../../../external_node/ultils/strings/random";
import constants from "../../../../external_node/constants";
import errorCode from "../../../../internal/error-code";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, constants.upload.destination);
  },
  filename(req, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
    cb(null, "photo" + random.randomCode() + "-" + file.originalname);
  },
});

export default multer({
  storage: storage,
  fileFilter(req, file: Express.Multer.File, cb: multer.FileFilterCallback) {
    if (!file) {
      cb(null, false);
      return cb(new Error("file not found"));
    }

    // validate size
    if (file.size > constants.upload.sizeFile.photo) {
      return [null, Error(errorCode.upload.UPLOAD_INVALID_SIZE)];
    }

    const ext = path.extname(file.originalname).replace(".", "").toLowerCase();
    if (!constants.upload.extension.photo.includes(ext)) {
      cb(null, false);
      return cb(new Error(errorCode.upload.UPLOAD_INVALID_EXTENSION));
    }
    cb(null, true);
  },
});
