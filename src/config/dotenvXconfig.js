const dotenvx = require("@dotenvx/dotenvx");
dotenvx.config();

module.exports = {
  HOST: process.env.HOST || "No encontré variable localhost",
  PORT: process.env.PORT || "No encontré PORT",
  API_URL: process.env.API_URL || "No encontré variable",
  CONNECTION_STRING:
    process.env.CONNECTION_STRING || "SIN CADENA DE CONEXION A MONGO DB",
  DATABASE: process.env.DATABASE || "db_default",
  DB_PASSWORD: process.env.DB_PASSWORD || "admin",
  DB_USER: process.env.DB_USER || "admin",
  REDIS_URL : process.env.REDIS_URL || "No encontré variable para conexión a Redis"
};
