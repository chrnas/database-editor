const express = require("express");
const cors = require("cors");
const { Client } = require("pg");
const fs = require("fs");
const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;
var client;

client = new Client({
    host: "tambourdb.postgres.database.azure.com",
    user: "chrnas",
    password: "TambourHero1400!",
    port: 5432,
    database: "postgres",
    ssl: { ca: fs.readFileSync("DigiCertGlobalRootCA.crt.pem") },
  });
client.connect();

//Get request handling connection to database
app.get("/connect", (req, res) => {
  const config = {
    host: req.query.Host,
    user: req.query.User,
    password: req.query.Password,
    port: parseInt(req.query.Port),
    database: req.query.Database,
    ssl: { ca: req.query.Ssl },
  };
  client = new Client(config);
  client.connect();
  res.status(200).json({ message: "Database connected" });
  console.log(`
  Connected to database using:
  Host: ${config.host}
  User: ${config.user}
  Password:${config.password}
  Database:${config.database}
  Ssl:${config.ssl}
  `);
});

//Get request handling disconnection to database
app.get("/disconnect", (req, res) => {
  client.end();
  res.status(200).json({ message: "Database disconnected" });
});

//Get request sending query to database without return
app.get("/query", (req, res) => {
const query = req.query.Query;
console.log(req.query.Query);
client.query(
    query,
    (err, result) => {
    res.status(200).json({message: "query executed"});
    }
);
console.log('query executed');
});

//Get request sending query to database and providing response with queryresult to frontend
app.get("/queryresult", (req, res) => {
const query = req.query.Query;
console.log(req.query.Query);
client.query(
    query,
    (err, result) => {
    console.log(result.rows);
    res.status(200).json(result.rows);
    }
);
console.log('query executed');
});

//Let server listen for request on port: PORT
app.listen(PORT, () => {
console.log(`Server is listening at port ${PORT}...`);
});

