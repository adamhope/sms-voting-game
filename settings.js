var settings = {};

settings.burstApi = {
  url: process.env.SETTINGS_BURST_API_URL,
  key: process.env.SETTINGS_BURST_API_KEY,
  secret: process.env.SETTINGS_BURST_API_SECRET,
  callerId: process.env.SETTINGS_BURST_CALLER_ID
};

module.exports = settings;
