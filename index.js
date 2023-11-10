import express from "express";
import {dirname} from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const _dirname = dirname(fileURLToPath(import.meta.url));
const appServer = express();
const port = 3000;
const todayList = [];
const workItemList = [];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const days = ["Sunday" ,"Monday" ,"Tuesday","Wednesday","Thursday","Friday","Saturday"];

appServer.use(express.static("public"));

appServer.use(bodyParser.urlencoded({
    extended:true
}));

appServer.listen(port, (req,res) => {
    console.log(`Server is running on port ${port}`);  
})

//mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});
mongoose.connect("mongodb+srv://admin-karthiga:test123@cluster0.e6ubkue.mongodb.net/todoListDB", {useNewUrlParser: true});

const itemSchema = new mongoose.Schema({
    itemName : {
        type:String,
        required:true
    },
    flag: {
    type:String,
    required:true
    }
});

const Item = mongoose.model("Item",itemSchema);

//Item Retrieval
appServer.get("/" , (req,res) => {
    
    Item.find({flag:"today"})
    .catch(function (err) {
        console.log(err);
    })
    .then(items => {
        res.render(_dirname+"/index.ejs", {
            header:getDate(),
            workItemArray : items
        });
    });
    
})

appServer.get("/work" , (req,res) => {
    Item.find({flag:"work"})
    .catch(function (err) {
        console.log(err);
    })
    .then(items => {
        res.render(_dirname+"/index.ejs", {
            header : "Work List",
            workItemArray : items
        });
    });
})

appServer.post("/add" , (req,res) => {
   var listItem = req.body["list-item"];
   var headerValue = req.body['addItem'];
   if(headerValue === "Work List"){
            insertDataIntoDB("work",listItem);
            res.redirect("/work");
            
    } else {
            insertDataIntoDB("today",listItem);   
            res.redirect("/");     
            /*addItem(listItem,todayList);
            res.render(_dirname+"/index.ejs", {
                header:headerValue,
                workItemArray : todayList
            });*/
    }    
});

appServer.post("/delete",(req,res) => {
    const objectID = req.body.objectID;
    const itemType = req.body.itemType;
    Item.findByIdAndRemove({ _id: objectID })
    .then(() => {
      console.log(`Successfully Deleted the id - ${objectID}`);
    })
    .catch((err) => {
      console.log(err);
    });
    if(itemType === "work"){
        res.redirect("/work");
    } else {
        res.redirect("/");
    }
});

function getDate(){
    var date = new Date().getDate();
    var month = new Date().getMonth();
    var day = new Date().getDay();
    return days[day]+", "+months[month]+" "+date;
}

function addItem(listItem , listItemList){
    if(listItem!="" && !listItemList.includes(listItem,0)){
        listItemList.push(listItem);
    }
}

function insertDataIntoDB(flagValue , listItem){
    const item = new Item({
        itemName :listItem,
        flag:flagValue
    });
    item.save();
}