const Contact = require('../models/Contact');

// Create new contact message
const createContact = async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    const savedContact = await newContact.save();
    res.status(201).json(savedContact);
  } catch (error) {
    console.error("Error creating contact message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Fetch all contact messages
const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update contact status (e.g., mark as Read)
const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedContact) {
      return res.status(404).json({ message: "Contact message not found" });
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    console.error("Error updating contact message status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a contact message
const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedContact = await Contact.findByIdAndDelete(id);

    if (!deletedContact) {
      return res.status(404).json({ message: "Contact message not found" });
    }

    res.status(200).json({ message: "Contact message deleted successfully" });
  } catch (error) {
    console.error("Error deleting contact message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createContact,
  getAllContacts,
  updateContactStatus,
  deleteContact
};
