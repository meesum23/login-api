const express = require("express");
const bodyParser = require("body-parser");
var jwt = require("jsonwebtoken");
const app = express();
const port = 3000;
const secretKey = "asdfghjkl5791214";
app.use(bodyParser.json());
// Static Data
const userData = {
  meesum: {
    email: "meesum@gmail.com",
    password: "12345m",
    posts: [
      {
        post: 1,
        content: "My First post",
        category: "text",
        likes: {
          likedNumber: 2,
          likedBy: ["ali", "abdullah"],
        },
        comments: [
          {
            commentNumber: 1,
            userId: "ali",
            comment: "relaxing post",
          },
        ],
      },
      {
        post: 2,
        content: "My Second post",
        category: "text",
        likes: {
          likedNumber: 2,
          likedBy: ["ali", "abdullah"],
        },
        comments: [
          {
            commentNumber: 1,
            userId: "abdullah",
            comment: "mind relaxing post",
          },
        ],
      },
    ],
  },
  // Meesum's first post data done
  // ali's 2nd post data start
  ali: {
    email: "ali@gmail.com",
    password: "12345a",
    posts: [
      {
        post: 1,
        content: "Hello my name is ali",
        category: "text",
        likes: {
          likedNumber: 2,
          likedBy: ["meesum", "abdullah"],
        },
        comments: [
          {
            commentNumber: 1,
            userId: "meesum",
            comment: "aesthetic post",
          },
        ],
      },
      {
        post: 2,
        content: "i am trainee software engineer at SeeBiz PVT LTD",
        category: "text",
        likes: {
          likedNumber: 2,
          likedBy: ["meesum", "abdullah"],
        },
        comments: [
          {
            commentNumber: 1,
            userId: "abdullah",
            comment: "informational post",
          },
        ],
      },
    ],
  },//Ali's 2nd post done
  //abdullah's 3rd post starts
  abdullah: {
    email: "abdullah@gmail.com",
    password: "12345ab",
    posts: [
      {
        post: 1,
        content: "weather is awesome today",
        category: "text",
        likes: {
          likedNumber: 2,
          likedBy: ["ali", "meesum"],
        },
        comments: [
          {
            commentNumber: 1,
            userId: "ali",
            comment: "nice posting",
          },
        ],
      },
      {
        post: 2,
        content: "Mountains is love",
        category: "text",
        likes: {
          likedNumber: 2,
          likedBy: ["ali", "meesum"],
        },
        comments: [
          {
            commentNumber: 1,
            userId: "meesum",
            comment: "nature explorer",
          },
        ],
      },
    ],
  },
};
//abdullah's 3rd post done
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  for (let data in userData) {
    if (userData[data].email == email && userData[data].password == password) {
      let uEmail = userData[data].email;
      var token = jwt.sign({ email: uEmail }, secretKey);
      return res.status(200).json({
        message: "Login successful",
        token
      });
    }
  }
  return res.status(401).json({
    message: "Invalid username or password",
  });
});
//middleware function starts
function authenticate(req, res, next) {
  console.log("Middleware");
  if (req.headers.token) {
    try {
      var decoded = jwt.verify(req.headers.token, secretKey);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({
        message: "Invalid Token",
      });
    }
  } else {
    return res.status(401).json({
      message: "Not Logged in",
    });
  }
}
app.get("/isLoggedIn", authenticate, (req, res) => {
  let user = req.user;
  return res.status(200).json({
    message: "is logged in",
    user,
  });
});
// get is used to start login post
app.get('/profile', authenticate, (req, res) => {
    const loggedInEmail = req.user.email;
    let userPosts = null;
    for (let userKey in userData) {
      if (userData[userKey].email === loggedInEmail) {
        userPosts = userData[userKey].posts;
        break;
      }
    }
    if (userPosts) {
      return res.status(200).json({
        message: "Profile posts",
        posts: userPosts
      });
    } else {
      return res.status(404).json({
        message: "No posts of login user"
      });
    }
  });
// timeline post without user
app.get('/timeline' ,authenticate, (req , res)=>{
let loginEmail = req.user.email;
let timelinePost = [];
for (let userKey in userData){
    if(userData[userKey].email != loginEmail){
        timelinePost =timelinePost.concat(userData[userKey].posts)
    }
}
return res.status(200).json({
    message : "timeline posts",
    posts : timelinePost
});
}) ;
// middleware function end
app.listen(port, () => {
  console.log(`Example  app listening on port ${port}`);
});