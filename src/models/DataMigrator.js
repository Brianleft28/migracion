import ExcelJS from "exceljs";
import MigracionesFechas from "./entities/MigracionesFechas.js";
import BeneficiosCiudadanos from "./entities/BeneficiosCiudadanos.js";
import chalk from "chalk";

class DataMigrator {
  constructor(connection) {
    this.connection = connection;
    this.migracionesFechas = new MigracionesFechas(connection);
    this.beneficiosCiudadanos = new BeneficiosCiudadanos(connection);
  }

  async clearTable() {
    const response = await this.migracionesFechas.clearTable();
    return response;
  }

  async readAndFormatExcel(filePath) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet(1); // Asume que los datos están en la primera hoja

    const formattedData = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        // Asume que la primera fila es el encabezado
        const rowData = {
          documento: row.getCell(1).value,
          fentrega: row.getCell(2).value,
          fproxima: row.getCell(3).value,
          cantidad: row.getCell(4).value,
          zona: row.getCell(5).value,
        };
        formattedData.push(rowData);
      }
    });
    return formattedData;
  }

  async readAndFormatExcel2(filePath) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const formattedData = [];
    // Mapeo de nombres de hojas a IDs
    const zoneMap = {
      "BARRIO NUEVO": 11,
      PILAR: 12,
      "SA I": 13,
      "SA II": 14,
      SUR: 15,
      TORCACITA: 16,
      VA: 17,
      VE: 18,
      VITACAL: 19,
      OTROS: 20,
      DOMICILIO: 21,
      "CAPILLA GUADALUPE": 22,
      "CD JUANA AZURDUY": 23,
    };
    // iterar sobre cada hoja
    workbook.eachSheet((sheet, sheetId) => {
      const zoneId = zoneMap[sheet.name.toUpperCase().trim()];
      if (zoneId === undefined) {
        console.log(`${chalk.bold.red("Error:")} ${sheet.name} no mapeado`);
        return; // Saltar esta hoja si no se encuentra en el mapeo
      }

      sheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          // Asume que la primera fila es el encabezado
          const rowData = {
            documento: row.getCell(1).value,
            fentrega: row.getCell(6).value,
            fproxima: row.getCell(7).value,
            cantidad: row.getCell(5).value,
            zona: zoneId,
          };
          formattedData.push(rowData);
        }
      });
    });
    return formattedData;
  }

  async migrateData(formattedData) {
    const batchSize = 1000; // Tamaño del lote
    let totalRowsAffected = 0;
    for (let i = 0; i < formattedData.length; i += batchSize) {
      const batch = formattedData
        .slice(i, i + batchSize)
        .map((row) => [
          row.documento,
          row.fentrega,
          row.fproxima,
          row.cantidad,
          row.zona,
        ]);
      const result = await this.migracionesFechas.insertBatch(batch);
      totalRowsAffected += result.affectedRows;
      console.log(
        `  Lote ${i / batchSize + 1}: ${result.affectedRows} rows affected`
      );
    }
    console.log("");
    console.log(` Total rows affected: ${totalRowsAffected}`);
  }

  async updateBeneficiosCiudadanos() {
    await this.beneficiosCiudadanos.updateFromMigracionesFechas();
  }
}

export default DataMigrator;
