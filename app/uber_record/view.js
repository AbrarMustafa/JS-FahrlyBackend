const db = require("./index.js");
const account_db = require("../account/index.js");
const server = require("../../server.js");
const Rider = account_db.rider;
const Account = account_db.account;
const RideRecord = db.uber_ride;
 
exports.get_uber_ride = async(req, res) => {
  try {
    if ( !req.body.rider_id)  
      throw { message:  "rider_id can not be empty!"  } 

  // get a Uber Rides
  var _rides= await RideRecord.find( {"rider": { "_id" : req.body.rider_id }}) ;
  if (!_rides)
    throw { message:  "Not found rides for " + req.body.rider_id  }  
  res.send(_rides);
  } catch (error) {
    res.status(401).json({message:error.message, isSuccess: false});
  }
}; 

exports.add_uber_ride = async(req, res) => {
  try {
    // Validate request
    if ( !req.body.name) {
      throw { message:  err.message || "name can not be empty!"   } 
    }

    // Get Rider By Name  
    var _account= await Account.findOne({"name": req.body.name}) ;
    if (!_account)
      throw { message:   "Not found account " + req.body.name   } 
    var _rider= await Rider.findOne({"account": { _id: _account.id }});
    if (!_rider)
      throw { message:   "Not found rider"   } 

    // Create a Uber Ride
    const _rideRecord = new RideRecord({
      rider: _rider._id,
      pickup_address: req.body.pickup_address ,
      dropoff_address: req.body.dropoff_address ,
      price: req.body.price ,
      time: req.body.time ,
      ownerMessage: req.body.ownerMessage ,
    });
    data= await _rideRecord.save()
    if(_rider.id in server.activeWebSockets)
        server.activeWebSockets[_rider.id].send(JSON.stringify({"data": [data]}));
    if (!data)
      throw { message:  err.message || "Unknown Error occus while savning rider record message"   } 
    res.send(data);

  } catch (error) {
    res.status(401).json({message:error.message, isSuccess: false});
  }
}; 