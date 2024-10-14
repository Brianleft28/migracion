class MigracionesFechas {
  constructor(connection) {
    this.connection = connection;
  }

  async clearTable() {
    const response = await this.connection.query(
      "DELETE FROM migraciones_fechas"
    );
    return response;
  }

  async insertBatch(data) {
    const insertQuery =
      "INSERT INTO migraciones_fechas (documento, fentrega, fproxima, cantidad, zona) VALUES ?";
    const [result] = await this.connection.query(insertQuery, [data]);
    return result;
  }
}

export default MigracionesFechas;
