var express = require('express');
var bodyParser = require("body-parser");
var app = express();
var port = 8085;
var docs;
const proxy = require('http-proxy-middleware');


app.use(bodyParser.urlencoded({ extended: true }));

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

const { routes } = require('./config.json');

function handleRequests(resServer,cpu_needed,memory_needed,time_to_process)
{
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("serverSetup");
    dbo.collection("nodes").find({}).toArray(function(err, result) {
      if (err) throw err;
      docs = result;
      for(var i = 0;i < docs.length;i++)
      {   
          if(docs[i].Available_CPUs >= cpu_needed && parseInt(docs[i].Memory_available.slice(0,docs[i].Memory_available.length-2)) >= memory_needed)
          {
            console.log(docs[i].Name);
            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var dbo = db.db("serverSetup");
                var myquery = { Name: docs[i].Name };
                var newvalues = { $set: {Available_CPUs: parseInt(docs[i].Available_CPUs)-cpu_needed, Memory_available: parseInt(docs[i].Memory_available.slice(0,docs[i].Memory_available.length-2))-memory_needed + "GB"} };
                dbo.collection("nodes").updateOne(myquery, newvalues, function(err, res) {
                  if (err) throw err;
                  console.log("1 document updated");
                if(myquery.Name == "Node_a")
                { 
                  MongoClient.connect(url, function(err, db) {
                    if (err) throw err;
                    var dbo = db.db("serverSetup");
                    var myobj = {allocated_node_name:myquery.Name,Starttime:Date.now(),CPU_required:cpu_needed,Memory_required:memory_needed+"GB",time_required_for_completion:time_to_process}
                    dbo.collection("Requests").insertOne(myobj, function(err, res) {
                      if (err) throw err;
                      console.log("1 document inserted");
                      resServer.redirect("/backend1");
                      db.close();
                    });
                    });
                
                }
                else if(myquery.Name == "Node_b")
                {
                  MongoClient.connect(url, function(err, db) {
                    if (err) throw err;
                    var dbo = db.db("serverSetup");
                    var myobj = {allocated_node_name:myquery.Name,Starttime:Date.now(),CPU_required:cpu_needed,Memory_required:memory_needed+"GB",time_required_for_completion:time_to_process}
                    dbo.collection("Requests").insertOne(myobj, function(err, res) {
                      if (err) throw err;
                      console.log("1 document inserted");
                      resServer.redirect("/backend2");
                      db.close();
                    });
                    });
                }
                else if(myquery.Name == "Node_c")
                {
                  MongoClient.connect(url, function(err, db) {
                    if (err) throw err;
                    var dbo = db.db("serverSetup");
                    var myobj = {allocated_node_name:myquery.Name,Starttime:Date.now(),CPU_required:cpu_needed,Memory_required:memory_needed+"GB",time_required_for_completion:time_to_process}
                    dbo.collection("Requests").insertOne(myobj, function(err, res) {
                      db.close();                     if (err) throw err;
                      console.log("1 document inserted");
                      resServer.redirect("/backend3");
                      db.close();
                    });
                    });
                }
                else if(myquery.Name == "Node_d")
                {
                  MongoClient.connect(url, function(err, db) {
                    if (err) throw err;
                    var dbo = db.db("serverSetup");
                    var myobj = {allocated_node_name:myquery.Name,Starttime:Date.now(),CPU_required:cpu_needed,Memory_required:memory_needed+"GB",time_required_for_completion:time_to_process}
                    dbo.collection("Requests").insertOne(myobj, function(err, res) {
                      if (err) throw err;
                      console.log("1 document inserted");
                      resServer.redirect("/backend4");
                      db.close();
                    });
                    });
                }
                else
                {
                  resServer.send("NO NODE AVAILABLE");
                }
                                

                
                });
              });
                break;
          }
      }
      db.close();
    });
  });
 

}

async function processRequests(resServer,cpu_needed,memory_needed,time_to_process,requests)
{   
     var docs;
     var currentRequest
     const client = new MongoClient(url);
     
     try {
        await client.connect();
        console.log("Connected correctly to server");
    
        const db = client.db("serverSetup");
    
        // Insert a single document
        let docs = await db.collection('nodes').find({}).toArray();
       // assert.equal(1, docs.insertedCount);
        let requests = await db.collection('Requests').find({}).toArray();
         
        for (var i = 0;i < requests.length;i++){
             console.log(parseInt(requests[i].Memory_required.slice(0,requests[i].Memory_required.length-2))); 

             if(Date.now() - requests[i].Starttime >= parseInt(requests[i].time_required_for_completion)*1000)
             {
                                     var docToUpdate =await db.collection("nodes").find({Name:requests[i].allocated_node_name}).toArray();
                                     
                                     var myquery = { Name: docToUpdate[0].Name};
                                     var newvalues = { $set: {Available_CPUs: parseInt(docToUpdate[0].Available_CPUs)+parseInt(requests[i].CPU_required), Memory_available: parseInt(docToUpdate[0].Memory_available.slice(0,docToUpdate[0].Memory_available.length-2))+ parseInt(requests[i].Memory_required.slice(0,requests[i].Memory_required.length-2)) + "GB"} };
                                       
                                     r = await db.collection("nodes").updateOne(myquery, newvalues);
                                     r = await db.collection('Requests_history').insert(requests[i]);
                                     r = await db.collection("Requests").findOneAndDelete(requests[i]);
            }
        }
        handleRequests(resServer,cpu_needed,memory_needed,time_to_process);

        
      } catch (err) {
        console.log(err.stack);
      }
     
}

 function init(resServer,cpu_needed,memory_needed,time_to_process)
{   
    var requests;
    MongoClient.connect(url, function(err, db,) {
        if (err) throw err;
        var dbo = db.db("serverSetup");
        dbo.collection("Requests").find({}).toArray(function(err, result1) {
          if (err) throw err;
              requests = result1;
              processRequests(resServer,cpu_needed,memory_needed,time_to_process,requests);
            });
            db.close();
          });     
       
}



for (route of routes) {
  app.use(route.route,
      proxy({
          target: route.address,
          pathRewrite: (path, req) => {
              return path.split('/').slice(2).join('/'); // Could use replace, but take care of the leading '/'
          }
      })
  );
}

app.get("/",function(req,res)
{ 
    res.send("You have accessed load balancer");
});
app.post('/',function(req,resServer)
{    
  var cpu_needed = req.body.cpu_needed;
  var memory_needed = req.body.memory_needed;
  var time_to_process = req.body.time_to_process;
  
           init(resServer,cpu_needed,memory_needed,time_to_process);
      
 
      
      
    
});


app.listen(port,function()
{
    console.log("Port"+ port + "running");
});
