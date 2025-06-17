const globalConstants = require('../../const/globalConstants')
module.exports = {

  "development": {
    "username": globalConstants.DB_USER,
    "password": globalConstants.DB_PASSWORD,
    "database": globalConstants.DB_NAME,
    "host": globalConstants.DB_HOST,
    "dialect": globalConstants.DB_DIALECT,
    "logging": false
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
}
