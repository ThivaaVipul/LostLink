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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

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
    const { title, description, status, email, phone, postedBy, uid } = req.body;
    const image = req.file ? req.file : null;

    console.log("Received data:", req.body);
    console.log("Email from request body:", email);

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ message: "Email is required and must be a valid string." });
    }

    const uniqueLink = generateUniqueLink(email.split("@")[0]);

    console.log("Request body:", req.body);
    console.log("Uploaded file:", req.file);

    if (!title || !description || !status || !email || !phone || !postedBy || !image || !uid) {
      return res.status(400).json({ message: "All fields are required." });
    }

    let imageURL = "";
    if (image) {
      const result = await cloudinary.uploader.upload(image.path, {
        folder: "lostlink_images",
      });
      imageURL = result.secure_url;
      console.log("Cloudinary result:", result);
    }

    const newItem = new Item({
      title,
      description,
      status,
      email,
      phone,
      imageURL,
      createdAt: Date.now(),
      postedBy,
      uniqueLink,
      uid
    });

    await newItem.save();
    res.status(201).json({
      message: "Item created successfully",
      newItem,
    });
  } catch (err) {
    console.error("Error creating post:", err.message);
    res.status(500).json({ error: `Failed to create post: ${err.message}` });
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
    // Find the item by uniqueLink
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

    // Update fields
    item.title = title || item.title;
    item.description = description || item.description;
    item.status = status || item.status;
    item.email = email || item.email;
    item.phone = phone || item.phone;

    // Handle new image upload
    if (req.file) {
      // Delete old Cloudinary image if it exists
      if (item.imageURL) {
        const publicId = item.imageURL.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`lostlink_images/${publicId}`);
      }

      // Upload new image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "lostlink_images",
      });
      item.imageURL = result.secure_url;

      // Delete the uploaded temp file
      fs.unlinkSync(req.file.path);
    }

    await item.save();
    res.status(200).json({ message: "Item updated successfully.", item });
  } catch (err) {
    console.error("Error updating item:", err.message);
    res.status(500).json({ message: "Internal server error.", error: err.message });
  }
});






module.exports = router;
