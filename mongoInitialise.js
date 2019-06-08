var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("serverSetup");
  var myobj = {Name:"Node_a",Number_of_CPUs:5,Available_CPUs:5,Memory_Size:"8GB",Memory_available:"8GB"}
  dbo.collection("nodes").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
   
  });
  var myobj = {Name:"Node_b",Number_of_CPUs:10,Available_CPUs:10,Memory_Size:"16GB",Memory_available:"16GB"}
  dbo.collection("nodes").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
   
  });
  var myobj = {Name:"Node_c",Number_of_CPUs:8,Available_CPUs:8,Memory_Size:"32GB",Memory_available:"32GB"}
  dbo.collection("nodes").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
   
  });
  var myobj = {Name:"Node_d",Number_of_CPUs:6,Available_CPUs:6,Memory_Size:"64GB",Memory_available:"64GB"}
  dbo.collection("nodes").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
 



})