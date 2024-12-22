import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    path: {
        type: String,
        required: true,
    },
    downloadContent: {
        type: Number,
        required: true,
        default: 0,
    },
    uploadedAt: { // Add this field
        type: Date,
        default: Date.now,
    }
});

const File = mongoose.model('File', fileSchema);

export default File;
