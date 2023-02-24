//jshint esversion:6

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(process.env.DATABASE_URL + "/todoList");

// "mongodb+srv://gogrene:cat89boy@cluster0.u2pisyg.mongodb.net";

const itemSchema = {
  name: String,
};

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "Go to work",
});

const item2 = new Item({
  name: "Write a new code",
});

const item3 = new Item({
  name: "Buy new items",
});

const defaultItems = [item1, item2, item3];

// list schema
const listSchema = {
  name: String,
  items: [itemSchema],
};
const List = mongoose.model("List", listSchema);

app.get("/", function (req, res) {
  Item.find({}, function (err, foundList) {
    if (err) {
      console.log(err);
    } else {
      if (foundList === {}) {
        Item.insertMany(defaultItems, function (err) {
          if (err) {
            console.log(err);
          } else {
            S;
            console.log("Sucessfully created database");
          }
        });
        res.redirect("/");
      } else {
        res.render("list", {
          listTitle: "Today",
          newListItems: foundList,
        });
      }
    }
  });
});

app.post("/", function (req, res) {
  const newItem = req.body.newItem;
  const listTitle = req.body.list;

  if (newItem !== "") {
    const item = new Item({
      name: newItem,
    });

    if (listTitle === "Today") {
      item.save();
      res.redirect("/");
    } else {
      List.findOne({ name: listTitle }, function (err, foundList) {
        if (err) {
          console.log(err);
        } else {
          foundList.items.push(item);
          foundList.save();
          res.redirect("/" + listTitle);
        }
      });
    }
  } else {
    res.redirect("/" + listTitle);
  }
});

app.post("/delete", function (req, res) {
  const itemId = req.body.itemId;
  const listTitle = req.body.listName;

  if (listTitle === "Today") {
    Item.findByIdAndRemove(itemId, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("successfully deleted itemwith id " + itemId);
        res.redirect("/");
      }
    });
  } else {
    List.findOne({ name: listTitle }, function (err, foundList) {
      if (!err) {
        foundList.items.filter((item) => item.id !== itemId);
        // newlist.save();
        // console.log(newlist);
        res.redirect("/" + listTitle);
      }
    });
    // List.findOneAndUpdate(
    //   { name: listTitle },
    //   { $pull: { items: { id: itemId } } },
    //   function (err, foundList) {
    //     if (!err) {
    //       res.redirect("/" + listTitle);
    //     }
    //   }
  }
});

app.get("/:customParam", function (req, res) {
  const customParam = _.capitalize(req.params.customParam);

  List.findOne({ name: customParam }, function (err, foundList) {
    if (err) {
      console.log(err);
    } else if (!foundList) {
      const list = new List({
        name: customParam,
        items: defaultItems,
      });
      list.save();
      res.redirect("/" + customParam);
    } else {
      res.render("list", {
        listTitle: customParam,
        newListItems: foundList.items,
      });
    }
  });
});

app.listen(3000, function () {
  console.log("Server started on port 3000", "process- ", process.env.DB_URL);
});
