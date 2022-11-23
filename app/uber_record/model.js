const enumerate = require("../utils/enum");

module.exports = function(mongoose){
  var schema_riderecord = mongoose.Schema(
    {    
      rider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rider',
        required : true
      },
      pickup_address: String,
      dropoff_address: String,
      price: String,
      time: String,
      ownerMessage: String
    },
    { timestamps: true }
  );
  const RideRecord = mongoose.model("riderecord", schema_riderecord);
  return RideRecord;
};