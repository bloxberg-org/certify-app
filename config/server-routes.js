const controllers = require("../controllers");
const multer = require("multer");
cors = require("cors");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = app => {
  //Certify Smart Contract Functions
  app.post(
    "/certifyData",
    cors(),
    controllers.certifyController.certifyData.post
  );
  app.post(
    "/registerWeb3",
    cors(),
    controllers.certifyController.registerWeb3.post
  );
  app.post(
    "/verifyData",
    cors(),
    controllers.certifyController.verifyData.post
  );
  app.post(
    "/generateCertificate",
    cors(),
    controllers.generateCertificate.generateCertificate.post
  );
  //Ancilliary Functions
  app.post(
    "/sendBloxbergEmail",
    cors(),
    controllers.sendBloxbergEmail.sendBloxbergEmail.post
  );
  app.get(
    "/healthcheck",
    cors(),
    controllers.healthcheck.healthcheck.get
  )
};
