module.exports = app => {
  const accounts = require("./view.js");

  var router = require("express").Router();

  // Create a new Rider
  router.post("/rider", accounts.createRider);

  // Create a new Company
  router.post("/company", accounts.createCompany);
 
  // delete all data
  router.delete("/delall_accounts", accounts.deleteAllAccounts);
  router.delete("/delall_companies", accounts.deleteAllCompanies);
 
  // Test Api
  router.get("/test_socket", accounts.testApi);

  app.use("/api/accounts", router);
};
