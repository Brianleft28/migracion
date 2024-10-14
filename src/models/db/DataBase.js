import mysql2 from "mysql2/promise";
import "dotenv/config";
import chalk from "chalk";

class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }
    this.connection = null;
    Database.instance = this;
  }
  async connect() {
    if (!this.connection) {
      this.connection = await mysql2.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
      });
    }
    console.log("_".repeat(50));
    console.log("");
    console.log(
      "- -",
      chalk.green.bold("Conexión a la base de datos establecida")
    );
    console.log(
      "- -",
      chalk.green.bold("Base de datos: ") + process.env.DB_NAME
    );
    console.log("_".repeat(50));
    console.log("\n");

    return this.connection;
  }

  getConnection() {
    if (!this.connection) {
      throw new Error("Database connection is not established");
    }
    return this.connection;
  }
}

export default Database;
