const db = require("./index.js");
const Account = db.account;
const Rider = db.rider;
const Company = db.company;

exports.createRider = async (req, res) => {

  try {
    // Validate request
    if (!req.body.firebase_token || !req.body.company_code) {
      throw {  message: "companycode & firebase_token can not be empty"}
    }
    // Get Company By Code  
    var _company = await Company.findOne({ company_code: req.body.company_code })
    if (!_company) {
      throw {  message:  "Not found Company Code " + req.body.company_code  }
    }
    // Create a Account
    const _account = new Account({
      phone: req.body.phone,
      name: req.body.name,
    });
    await _account.save();

    // Create a Rider
    const _rider = new Rider({
      firebase_token: req.body.firebase_token,
      firebase_fcm_token: "",
      device_type: "",
      account: _account._id,
      company: _company._id
    });
    data = await _rider.save()
    if (!data)
    throw {   message:  err.message || "Some error occurred while creating the Rider."    } 
    else {
      _company.riders.push(_rider)
      _company.save()
      // res.send(data);
      var _companyaccount = await Account.findOne({ _id: _company.account })
      res.json({"id":data._id,"name":_account.name,"company":_companyaccount.name});
    }
  } catch (error) {
    res.status(401).json({message:error.message, isSuccess: false});
  }
};

exports.createCompany = async (req, res) => {
  // Validate request
  if (!req.body.company_code) {
    res.status(404).send({ message: "company_code can not be empty!" });
    return;
  }

  // Create a Account
  const _account = new Account({
    phone: req.body.account.phone,
    name: req.body.account.name,
  });
  await _account.save();

  // Create a Company
  const _company = new Company({
    company_code: req.body.company_code,
    account: _account._id,
  });
  data = await _company.save()
  if (!data)
    res.status(500).send({ message: err.message || "Some error occurred while creating the Company." });
  else {
    res.send(data);
  }
};


// --------------------------------------------------DELETE ALL------------------------------------------------------//


exports.deleteAllAccounts = async (req, res) => {
  data = await Account.deleteMany({});
  if (!data)
    res.status(500).send({ message: err.message || "Some error occurred while deleting all Accounts." });
  else {
    res.send(data);
  }
};

exports.deleteAllCompanies = async (req, res) => {
  data = await Company.deleteMany({});
  if (!data)
    res.status(500).send({ message: err.message || "Some error occurred while deleting all Companies." });
  else {
    res.send(data);
  }
};



// --------------------------------------------------TEST SOCKETS------------------------------------------------------//
exports.testApi = async (req, res) => {
  const ws = require('ws');

  const client = new ws('ws://localhost:3000?623deda68fdce508c59b61e2');

  client.on('open', () => {
    // Causes the server to print "Hello"
    client.send(JSON.stringify({ data: "client message" }));
    client.onmessage = (rec) => {
      console.log(rec.data);
    };
  });
  // setTimeout(function(){ client.close();console.log("closing connection from client timer");}, 3000);
};