require('dotenv').config({ path: '../../.env' });
const bcrypt = require('bcrypt');
const { Sequelize, DataTypes } = require('sequelize');

// 1. Configuración COMPLETAMENTE independiente de Sequelize
const sequelize = new Sequelize({
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432, // Puerto por defecto para PostgreSQL
    dialect: process.env.DB_DIALECT, // Asegúrate que coincida con tu DB
    logging: false,
    define: {
        timestamps: false // Para coincidir con tu configuración
    }
});

// 2. Definición exacta de tu modelo
const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    correo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rol_usuario: {
        type: DataTypes.ENUM('admin', 'vendedor'),
        defaultValue: 'vendedor',
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM('activo', 'inactivo'),
        defaultValue: 'activo',
        allowNull: false
    }
}, {
    tableName: 'usuarios'
});

// 3. Función para crear admin
const createAdmin = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión a la DB exitosa');

        const hashedPassword = await bcrypt.hash('Admin123!', 10);
        await Usuario.create({
            nombre: 'Admin 🚀',
            correo: 'admin_rocket@dominio.com',
            password: hashedPassword,
            rol_usuario: 'admin',
            estado: 'activo'
        });

        console.log('✅ Usuario admin creado: admin_rocket@dominio.com');
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await sequelize.close();
        process.exit(0);
    }
};

// 4. Ejecución
createAdmin();