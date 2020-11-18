const dotenv = require("dotenv")
 
dotenv.config();

// Get the Host from Environment or use default
// Get the Host from Environment or use default
const host = process.env.MYSQL_HOST || 'localhost';

// Get the User for DB from Environment or use default
const user = process.env.MYSQL_USER || 'root';

// Get the Password for DB from Environment or use default
const password = process.env.MYSQL_PASS || '';

// Get the Database from Environment or use default

module.exports = { host, user, password };
