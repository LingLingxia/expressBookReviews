const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  const findUsers = users.filter(item=>{
    return item.username === username
 })
 if(findUsers.length>0){
   return false;
 }
 return true
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  const findUsers = users.filter(item=>{
    return item.username === username && item.password ===password
  })
  return findUsers.length>0
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if(!username || !password){
    return res.status(400).send("Invalid parameters");
  }
  if(authenticatedUser(username,password)){
    let accessToken = jwt.sign({
      data:username
    },"access",{expiresIn:60 * 60})

    req.session.Authentication ={
        accessToken
    }
    return res.status(200).send("login success");
  }else{
    return res.status(208).send("Invalid login");
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.query.username;
  const review = req.query.review;
  if(books[isbn]){
    books[isbn].reviews[username] = review;
    return res.status(200).send("review add success");
  }else{
    return res.status(404).send("can not found book with given isbn" );
  }
 
});

regd_users.delete("/auth/review/:isbn",(req,res)=>{
   const user = req.session.user.data.username;
   const isbn = req.params.isbn;
   if(books[isbn]){
    delete books[isbn].reviews[user];
    return res.status(200).send("delete success");
  }else{
    return res.status(404).send("can not found book with given isbn" );
  }

})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
