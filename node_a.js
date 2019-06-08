var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var ejs = require('ejs');
var port = 8080;
var requests;
var requests_history;

app.set("view engine","ejs");

async function getRequestsAndRequestHistory(res)
{  
    const client = new MongoClient(url);
   try{
    
    await client.connect();
    console.log("Connected correctly to server");

     const db = client.db("serverSetup");
     requests = await db.collection('Requests').find({allocated_node_name:"Node_a"}).toArray();
     requests_history = await db.collection('Requests_history').find({allocated_node_name:"Node_a"}).toArray();
     res.render("index.ejs",{requests:requests,requests_history:requests_history});
    // res.send("You have accessed" + port);
  }
   catch(error)
   {
       return error.stack;
   }
}

app.get("/",function(req,res)
{      
    var res;
    getRequestsAndRequestHistory(res);

})


app.listen(port,function()
{
    console.log("Port"+ port + "running");
})