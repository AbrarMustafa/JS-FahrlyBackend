module.exports = app => {
  const uber = require("./view.js");

  var router = require("express").Router();
 
  // Create a rides record
  router.get("/get_uber_ride", uber.get_uber_ride);

  // Create a new Rider
  router.post("/add_uber_ride", uber.add_uber_ride); 

  app.use("/api/uber", router);
};
