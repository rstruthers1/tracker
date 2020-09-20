module.exports = {
  HOST: process.env.TRACKERDB_HOST,
  USER: process.env.TRACKERDB_USERNAME,
  PASSWORD: process.env.TRACKERDB_PASSWORD,
  DB: process.env.TRACKERDB_SCHEMA,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
