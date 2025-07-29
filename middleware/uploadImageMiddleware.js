const fs = require("fs");
const path = require("path");
const slugify = require("slugify");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (req.restaurantFolderPath) {
            return cb(null, req.restaurantFolderPath);
        }
        const { name } = req.body;
        let counter = 1;
        const baseFolderName = slugify(name, {
            replacement: "_",
            remove: /[*+~.()'"!:@]/g,
            lower: true,
            strict: true,
            trim: true,
        });
        // let dir = path.join("/Users/ila/static", baseFolderName); // Local tests
        let dir = path.join("/weats/restaurants", baseFolderName); // For Web
        while (fs.existsSync(dir)) {
            dir = path.join("/weats/restaurants", baseFolderName); // For web
            // dir = path.join("/Users/ila/static", `${baseFolderName}-${counter}`); //Local tests
            counter += 1;
        }
        fs.mkdirSync(dir, { recursive: true });
        req.restaurantFolder = path.basename(dir);
        req.restaurantFolderPath = dir;
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const uploadImageMiddleware = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 12,
    },
});

module.exports = {
    uploadImageMiddleware,
};
