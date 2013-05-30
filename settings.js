var settings = {};

settings.burstApi = {
  url: process.env.SETTINGS_BURST_API_URL,
  key: process.env.SETTINGS_BURST_API_KEY,
  secret: process.env.SETTINGS_BURST_API_SECRET
};

module.exports = settings;
