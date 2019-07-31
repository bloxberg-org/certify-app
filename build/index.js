
var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.bloxberg.env.NODE_ENV)
}
var express = require("express");
var fs = require("fs");
var https = require("https");
var path = require("path");
var bodyParser = require("body-parser");
var querystring = require("querystring");
var Web3 = require("web3");
var EthereumTx = require("ethereumjs-tx");
const dotenv = require("dotenv");
var app = express();

app.fs = fs;
app.https = https;
app.querystring = querystring;
app.Web3 = Web3;
app.EthereumTx = EthereumTx;

var config;
var configPath = "./config.json";
var configExists = fs.existsSync(configPath, fs.F_OK);
if (configExists) config = JSON.parse(fs.readFileSync(configPath, "utf8"));
app.config = config;

var staticPath = path.posix.join(config.bloxberg.assetsPublicPath, config.bloxberg.assetsSubDirectory)
app.use(staticPath, express.static('./static'))


app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

require("./helpers/debug")(app);
require("./helpers/generateResponse")(app);
require("./helpers/configHelper")(app);
require("./helpers/blockchainHelper")(app);
require("./controllers/index")(app);

app.get("/", function(request, response) {
  response.send("Web3 Injection from Server");
});

app.set("port", process.env.PORT || 3000);

app.listen(app.get("port"), function() {
  console.log("Web3 Injection from Server", app.get("port"));
});
