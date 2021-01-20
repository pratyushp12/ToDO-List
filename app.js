const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const ejs = require('ejs');
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
const date = require(__dirname + "/date.js")

app.use(bodyParser.urlencoded({extended : true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-pratyush:Test123@cluster0.caesg.mongodb.net/todolistDB",{useUnifiedTopology: true,useNewUrlParser: true});



const itemsSchema = new mongoose.Schema({
  name : String
});

const Item = mongoose.model("Item",itemsSchema);

const RouteSchema = new mongoose.Schema({
  name : String,
  items : [itemsSchema]
});

const Route = mongoose.model("Route",RouteSchema);

const itemArray = [];


app.get("/",(req,res)=>{
  Item.find({},(err,items)=>{
    res.render("list",{listTitle : "Today", newItems : items});
  })

});

app.get("/:locationRoute",(req,res)=>{
  const route = _.capitalize(req.params.locationRoute);

  Route.findOne({name : route},(err,foundItem)=>{
    if(!err)
    {
    if(!foundItem)
    {
      const list = new Route({
        name : route,
        items : itemArray
      })
      list.save();
      res.redirect("/" + route);
    }
    else
    res.render("list",{listTitle : foundItem.name, newItems : foundItem.items});
  }
  else
  console.log(err);
  })



})

app.post("/",(req,res)=>{
  const newItem = req.body.addList;
  const routeValue = req.body.list;

  const tobeInsertedItem = new Item({name :  newItem});

  if(routeValue === "Today")
  {
    tobeInsertedItem.save((err,item)=>{
      if(!err)
      res.redirect("/");
      else
      console.log(err);
    })
  }
  else
  {
    Route.findOne({name : routeValue},(err,foundItem)=>{
      foundItem.items.push(tobeInsertedItem);
      foundItem.save();
      res.redirect("/" + routeValue);
    })
  }

});

app.post("/delete",(req,res)=>{
  const itemtobeDeleted = req.body.checkedItem;
  const routeLocation = req.body.Routelocation;

  if(routeLocation === "Today")
  {
    Item.deleteOne({_id : itemtobeDeleted},(err)=>{
      if(!err)
      res.redirect("/");
      else
      console.log(err);
    })
  }
  else
  {
    Route.findOneAndUpdate({name : routeLocation},{$pull: {items: {_id : itemtobeDeleted}}},(err,foundItem)=>{
      if(!err)
      {
        res.redirect("/" + routeLocation);
      }
    })
  }

})



app.listen(3000,()=>{
  console.log("server is listening to port 3000");
})
