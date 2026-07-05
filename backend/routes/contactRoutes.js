const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");

// Create new contact message
router.post("/", contactController.createContact);

// Fetch all contact messages
router.get("/", contactController.getAllContacts);

// Update contact status
router.put("/:id", contactController.updateContactStatus);

// Delete a contact message
router.delete("/:id", contactController.deleteContact);

module.exports = router;
