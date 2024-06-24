const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if(!username || !password){
    return res.status(400).send("Invalid parameters");
  }
  if(!isValid){
    return res.status(400).send("can not register existing user");
  }
  users.push({
    username,password
  });
  return res.status(200).send(username + " register success");

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(300).send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  if(books[isbn]){
    return res.status(200).send(books[isbn]);
  }else{
    return res.status(404).send("can not found book with given isbn" );
  }

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
   const auth = req.params.author;
   Object.keys(books).forEach(item=>{
      if(item.author === auth){
        return res.status(200).send(item);
      }
   })
   return res.status(404).send("can not found book with given author" );
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  Object.keys(books).forEach(item=>{
     if(item.title === title){
       return res.status(200).send(item);
     }
  })
  return res.status(404).send("can not found book with given title" );
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if(books[isbn]){
    return res.status(200).send(books[isbn].reviews);
  }else{
    return res.status(404).send("can not found book with given isbn" );
  }
});

module.exports.general = public_users;
