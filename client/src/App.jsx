import React, { useRef, useState, useEffect } from "react";
import { uploadFile } from "./services/api";

function App() {
  const fileInputRef = useRef();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadLink, setUploadLink] = useState(null);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [result, setResult] = useState(null);

  const onUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadLink(null); // Reset the link when a new file is selected
      setError(null); // Clear previous errors
      setTimeLeft(null); // Reset timer
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    setError(null);

    try {
      const data = new FormData();
      data.append("name", selectedFile.name);
      data.append("file", selectedFile);

      const response = await uploadFile(data);
      setResult(response.path);

      setUploadLink(response.data?.link || "Error: No link provided");
      setTimeLeft(15 * 60); // Set timer for 15 minutes
    } catch (err) {
      setError("Failed to upload file. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!timeLeft) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer); // Cleanup timer
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="bg-black flex items-center justify-center h-screen w-full">
      <div className="border-2 w-[90%] md:w-[70%] h-[80%] bg-white rounded-md flex items-center flex-col justify-between p-5">
        <h1 className="font-bold text-center text-[30px] md:text-[35px]">
          Simple File Sharing!
        </h1>
        <p className="font-semibold text-center text-[18px] md:text-[25px] text-gray-600">
          Upload and Share.
        </p>
        <button
          onClick={onUploadClick}
          className="border-2 px-4 py-2 mt-4 rounded-lg bg-blue-700 text-white font-medium"
          aria-label="Upload File"
        >
          Upload
        </button>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        {selectedFile && (
          <div className="w-full text-center mt-4">
            <p className="text-gray-700">
              Selected File: <span className="font-medium">{selectedFile.name}</span>
            </p>
            <button
              onClick={handleUpload}
              className="border-2 px-4 py-2 mt-4 rounded-lg bg-blue-700 text-white font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Uploading..." : "Get Link"}
            </button>
          </div>
        )}
        {uploadLink && (
          <div className="mt-4 text-center">
            <p className="text-green-700">
              File Link:{" "}
              <a href={result} target="_blank" rel="noopener noreferrer" className="underline">
                {result}
              </a>
            </p>
            {timeLeft !== null && (
              <p className="mt-2 text-red-700">
                This file expires in <span className="font-bold">{formatTime(timeLeft)}</span>
              </p>
            )}
          </div>
        )}
        {error && <p className="mt-4 text-red-700">{error}</p>}
      </div>
    </div>
  );
}

export default App;
