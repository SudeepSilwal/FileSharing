import File from "../models/file.js";
import path from 'path';
import fs from 'fs';

export const uploadFile = async (req, res) => {
  const fileObject = {
    path: `uploads/${req.file.filename}`, // Save the file path
    name: req.file.originalname, // Save the original name
    type: req.file.mimetype,
    size: req.file.size,
    uploadedAt: Date.now(),  // Add the timestamp for when the file was uploaded
  };

  try {
    const file = await File.create(fileObject); // Store the file info in DB
    res.status(200).json({
      path: `${process.env.BASE_URL}/file/${file._id}`, // Provide the link to download the file
    });
  } catch (error) {
    console.log("Error in uploading file", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const downloadImage = async (req, res) => {
  try {
    // Find the file based on the file ID passed in the URL
    const file = await File.findById(req.params.fileId);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Resolve the file path
    const absolutePath = path.resolve(file.path); // This resolves to 'uploads/filename.ext'

    // Check if the file exists on the server
    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ message: 'File not found on the server' });
    }

    // Send the file for download
    res.download(absolutePath, file.name, (err) => {
      if (err) {
        console.error('Error in downloading file:', err.message);
        return res.status(500).json({ message: 'Could not download the file' });
      }
    });

  } catch (error) {
    console.error('Error in downloading file:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
const deleteOldFiles = async () => {
  try {
      const files = await File.find();

      // Current time
      const now = Date.now();

      // Loop through each file and check if it is older than 15 minutes
      for (const file of files) {
          const fileAge = now - new Date(file.uploadedAt).getTime();
          if (fileAge > 15 * 60 * 1000) { // 15 minutes in milliseconds
              // Delete the file from the server
              const filePath = path.resolve(file.path);
              if (fs.existsSync(filePath)) {
                  fs.unlinkSync(filePath); // Remove file
                  console.log(`Deleted file: ${file.name}`);
              }

              // Remove the file record from the database
              await File.findByIdAndDelete(file._id);
              console.log(`Deleted file record: ${file.name}`);
          }
      }
  } catch (error) {
      console.error('Error deleting old files:', error.message);
  }
};

// Run the function every minute
setInterval(deleteOldFiles, 60 * 1000); // Check every minute
