const File = require("../models/File");
const cloudinary = require("cloudinary").v2;

function isFileTypeSupported(type, supportedTypes) {
    return supportedTypes.includes(type);
}

function isLargeFile(fileSize) {
    const mbSize = fileSize / (1024 * 1024);
    return mbSize > 5; // Adjust the size limit as per your requirements
}

async function uploadFileToCloudinary(file, folder, quality) {
    const options = { 
        folder: folder,
        resource_type: "auto",
        public_id: file.name,
        use_filename: true,
        unique_filename: false
    };

    if (quality) {
        options.quality = quality;
    }

    try {
        const response = await cloudinary.uploader.upload(file.tempFilePath, options);
        return response;
    } catch (error) {
        throw new Error(`Failed to upload to Cloudinary: ${error.message}`);
    }
}

exports.imageUpload = async (req, res) => {
    try {
        const { name, tags, email } = req.body;
        const file = req.files.imageFile;

        if (!file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }

        const supportedTypes = ["jpg", "jpeg", "png"];
        const fileType = file.name.split(".").pop().toLowerCase();

        if (!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success: false,
                message: "File format not supported",
            });
        }

        if (isLargeFile(file.size)) {
            return res.status(400).json({
                success: false,
                message: "File size exceeds limit (5MB)",
            });
        }

        const response = await uploadFileToCloudinary(file, "Study Notion");
        
        const fileData = await File.create({
            name,
            tags,
            email,
            url: response.secure_url,
        });

        res.json({
            success: true,
            imageUrl: response.secure_url,
            message: "Image Successfully Uploaded",
        });
    } catch (error) {
        console.error("Image upload error:", error);
        res.status(400).json({
            success: false,
            message: "Failed to upload image",
        });
    }
};
