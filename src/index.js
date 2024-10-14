import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Database from "./models/db/DataBase.js";
import chalk from "chalk";
import DataMigrator from "./models/DataMigrator.js";

// Getting the directory name and filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataBase = new Database();

const main = async () => {
  console.log("_".repeat(50));
  console.log("");
  console.log(
    `- - Migración mensual de beneficiarios - ${chalk.bold.green(
      `Desarrollo Social`
    )}`
  );
  // Connect to the database
  await dataBase.connect();
  const connection = dataBase.getConnection();
  const dataMigrator = new DataMigrator(connection);

  // Main menu
  const mainMenu = await inquirer.prompt([
    {
      type: "list",
      name: "option",
      message: "Seleccione una opción",
      choices: [
        "Migrar datos (Formato 1)", //  documento	fentrega	fproxima	cantidad	zona
        "Migrar datos (Formato 2)", //  DNI	NOMBRE	DOMICILIO	ESTADO	RAC	FECHA	PROX FECHA	FIRMA
        "Salir",
      ],
    },
  ]);

  switch (mainMenu.option) {
    case "Migrar datos (Formato 2)":
      // Leer archivos del directorio src/data/fortalecimiento
      const dataDir2 = path.join(__dirname, "data/fortalecimiento");
      const files2 = fs.readdirSync(dataDir2);

      const fileChoice2 = await inquirer.prompt([
        {
          type: "list",
          name: "file",
          message: "Seleccione un archivo",
          choices: files2,
        },
      ]);
      const fileName2 = path.join(fileChoice2.file);
      const pathFile2 = path.join(dataDir2, fileChoice2.file);
      console.log(chalk.blue.bold(`Leyendo archivo ${fileName2}...`));
      try {
        const formattedData2 = await dataMigrator.readAndFormatExcel2(
          pathFile2
        );
        // Truncate the table
        await dataMigrator.clearTable();
        // Migrar datos a la base de datos
        await dataMigrator.migrateData(formattedData2);
        // Actualizar la tabla de beneficios ciudadanos
        await dataMigrator.updateBeneficiosCiudadanos();
        console.log(chalk.green.bold("- Datos migrados con éxito"));
      } catch (error) {
        console.log(chalk.red.bold("Error al leer el archivo"));
        console.log(error);
        process.exit(1);
      }
      break;

    case "Migrar datos (Formato 1)":
      // Leer archivos del directorio src/data/formatted
      const dataDir = path.join(__dirname, "data/formatted");
      const files = fs.readdirSync(dataDir);

      const fileChoice = await inquirer.prompt([
        {
          type: "list",
          name: "file",
          message: "Seleccione un archivo",
          choices: files,
        },
      ]);

      const fileName = path.join(fileChoice.file);
      const pathFile = path.join(dataDir, fileChoice.file);
      console.log(chalk.blue.bold(`Leyendo archivo ${fileName}...`));

      try {
        // Leer y formatear el archivo Excel
        const formattedData = await dataMigrator.readAndFormatExcel(pathFile);
        // Migrar datos a la base de datos
        await dataMigrator.migrateData(formattedData);
        // Actualizar la tabla de beneficios ciudadanos
        await dataMigrator.updateBeneficiosCiudadanos();
        console.log(chalk.green.bold(" -Datos migrados con éxito"));
      } catch (error) {
        console.log(chalk.red.bold("Error al leer el archivo"));
        console.log(error);
        process.exit(1);
      }
      break;

    case "Salir":
      console.log(chalk.blue.bold("Saliendo..."));
      process.exit(0);
  }
};
main();
