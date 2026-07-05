const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");


public_users.post("/register", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  //Write your code here
  try {
    // calling same backend API using axios (simulated async behavior)
    const response = await axios.get("http://localhost:5000/books");

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;

    // calling books API (simulating async behavior)
    const response = await axios.get("http://localhost:5000/books");

    const books = response.data;

    if (books[isbn]) {
      return res.status(200).json(books[isbn]);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }

  } catch (error) {
    return res.status(500).json({
      message: "Error fetching book details",
      error: error.message
    });
  }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;

    // simulate async API call
    const response = await axios.get("http://localhost:5000/books");
    const books = response.data;

    let authorBooks = {};

    Object.keys(books).forEach((key) => {
      if (books[key].author === author) {
        authorBooks[key] = books[key];
      }
    });

    return res.status(200).json(authorBooks);

  } catch (error) {
    return res.status(500).json({
      message: "Error fetching books by author",
      error: error.message
    });
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;

    // simulate async API call
    const response = await axios.get("http://localhost:5000/books");
    const books = response.data;

    let titleBooks = {};

    Object.keys(books).forEach((key) => {
      if (books[key].title === title) {
        titleBooks[key] = books[key];
      }
    });

    return res.status(200).json(titleBooks);

  } catch (error) {
    return res.status(500).json({
      message: "Error fetching books by title",
      error: error.message
    });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;

  return res.send(JSON.stringify(books[isbn].reviews, null, 4));
});

module.exports.general = public_users;
