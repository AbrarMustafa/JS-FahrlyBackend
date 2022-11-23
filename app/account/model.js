const enumerate = require("../utils/enum");

accountModelInit = function(mongoose){
  var schema_account = mongoose.Schema(
    { 
      name: String,
      phone: { type : String , unique : true, required : true },
    },
    { timestamps: true }
  );
  const Account = mongoose.model("account", schema_account);
  return Account;
};
module.exports.accountModelInit = accountModelInit


accountTypeModelInit = (mongoose,type) => {
  switch (type) {
  
    case enumerate.COMPANY:
      var schema_company = mongoose.Schema(
        {
          company_code: String,
          account: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Account',
            required : true
          },
          riders: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Account',
          }]
        },
        { timestamps: true }
      );
    
      const Company = mongoose.model("company", schema_company);
      return Company;

    case enumerate.RIDER:
      var schema_rider = mongoose.Schema(
        {
          firebase_token: String,
          firebase_fcm_token: String,
          device_type: String,
          account: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Account',
            required : true
          },
          company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            required : true
          }
        },
        { timestamps: true }
      );
      const Rider = mongoose.model("rider", schema_rider);
      return Rider;
  }
};

module.exports.accountTypeModelInit = accountTypeModelInit