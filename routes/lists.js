const mongoose = require("mongoose");
const router = require("express").Router();
const { Item } = require("../models/itemModel");
const List = require("../models/listModel");
const _ = require("lodash");

let errorMsg = "";
let urlParam = "";
const currentYear = new Date().getFullYear();

let itemsArray = [];

const item1 = new Item({
  content: "Eat",
});

const item2 = new Item({
  content: "Sleep",
});

const item3 = new Item({
  content: "Clean",
});

const item4 = new Item({
  content: "Read",
});

const list1 = {
  name: "Today",
  formattedName: "today",
  toDo: [item1, item2],
  done: [item3, item4],
};

const list2 = {
  name: "Work",
  formattedName: "work",
  toDo: [item4],
  done: [],
};

// Home page
router.route("/").get(async (req, res) => {
  List.find().then(lists => {
      // If no lists, create Today and Work list
      if (lists.length === 0) {
        List.create(list1);
        List.create(list2);
        res.redirect("/");
      } else {
        res.render("index", {
            currentYear: currentYear,
            listTitles: lists,
            showList: lists[0],
            errorMsg: errorMsg,
            urlParam: urlParam,
          }); 
      }
  }).catch(err => console.log(err));

});

// Show list using parameters
router.route("/:listName").get((req, res) => {
  const urlTitle = req.params.listName;

  // Find list titles for sidebar
  List.find({}, (err, listTitles) => {
      // Find requested list
    List.findOne({ formattedName: urlTitle }, (err, thisList) => {
      if (err) {
        console.log(err);
      } else {
        res.render("index", {
          currentYear: currentYear,
          listTitles: listTitles,
          showList: thisList,
          errorMsg: errorMsg,
          urlParam: urlParam,
        });
      }
    });
  });
});

// Add New List
router.route("/addNewList").post((req, res) => {
  let newTitle = _.capitalize(req.body.newListTitle);
  lowerCaseTitle = _.lowerCase(newTitle);
  formattedTitle = lowerCaseTitle.replace(/[^a-zA-Z0-9]/g, "_");
  List.findOne({ formattedName: formattedTitle }, function (err, listExists) {
    if(!listExists && formattedTitle === "") {
      errorMsg =
        "You should enter a list name.";
      urlParam = formattedTitle;
      res.redirect("/" + formattedTitle);
    } 
    else if (!listExists && listExists !== "") {
          const list = new List({
            name: newTitle,
            formattedName: formattedTitle,
          });
            list.save();
            res.redirect("/" + formattedTitle);
                  
    }  
    else {
      errorMsg =
        "A list with this title already exists, you have now been redirected.";
      urlParam = formattedTitle;
      res.redirect("/" + formattedTitle);
    }
  });
});

// If user tries to add new list title that already exists, redirect
router.route("/redirect").post((req, res) => {
  if (errorMsg != "") {
    errorMsg = "";
    res.redirect("/" + urlParam);
  } 
});

// Delete list
router.route("/deleteList").post((req, res) => {
  const listToDelete = req.body.listToDelete;

  List.findByIdAndDelete(listToDelete)
    .then(() => res.redirect("/"))
    .catch((err) => res.status(400).json("Error: " + err));

});

var ObjectId = require('mongoose').Types.ObjectId; 

// Update list title
router.route("/editTitle").post((req, res) => {
  let newTitle = _.capitalize(req.body.newListTitle);
  let newFormattedName = _.lowerCase(newTitle).replace(/[^a-zA-Z0-9]/g, "_");
  let oldFormattedName = req.body.originalFormattedName;
  const listTitleID = req.body.listTitleID;
  let count;

  List.countDocuments({formattedName: newFormattedName}, function(err, found) {
    count = found;
    if (count === 0) {
      List.findByIdAndUpdate(
        { _id: listTitleID },
        { name: newTitle, formattedName: newFormattedName },
        function (err, result) {
          if (err) {
            console.log(err);
          } else {
            res.redirect("/" + newFormattedName);
          }
        }
      );
    } else {
      errorMsg =
        "A list with this title already exists, please choose a different title.";
      urlParam = oldFormattedName;
      res.redirect("/" + oldFormattedName);
    }
});

  
  
});

module.exports = router;
