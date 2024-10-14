# Migración Mensual de Beneficiarios

Este proyecto realiza la migración mensual de datos de beneficiarios desde un archivo Excel a una base de datos. Además, actualiza la tabla `beneficios_ciudadanos` en la base de datos.

---

## Instalación

```sh
git clone https://bitbucket.org/municipio-ituzaingo/migracion_fortalecimiento/src/main/

cd migracion_fortalecimiento
npm install
npm run start
```

---

## Uso

- 1. Crea el directorio src/data de manera local, ya que se excluye en el .gitignore

- 2. Coloca el archivo Excel con los datos de los beneficiarios en el directorio src/data.

- 3. Ejecuta el script principal:

```sh
npm run start
```

- 4. Sigue las instrucciones en pantalla para seleccionar el archivo y realizar la migración.

---

## Estructura del projecto

```md
├── src
│ ├── data
│ │ ├── formatted
│ │ │ └── tu-archivo-formatted.xlsx
│ │ ├── fortalecimiento
│ │ │ └── tu-archivo-fortalecimiento.xlsx
│ ├── models
│ │ ├── db
│ │ │ └── DataBase.js
│ │ ├── entities
│ │ │ ├── MigracionesFechas.js
│ │ │ └── BeneficiosCiudadanos.js
│ │ └── DataMigrator.js
│ └── index.js
├── .env
├── package.json
└── README.md
```

### Explicación de los cambios

1. **Instrucciones de Uso**:

   - Se ha añadido la creación de las carpetas `formatted` y `fortalecimiento` dentro del directorio `src/data`.
   - Se ha especificado que los archivos Excel deben colocarse en las carpetas correspondientes.

2. **Estructura del Proyecto**:
   - Se ha actualizado la estructura del proyecto para reflejar las nuevas carpetas `formatted` y `fortalecimiento` dentro del directorio `src/data`.

Con estos cambios, el archivo `README.md` ahora refleja correctamente la estructura del proyecto y proporciona instrucciones claras sobre cómo organizar los archivos Excel para la migración de datos.
