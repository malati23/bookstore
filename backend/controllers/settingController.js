const Setting = require('../models/Setting');

// Get settings
const getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }
    res.status(200).json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update settings
const updateSettings = async (req, res) => {
  try {
    const settingsData = req.body;
    let settings = await Setting.findOne();
    
    if (!settings) {
      settings = new Setting(settingsData);
      await settings.save();
    } else {
      settings = await Setting.findOneAndUpdate({}, settingsData, { new: true });
    }
    
    res.status(200).json(settings);
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getSettings,
  updateSettings
};
