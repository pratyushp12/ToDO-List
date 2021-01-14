const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const ejs = require('ejs');

const app = express();
const date = require(__dirname + "/date.js")

const items = [];
const officeItem = [];

app.use(bodyParser.urlencoded({extended : true}));

app.set('view engine', 'ejs');

app.use(express.static("public"));

app.get("/",(req,res)=>{

  var day = date.getDate();
  res.render("list",{listTitle : day , newItems : items});
})

app.get("/office",(req,res)=>{
  res.render("list",{listTitle : "Office Work List", newItems : officeItem})
})

app.post("/",(req,res)=>{
  if(req.body.list === "Office"){
    const newOfficeItem = req.body.addList;
    officeItem.push(newOfficeItem);
    res.redirect("/office");

}
else
{
  const newItem = req.body.addList;
  items.push(newItem);
  res.redirect("/");
}

})



app.listen(3000,()=>{
  console.log("server is listening to port 3000");
})
