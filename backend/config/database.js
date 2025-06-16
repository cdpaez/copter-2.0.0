// 1️⃣ Importas Sequelize (clase principal del ORM)
const { Sequelize } = require('sequelize')

// 2️⃣ Configuras los datos de conexión
let sequelize;

if (process.env.NODE_ENV === 'production') {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
} else {
    sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: false,  // Si quieres ver las consultas SQL, ponlo en `true`
  });
}
// 3️⃣ Exportas la instancia para usarla en tus modelos
module.exports = sequelize;
