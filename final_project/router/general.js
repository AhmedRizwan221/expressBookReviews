const express = require("express");
let books = require("./booksdb.js");
const public_users = express.Router();
const axios = require("axios");


// GET all books
public_users.get("/", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/books");
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});


// GET book by ISBN
public_users.get("/isbn/:isbn", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/books");
    const isbn = req.params.isbn;

    const data = response.data;

    if (data[isbn]) {
      return res.status(200).json(data[isbn]);
    }

    return res.status(404).json({ message: "Book not found" });

  } catch (error) {
    return res.status(500).json({ message: "Error fetching book" });
  }
});


// GET books by AUTHOR
public_users.get("/author/:author", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/books");
    const author = req.params.author;

    const booksData = response.data;
    let result = {};

    Object.keys(booksData).forEach((key) => {
      if (booksData[key].author === author) {
        result[key] = booksData[key];
      }
    });

    return res.status(200).json(result);

  } catch (error) {
    return res.status(500).json({ message: "Error fetching by author" });
  }
});


// GET books by TITLE (TASK 13 FIX 🔥)
public_users.get("/title/:title", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/books");
    const title = req.params.title;

    const booksData = response.data;
    let result = {};

    Object.keys(booksData).forEach((key) => {
      if (booksData[key].title === title) {
        result[key] = booksData[key];
      }
    });

    return res.status(200).json(result);

  } catch (error) {
    return res.status(500).json({ message: "Error fetching by title" });
  }
});


// GET reviews safely
public_users.get("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }

  return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;
