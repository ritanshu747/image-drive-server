// controllers/imageSearch.js

const File = require('../models/File');

exports.imageSearch = async (req, res) => {
    try {
        const { name } = req.body;

        // Check if name is provided
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Please provide a name to search for."
            });
        }

        // Search for the image by name in MongoDB
        const imageFound = await File.findOne({ name: name });

        // If no image found, return 404 status
        if (!imageFound) {
            return res.status(404).json({
                success: false,
                message: "Image not found with this name. Please try with a different name."
            });
        }

        // If image found, return 200 status with image URL and details
        res.status(200).json({
            success: true,
            imageUrl: imageFound.fileUrl,
            file: imageFound,
            message: "Image found successfully",
            
        });
        

    } catch (error) {
        console.error('Error finding image:', error);
        res.status(500).json({
            success: false,
            message: "Something went wrong while searching for the image."
        });
    }
};
