const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const cloudinary = require("cloudinary").v2;
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed.'));
    }
    cb(null, true);
  }
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const generateUniqueLink = (username) => {
  const timestamp = Date.now();
  return `${username}-${timestamp}`;
};

router.post("/", upload.single("image"), async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Uploaded File:", req.file);

    const { title, description, status, email, phone, postedBy, uid } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required." });
    }

    const uniqueLink = generateUniqueLink(email.split("@")[0]);

    if (!title || !description || !status || !email || !phone || !postedBy || !uid) {
      return res.status(400).json({ message: "All fields are required." });
    }

    cloudinary.uploader.upload_stream(
      {
        folder: "lostlink_images",
      },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary upload failed:", error);
          return res.status(500).json({ message: "Error uploading image to Cloudinary", error });
        }

        const newItem = new Item({
          title,
          description,
          status,
          email,
          phone,
          imageURL: result.secure_url,
          createdAt: Date.now(),
          postedBy,
          uniqueLink,
          uid,
        });

        try {
          await newItem.save();
          res.status(201).json({ message: "Item created successfully", newItem });
        } catch (err) {
          console.error("Database save error:", err);
          res.status(500).json({ error: err.message });
        }
      }
    ).end(req.file.buffer);
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

router.get("/:uniqueLink", async (req, res) => {
  try {
    const item = await Item.findOne({ uniqueLink: req.params.uniqueLink });
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Error fetching item details", error: err.message });
  }
});

router.delete("/:uniqueLink", authMiddleware, async (req, res) => {
  const { uniqueLink } = req.params;

  try {
    const item = await Item.findOne({ uniqueLink });
    if (!item) {
      return res.status(404).json({ message: "Item not found." });
    }

    const userId = req.user.userId;
    const userRole = req.user.role;

    if (item.imageURL) {
      const publicId = item.imageURL.split("/").pop().split(".")[0];
      console.log("Deleting Cloudinary image with ID:", publicId);

      await cloudinary.uploader.destroy(`lostlink_images/${publicId}`, (error, result) => {
        if (error) {
          console.error("Error deleting image from Cloudinary:", error);
          return res.status(500).json({ message: "Error deleting image from Cloudinary", error });
        }
        console.log("Cloudinary Image Delete Result:", result);
      });
    }

    await Item.deleteOne({ uniqueLink });

    res.status(200).json({ message: "Item and image deleted successfully." });
  } catch (err) {
    console.error("Error deleting item:", err.message);
    res.status(500).json({ message: "Internal server error.", error: err.message });
  }
});

router.put("/:uniqueLink", authMiddleware, upload.single("image"), async (req, res) => {
  const { uniqueLink } = req.params;
  const { title, description, status, email, phone } = req.body;

  try {
    const item = await Item.findOne({ uniqueLink });
    if (!item) {
      return res.status(404).json({ message: "Item not found." });
    }

    item.title = title || item.title;
    item.description = description || item.description;
    item.status = status || item.status;
    item.email = email || item.email;
    item.phone = phone || item.phone;

    if (req.file) {
      const publicId = item.imageURL.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`lostlink_images/${publicId}`);

      cloudinary.uploader.upload_stream(
        {
          folder: "lostlink_images",
        },
        async (error, result) => {
          if (error) {
            console.error("Cloudinary upload failed:", error);
            return res.status(500).json({ message: "Error uploading image to Cloudinary", error });
          }

          item.imageURL = result.secure_url;
          try {
            await item.save();
            res.status(200).json({ message: "Item updated successfully.", item });
          } catch (err) {
            console.error("Database save error:", err);
            res.status(500).json({ error: err.message });
          }
        }
      ).end(req.file.buffer);
    } else {
      await item.save();
      res.status(200).json({ message: "Item updated successfully.", item });
    }
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
