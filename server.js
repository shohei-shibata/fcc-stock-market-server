const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const Comment = require('./model/comments');
const Post = require('./model/posts')
const User = require('./model/users')


const app = express();
const router = express.Router();

require('dotenv').load();

console.log(process.env.PORT);

const port = process.env.PORT || 4000;

// db config
const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useMongoClient: true })
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// configure body parser for json format
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//To prevent errors from Cross Origin Resource Sharing, we will set our headers to allow CORS with middleware like so:
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

  //and remove cacheing so we get the most recent comments
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

// Serve static assets
app.use(express.static(path.resolve('build')));

// API ROUTING

// Go to /api to just check if API is working
router.get('/', function(req, res) {
  res.json({ message: 'API Initialized!'});
});

//adding the /comments route to our /api router
router.route('/comments')
//retrieve all comments from the database
.get(function(req, res) {
  //looks at our Comment Schema
  Comment.find(function(err, comments) {
    if (err) { res.send(err); }
    //responds with a json object of our database comments.
    res.json(comments)
  });
})
//post new comment to the database
.post(function(req, res) {
  const comment = new Comment();
  //body parser lets us use the req.body
  comment.author = req.body.author;
  comment.text = req.body.text;
  comment.save(function(err) {
    if (err) { res.send(err); }
    res.json({ message: 'Comment successfully added!' });
  });
});

//Adding a route to a specific comment based on the database ID
router.route('/comments/:comment_id')
//The put method gives us the chance to update our comment based on the ID passed to the route
.put(function(req, res) {
 Comment.findById(req.params.comment_id, function(err, comment) {
   if (err) { res.send(err); }
   //setting the new author and text to whatever was changed. If nothing was changed
   // we will not alter the field.
   (req.body.author) ? comment.author = req.body.author : null;
   (req.body.text) ? comment.text = req.body.text : null;
   //save comment
   comment.save(function(err) {
     if (err) { res.send(err); }
     res.json({ message: 'Comment has been updated' });
   });
 });
})

//delete method for removing a comment from our database
.delete(function(req, res) {
 //selects the comment by its ID, then removes it.
 Comment.remove({ _id: req.params.comment_id }, function(err, comment) {
   if (err) { res.send(err); }
   res.json({ message: 'Comment has been deleted' })
 })
});

// API ROUTING POSTS

router.route('/posts')
// retrieve all posts from the database
.get(function(req, res) {
  Post.find(function(err, posts) {
    if (err) { res.send(err); }
    //responds with a json object of our database comments.
    res.json(posts)
  });
})
// post new posts to the database
.post(function(req, res) {
  let post = new Post();
  // body parser lets us use the req.body
  post.owner = req.body.owner;
  post.description = req.body.description;
  post.status = req.body.status;
  post.repoUrl = req.body.repoUrl;
  post.img = req.body.img;
  
  // save to database
  post.save(function(err) {
    if (err) { res.send(err); }
    res.json({ message: 'Post successfully added!' });
  });
});

// Adding a route to a specific post based on the database ID
router.route('/posts/:post_id')
//get post info by ID
.get(function(req, res) {
  Post.findById(req.params.post_id, function(err, post) {
    if (err) { res.send(err); }
    else { res.json(post); }
  });
})
// The put updates post based on the ID passed to the route
.put(function(req, res) {
 Post.findById(req.params.post_id, function(err, post) {
   if (err) { res.send(err); }
   post.owner = req.body.owner;
   post.description = req.body.description;
   post.status = req.body.status;
   post.repoUrl = req.body.repoUrl;
   post.img = req.body.img;
   //save post
   post.save(function(err) {
     if (err) { res.send(err); }
     res.json({ message: 'Post has been updated' });
   });
 });
})

//delete method for removing a post from our database
.delete(function(req, res) {
 //selects the post by its ID, then removes it.
 Post.remove({ _id: req.params.post_id }, function(err, post) {
   if (err) { res.send(err); }
   res.json({ message: 'Post has been deleted' })
 })
});

// API ROUTING USERS

router.route('/users')
// retrieve all users from the database
.get(function(req, res) {
  User.find(function(err, users) {
    if (err) { res.send(err); }
    //responds with a json object of our database comments.
    res.json(users)
  });
})
// post new users to the database
.post(function(req, res) {
  let user = new User();
  // body parser lets us use the req.body
  user.username = req.body.username;
  user.displayName = req.body.displayName;
  user.avatar = req.body.avatar;
  user.skillset = req.body.skillset;
  user.email = req.body.email;
  // save to database
  user.save(function(err) {
    if (err) { res.send(err); }
    res.json({ message: 'User successfully added!' });
  });
});

// Adding a route to a specific user based on the database ID
router.route('/users/:user_id')
//get user info by ID
.get(function(req, res) {
  User.findById(req.params.user_id, function(err, user) {
    if (err) { res.send(err); }
    else { res.json(user); }
  });
})
// The put updates user based on the ID passed to the route
.put(function(req, res) {
 User.findById(req.params.user_id, function(err, user) {
   console.log(user);
   if (err) { res.send(err); }
   user.username = req.body.username;
   user.displayName = req.body.displayName;
   user.avatar = req.body.avatar;
   user.skillset = req.body.skillset;
   user.email = req.body.email;
   //save user
   user.save(function(err) {
     if (err) { res.send(err); }
     res.json({ message: 'User has been updated'});
   });
 });
})

//delete method for removing a user from our database
.delete(function(req, res) {
 //selects the user by its ID, then removes it.
 User.remove({ _id: req.params.user_id }, function(err, user) {
   if (err) { res.send(err); }
   res.json({ message: 'User has been deleted' })
 })
});

// If request doesn't match api request always return the main index.html, so react-router render the route in the client
app.get('/', (req, res) => {
  res.sendFile(path.resolve('build', 'index.html'));
});

// Defines api route
app.use('/api', router);

app.listen(port, function() {
 console.log(`api running on port ${port}`);
});
