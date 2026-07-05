const Setting = require('../models/Setting');

// Get settings
const getSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }
    res.status(200).json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    next(error);
  }
};

// Update settings
const updateSettings = async (req, res, next) => {
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
    next(error);
  }
};

module.exports = {
  getSettings,
  updateSettings
};
