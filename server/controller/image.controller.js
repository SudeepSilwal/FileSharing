import File from "../models/file.js";
import path from 'path';
import fs from 'fs';
import { promises as fsPromises } from 'fs';

const BASE_URL = process.env.BASE_URL || 'http://localhost:8000'; // Default to localhost in development

export const uploadFile = async (req, res) => {
  const fileObject = {
    path: `/tmp/${req.file.filename}`, // Use /tmp for Vercel
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size,
    uploadedAt: Date.now(),
  };

  try {
    const file = await File.create(fileObject);
    res.status(200).json({
      path: `${BASE_URL}/file/${file._id}`,
    });
  } catch (error) {
    console.log("Error in uploading file", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const downloadImage = async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    const absolutePath = path.resolve(file.path);

    try {
      await fs.promises.access(absolutePath);
    } catch (error) {
      return res.status(404).json({ message: 'File not found on the server' });
    }

    // Buffer the file and send as response
    fs.readFile(absolutePath, (err, data) => {
      if (err) {
        console.error('Error reading file:', err.message);
        return res.status(500).json({ message: 'Error reading the file' });
      }
      res.setHeader('Content-Disposition', `attachment; filename=${file.name}`);
      res.setHeader('Content-Type', file.type);
      res.send(data); // Send the buffered file data
    });

  } catch (error) {
    console.error('Error in downloading file:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};



const deleteOldFiles = async () => {
  try {
    const now = Date.now();
    // Filter files older than 15 minutes
    const files = await File.find({ uploadedAt: { $lt: now - 15 * 60 * 1000 } });

    for (const file of files) {
      const filePath = path.resolve(file.path);
      try {
        await fsPromises.access(filePath); // Check file existence asynchronously
        await fsPromises.unlink(filePath); // Delete file
        console.log(`Deleted file: ${file.name}`);
      } catch (error) {
        console.log(`Error deleting file: ${file.name}`, error.message);
      }

      await File.findByIdAndDelete(file._id);
      console.log(`Deleted file record: ${file.name}`);
    }
  } catch (error) {
    console.error('Error deleting old files:', error.message);
  }
};

// Run the function every minute
setInterval(deleteOldFiles, 60 * 1000);