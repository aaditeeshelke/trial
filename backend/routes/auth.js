const express = require('express');
const router = express.Router();
const User = require('../models/User');

const Publisher = require('../models/Publisher'); // Adjust the path if necessary

// POST /api/auth/books
// Add a new book
router.post('/books', async (req, res) => {
  const { publisherName, authorName, bookDetails } = req.body;

  // Check if bookDetails is provided
  if (!bookDetails) {
    return res.status(400).json({ message: 'Book details are required' });
  }

  const { bookName, imgUrl, description, publisherDate, totalCopies, purchasedCopies = 0 } = bookDetails;

  // Check if all required book fields are provided
  if (!bookName || !imgUrl || !description || !publisherDate || !totalCopies) {
    return res.status(400).json({ message: 'All book details are required' });
  }

  try {
    console.log('Request body:', req.body);

    // Find the publisher by name
    let publisher = await Publisher.findOne({ publisherName });
    console.log('Found publisher:', publisher);

    // If publisher does not exist, create a new one
    if (!publisher) {
      publisher = new Publisher({
        publisherName,
        authors: []
      });
      console.log('Created new publisher:', publisher);
    }

    // Find the author within the publisher's authors array
    let author = publisher.authors.find(author => author.authorName === authorName);
    console.log('Found author:', author);

    // If author does not exist for the publisher, create a new author
    if (!author) {
      author = {
        authorName,
        books: []
      };
      publisher.authors.push(author);
      console.log('Created new author:', author);
    }

    // Create the new book
    const newBook = {
      bookName,
      imgUrl,
      description,
      publisherDate: new Date(publisherDate),
      totalCopies,
      purchasedCopies
    };

    // Add the new book to the author's books array
    author.books.push(newBook);
    console.log('Added new book:', newBook);

    // Ensure author reference in publisher is updated
    publisher.authors = publisher.authors.map(auth =>
      auth.authorName === authorName ? author : auth
    );

    // Save the updated publisher document
    await publisher.save();
    console.log('Saved publisher:', publisher);

    res.status(201).json({ message: 'Book added successfully', book: newBook });
  } catch (error) {
    console.error('Failed to add book:', error);
    res.status(500).json({ message: 'Failed to add book', error });
  }
});

// Fetch all publishers with their authors and books
router.get('/publishers', async (req, res) => {
  try {
    const publishers = await Publisher.find();
    res.status(200).json(publishers);
  } catch (error) {
    console.error('Failed to fetch publishers:', error);
    res.status(500).json({ message: 'Failed to fetch publishers', error });
  }
});

// Create a new book
/*router.post('/books', async (req, res) => {
  try {
    const { bookName, authorName, publisherName, imgUrl, description, publisherDate, totalCopies } = req.body;

    // Find or create author
    let author = await Author.findOne({ authorName });
    if (!author) {
      author = new Author({ authorName });
      await author.save();
    }

    // Find or create publisher
    let publisher = await Publisher.findOne({ publisherName });
    if (!publisher) {
      publisher = new Publisher({ publisherName });
    }

    // Create new book
    const newBook = new Book({
      bookName,
      author: author._id,
      imgUrl,
      description,
      publisherDate,
      totalCopies
    });

    // Push new book to publisher and author
    publisher.books.push(newBook);
    author.books.push(newBook);

    // Save all changes
    await newBook.save();
    await publisher.save();
    await author.save();

    res.status(201).json({ message: 'Book added successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Fetch all books with nested author and publisher details
router.get('/books', async (req, res) => {
  try {
    const books = await Book.find()
      .populate({
        path: 'author',
        populate: {
          path: 'publisher',
          model: 'Publisher'
        }
      })
      .exec();

    const structuredData = {};

    books.forEach(book => {
      const author = book.author;
      const publisher = author ? author.publisher : null;

      if (publisher) {
        const publisherName = publisher.publisherName;
        const authorName = author.authorName;

        if (!structuredData[publisherName]) {
          structuredData[publisherName] = {};
        }
        if (!structuredData[publisherName][authorName]) {
          structuredData[publisherName][authorName] = [];
        }
        structuredData[publisherName][authorName].push(book);
      }
    });

    res.json(structuredData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});*/
// Create a new book


