// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "Hello, welcome to my blog page";
const aboutContent = "Hii , i'm Rohit and i like to travel";
const contactContent = "Click here to contact me ";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

const postSchema = new mongoose.Schema({
    title: String,
    content: String
  });
  
const Post = mongoose.model("Post", postSchema);

let posts = [];

app.get("/", function(req, res){
  Post.find({}, function(err, posts){
    if (err) {
      console.error("Error retrieving posts: ", err);
      res.send("There was an error loading the home page.");
      } else {
      console.log("Posts retrieved: ", posts);
      res.render("home", {
        startingContent: homeStartingContent,
        posts: posts
      });
    }
  });
}); 


app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function (err) {
    if (!err) {
      res.redirect("/");
    } else {
      console.error("Error saving post: ", err);
      res.send("There was an error saving your post.");
    }
  });
});

app.get("/posts/:postId", function (req, res) {
  const requestedPostId = req.params.postId;

  Post.findOne({ _id: requestedPostId }, function (err, post) {
    if (!err) {
      res.render("post", {
        title: post.title,
        content: post.content
      });
    } else {
      console.error("Error retrieving post: ", err);
      res.send("There was an error retrieving the post.");
    }
  });
});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});