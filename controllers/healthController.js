const { checkDBConnection } = require("../services/healthService.js");

async function healthCheck(req, res) {
  const dbConnection = await checkDBConnection();
  const dbStatus = dbConnection ? "up" : "down";

  const response = {
    status: dbConnection ? "ok" : "error",
    database: dbStatus,
    timestamp: new Date().toISOString(),
  };

  if (dbConnection) {
    res.status(200).json(response);
  } else {
    res.status(503).json(response);
  }
}

module.exports = { healthCheck };

