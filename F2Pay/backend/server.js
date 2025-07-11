const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.post("/upload", (req, res) => {
  const { image, username } = req.body;
  if (!image || !username) return res.status(400).send("Missing data");

  const userFolder = path.join(__dirname,".." ,"/frontend/public/labels", username);
  console.log(userFolder)
  // Ensure directory exists
  if (!fs.existsSync(userFolder)) {
    fs.mkdirSync(userFolder, { recursive: true });
  }

  // Get the next available filename (1.png, 2.png, ...)
  const files = fs.readdirSync(userFolder).filter(f => f.endsWith(".png"));
  const nextFileNumber = files.length + 1;
  const filePath = path.join(userFolder, `${nextFileNumber}.png`);

  // Save the image
  const imageData = image.replace(/^data:image\/png;base64,/, "");
  fs.writeFile(filePath, imageData, "base64", (err) => {
    if (err) return res.status(500).send("Error saving image");
    res.send({ message: "Image saved", path: filePath });
  });
});

app.get("/folders", (req, res) => {
  const directoryPath = path.join(__dirname, "../frontend/public/labels"); // Change to your directory

  fs.readdir(directoryPath, { withFileTypes: true }, (err, files) => {
    if (err) return res.status(500).json({ error: err.message });

    const folderNames = files.filter(file => file.isDirectory()).map(dir => dir.name);
    res.json(folderNames); // Send array to frontend
  });
});



app.listen(3000, () => console.log("Server running on port 3000"));
