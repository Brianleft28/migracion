class BeneficiosCiudadanos {
  constructor(connection) {
    this.connection = connection;
  }

  async updateFromMigracionesFechas() {
    const updateScript = `
        UPDATE beneficios_ciudadanos bc
        JOIN migraciones_fechas mf ON bc.ciudadano_id = mf.ciudadano_id
        SET bc.fentrega = mf.fentrega, bc.fproxima = mf.fproxima, bc.cantidad = mf.cantidad
        WHERE bc.ciudadano_id = mf.ciudadano_id;
      `;

    await this.connection.query(updateScript);
  }
}

export default BeneficiosCiudadanos;
