import React, { useState } from "react";
import axios from "axios";

function UploadPage() {
  const [file, setFile] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  const handleLogin = () => {
    if (username === "admin" && password === "admin") {
      setAuthenticated(true);
    } else {
      alert("Invalid credentials!");
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert(response.data);
    } catch (error) {
      alert("Error uploading file.");
    }
  };

  if (!authenticated) {
    return (
      <div>
        <input
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default UploadPage;
