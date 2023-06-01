import React, { useState } from "react";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.REACT_APP_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_SECRET_KEY,
  },
});

const distributionDomainName = "https://dp50m6277m27e.cloudfront.net/";
// a React functional component, used to create a simple upload input and button

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);


  const handleFileInput = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const uploadFile = async (file) => {
    if (!file) {
      return alert("Please add a file");
    }
    setLoading(true);
    const params = {
      Bucket: "remod-123",
      Key: file.name,
      Body: file,
      //Adding meta data for files
      ContentType: file.type, // Defines type
      ContentDisposition: "inline", // Allows to display files in browser
    };
    const command = new PutObjectCommand(params);
    try {
      const response = await s3Client.send(command);
      console.log(`File uploaded successfully.`, response);
      setLoading(false);
      setSuccess(true)
    } catch (err) {
      console.log("Error", err);
      alert(`Failed: ${err}`)
      setLoading(false);
    }
  };
  return (
    <div className="p-4 m-auto">
      <p className="text-5xl font-extrabold">AWS S3 File Upload 🔺</p>
      <input type="file" onChange={handleFileInput} className="mt-4 italic " />
      {!loading ? (
        <button
          className="border border-black rounded px-3 hover:bg-red-200"
          onClick={() => uploadFile(selectedFile)}
        >
          Upload to S3 🚀
        </button>
      ) : (
        "Loading..."
      )}
      {selectedFile?.name&&success && (
        <div className="flex flex-col-reverse mt-2 ">
          <a
            className="block text-bold font-serif "
            target="__blank"
            href={distributionDomainName + selectedFile?.name}
          >
            {distributionDomainName + selectedFile?.name}
          </a>
          <img
            className="m-auto"
            src={distributionDomainName + selectedFile?.name}
          />
        </div>
      )}
    </div>
  );
};

export default Upload;