// Register
router.post('/register', async (req, res) => {
  try {
    const { email, role } = req.body;
    let assignedRole = role || "user";

    if (!role && email && email.endsWith('@numetry.com')) {
      assignedRole = "admin";
    }

    const newUser = new User({ ...req.body, role: assignedRole });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login
/*router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (user) {
      user.lastLogin = new Date();
      user.loginTimes.push(new Date());
      await user.save();

      if (user.role === 'user') {
        res.json({ redirect: '/user-dashboard' });
      } else if (user.role === 'admin') {
        res.json({ redirect: '/admin-dashboard' });
      }
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});*/
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (user) {
      const loginTime = new Date(); // Create a new Date object for login time
      user.lastLogin = loginTime; // Update lastLogin field
      user.loginTimes.push(loginTime); // Push loginTime into loginTimes array
      await user.save();

      res.json({
        redirect: user.role === 'user' ? '/user-dashboard' : '/admin-dashboard',
        loginTime: loginTime.toISOString(), // Send loginTime as ISO string to frontend if needed
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
});


// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a user
/*router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (updatedUser) {
      res.json({ message: 'User updated successfully', user: updatedUser });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});*/
// Update a user
router.put('/users/:id', async (req, res) => {
  const userId = req.params.userId;
  const { username, loginTime, logoutTime } = req.body;

  try {
    // Fetch user by userId
    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user fields
    user.username = username;
    user.loginTime = loginTime; // Assuming loginTime and logoutTime are Date objects
    user.logoutTime = logoutTime;

    // Save updated user
    user = await user.save();

    res.json(user);
  } catch (error) {
    console.error('Failed to update user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete a user
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find the user by ID and delete
    const deletedUser = await User.findByIdAndDelete(id);

    if (deletedUser) {
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Handle book purchase
router.post('/buy', async (req, res) => {
  const { bookId } = req.body;

  try {
    // Find the book by ID and update the counts
    const publisher = await Publisher.findOne({ 'authors.books._id': bookId });
    if (!publisher) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const author = publisher.authors.find(author => 
      author.books.some(book => book._id.toString() === bookId)
    );

    const book = author.books.find(book => book._id.toString() === bookId);

    if (book.totalCopies > book.purchasedCopies) {
      book.purchasedCopies += 1;
      book.totalCopies -= 1;
      await publisher.save();
      res.status(200).json({ message: 'Book purchased successfully', book });
    } else {
      res.status(400).json({ message: 'No copies available' });
    }
  } catch (error) {
    console.error('Failed to purchase book:', error);
    res.status(500).json({ message: 'Failed to purchase book', error });
  }
});
// GET /api/auth/purchased-books
router.get('/purchased-books', async (req, res) => {
  try {
    const publishers = await Publisher.find();
    const purchasedBooks = [];

    publishers.forEach(publisher => {
      publisher.authors.forEach(author => {
        author.books.forEach(book => {
          if (book.purchasedCopies > 0) {
            purchasedBooks.push({
              ...book._doc,
              authorName: author.authorName,
              publisherName: publisher.publisherName,
            });
          }
        });
      });
    });

    res.status(200).json(purchasedBooks);
  } catch (error) {
    console.error('Failed to fetch purchased books:', error);
    res.status(500).json({ message: 'Failed to fetch purchased books', error });
  }
});
router.put('/books/:bookId', async (req, res) => {
  const bookId = req.params.bookId;
  const { bookName, totalCopies, purchasedCopies } = req.body;

  try {
    // Find the publisher that contains the book with the given bookId
    const publisher = await Publisher.findOne({ 'authors.books._id': bookId });

    if (!publisher) {
      return res.status(404).json({ message: 'Publisher not found' });
    }

    // Find the author containing the book
    const author = publisher.authors.find((author) =>
      author.books.some((book) => book._id.toString() === bookId)
    );

    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    // Find the book to update
    const bookToUpdate = author.books.find((book) => book._id.toString() === bookId);

    if (!bookToUpdate) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Update the book fields
    bookToUpdate.bookName = bookName;
    bookToUpdate.totalCopies = totalCopies;
    bookToUpdate.purchasedCopies = purchasedCopies;

    // Save the updated publisher document
    await publisher.save();

    // Construct the response object with necessary fields including publisherName and authorName
    const responseBook = {
      _id: bookToUpdate._id,
      bookName: bookToUpdate.bookName,
      totalCopies: bookToUpdate.totalCopies,
      purchasedCopies: bookToUpdate.purchasedCopies,
      imgUrl: bookToUpdate.imgUrl, 
      publisherDate:bookToUpdate.publisherDate,// Assuming 'imgUrl' is a field in your Book schema
      publisherName: publisher.publisherName, // Assuming 'publisherName' is a field in Publisher schema
      authorName: author.authorName,          // Assuming 'authorName' is a field in Author schema
    };

    res.status(200).json(responseBook);
  } catch (error) {
    console.error('Failed to update book:', error);
    res.status(500).json({ message: 'Failed to update book', error });
  }
});
// DELETE /api/auth/books/:bookId
// Delete a book
router.delete('/books/:bookId', async (req, res) => {
  const { bookId } = req.params;

  try {
    let publisher = await Publisher.findOne({ 'authors.books._id': bookId });

    if (!publisher) {
      return res.status(404).json({ message: 'Book not found' });
    }

    let author = publisher.authors.find(author =>
      author.books.some(book => book._id.toString() === bookId)
    );

    author.books = author.books.filter(book => book._id.toString() !== bookId);

    if (author.books.length === 0) {
      publisher.authors = publisher.authors.filter(auth => auth.authorName !== author.authorName);
    }

    await publisher.save();

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Failed to delete book:', error);
    res.status(500).json({ message: 'Failed to delete book', error });
  }
});


module.exports = router;
