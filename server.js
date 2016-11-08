var express = require('express');
var bodyParser = require("body-parser");
var mongodb = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

var app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

var db;
var one;

mongodb.connect('mongodb://vincentlee:vincentlee@ds141937.mlab.com:41937/mongo-demo',function(err,database){
   if(err) return console.error(err);
   
   db = database;
   one = db.collection('one');
   
   app.listen(8080,function(){
       console.log('Listening to 8080...');
   });
});

//Add
app.post('/',function(req,res){
   one.save(req.body,function(err,result){
       if(err) return console.error(err);
       
       console.log("Saved: " + JSON.stringify(req.body));
       res.redirect('/');
   });
});

//Print documents on index at top
app.get('/',function(req,res){
   one.find().toArray(function(err,result){
      if(err) return console.error(err);
      
      res.render('index.ejs',{one:result});
   }); 
});

//Delete
app.get('/delete/:id',function(req,res){
    one.remove({"_id":ObjectId(req.params.id)},function(err,result){
       if(err) return console.error(err);
       
       console.log("original url: " + req.get('referer'));
       res.redirect(req.get('referer'));
    });
});

app.get('/update/:id',function(req,res){
   one.find({'_id':ObjectId(req.params.id)}).toArray(function(err,result){
       if(err) return console.error(err);
       
       res.render('edit.ejs',{one:result});
   }); 
});

app.post('/update',function(req,res){
    console.log(req.body);
   one.update(
       {
           '_id':ObjectId(req.body.id)
       }
       ,
       {
            '_id':ObjectId(req.body.id),
            'name':req.body.name,
            'password':req.body.password
       },function(err,result){
           if(err) console.error(err);
           
           res.redirect('/');
       })
});