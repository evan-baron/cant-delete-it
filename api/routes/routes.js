const express = require("express");
const authRoutes = require("./authRoutes");
const contactRoutes = require("./contactRoutes");
const tokenRoutes =require("./tokenRoutes");
const userRoutes = require("./userRoutes");

const router = express.Router();

// Register all routes here
router.use(authRoutes);
router.use(contactRoutes);
router.use(tokenRoutes);
router.use(userRoutes);

module.exports = router;
