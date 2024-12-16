const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinaryModule = require("cloudinary").v2;
require("dotenv").config();

// Cloudinary Configuration
const cloudinary = cloudinaryModule;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer Storage to use Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "avatar",
        format: async (req, file) => "png",
        public_id: (req, file) => file.originalname.split(".")[0],
    },
});

const upload = multer({ storage });

module.exports = { cloudinary, storage, upload };