const express = require("express");
let books = require("./booksdb.js");
const public_users = express.Router();
const axios = require("axios");

/**
 * @route   GET /
 * @desc    Retrieve all books asynchronously using Axios from the local service
 * @access  Public
 */
public_users.get("/", async (req, res) => {
  try {
    // Fetching the master list of books from the local internal endpoint
    const response = await axios.get("http://localhost:5000/books");
    return res.status(200).json(response.data);
  } catch (error) {
    // Graceful error logging and server error handling
    return res.status(500).json({ message: "Error fetching books" });
  }
});

/**
 * @route   GET /isbn/:isbn
 * @desc    Retrieve a single book specification using its ISBN identifier
 * @access  Public
 */
public_users.get("/isbn/:isbn", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/books");
    const isbn = req.params.isbn;
    const data = response.data;

    // Direct key matching to locate the book details
    if (data[isbn]) {
      return res.status(200).json(data[isbn]);
    }

    // Standard fallback response for invalid/missing keys
    return res.status(404).json({ message: "Book not found" });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book" });
  }
});

/**
 * @route   GET /author/:author
 * @desc    Filter and retrieve all book objects matching a specified author string
 * @access  Public
 */
public_users.get("/author/:author", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/books");
    // Decode incoming URL component to safely handle spaces (%20)
    const author = decodeURIComponent(req.params.author);
    const booksData = response.data;
    let result = {};

    // Iterate through data keys to evaluate author match rules
    Object.keys(booksData).forEach((key) => {
      if (booksData[key].author.toLowerCase() === author.toLowerCase()) {
        result[key] = booksData[key];
      }
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching by author" });
  }
});

/**
 * @route   GET /title/:title
 * @desc    Filter and retrieve all book objects matching a specified title string
 * @access  Public
 */
public_users.get("/title/:title", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/books");
    // Decode incoming URL component to safely match titles with string spaces
    const title = decodeURIComponent(req.params.title);
    const booksData = response.data;
    let result = {};

    // Iterate through data keys to locate matches based on exact text casing or variants
    Object.keys(booksData).forEach((key) => {
      if (booksData[key].title.toLowerCase() === title.toLowerCase()) {
        result[key] = booksData[key];
      }
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching by title" });
  }
});

/**
 * @route   GET /review/:isbn
 * @desc    Synchronously retrieve book feedback/reviews directly using the db state
 * @access  Public
 */
public_users.get("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  // Verifying existence before accessing nested review properties
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }

  return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;
