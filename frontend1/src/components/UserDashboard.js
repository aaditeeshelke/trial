import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';

const UserDashboard = ({ username }) => {
  const [publishers, setPublishers] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPublishers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/publishers');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPublishers(data);
        setFilteredBooks(data);
      } catch (error) {
        console.error('Failed to fetch publishers:', error);
      }
    };

    fetchPublishers();
  }, []);

  useEffect(() => {
    const results = [];
    publishers.forEach((publisher) => {
      publisher.authors.forEach((author) => {
        author.books.forEach((book) => {
          if (
            book.bookName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            author.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            publisher.publisherName.toLowerCase().includes(searchQuery.toLowerCase())
          ) {
            results.push({ ...book, authorName: author.authorName, publisherName: publisher.publisherName });
          }
        });
      });
    });
    setFilteredBooks(results);
  }, [searchQuery, publishers]);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });
      alert('Logout successful');
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleViewMore = (book) => {
    setSelectedBook(book);
  };

  const handleAddToFavorites = (book) => {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    let existingBook = favorites.find((favBook) => favBook._id === book._id);

    if (existingBook) {
      existingBook.count = (existingBook.count || 0) + 1;
    } else {
      favorites.push({ ...book, count: 1 });
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));

    const updatedPublishers = publishers.map((publisher) => {
      const updatedAuthors = publisher.authors.map((author) => {
        const updatedBooks = author.books.map((b) => {
          if (b._id === book._id) {
            return { ...b, count: (b.count || 0) + 1 };
          }
          return b;
        });
        return { ...author, books: updatedBooks };
      });
      return { ...publisher, authors: updatedAuthors };
    });
    setPublishers(updatedPublishers);
  };

  const handleBuyNow = async (book) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookId: book._id }),
      });

      if (!response.ok) {
        throw new Error('Purchase failed');
      }

      const data = await response.json();
      const updatedPublishers = publishers.map((publisher) => {
        const updatedAuthors = publisher.authors.map((author) => {
          const updatedBooks = author.books.map((b) => {
            if (b._id === book._id) {
              return { ...b, ...data.book };
            }
            return b;
          });
          return { ...author, books: updatedBooks };
        });
        return { ...publisher, authors: updatedAuthors };
      });
      setPublishers(updatedPublishers);
      setSelectedBook(null); // Close modal after purchase
      alert('Purchase successful');
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Purchase failed');
    }
  };

  const navigate = useNavigate();

  const handleViewWishlist = () => {
    navigate('/wishlist');
  };

  const closeModal = () => {
    setSelectedBook(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-indigo-600">Welcome to User Dashboard</h2>
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search by book name, author, or publisher"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-1/2 p-2 border rounded"
        />
        <div className="space-x-2">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700 transition duration-300"
          >
            Logout
          </button>
          <button
            onClick={handleViewWishlist}
            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-700 transition duration-300"
          >
            View Wishlist
          </button>
        </div>
      </div>

      <div className="book-grid">
        {filteredBooks.map((book) => (
          <div
            key={book._id}
            className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center transition-transform transform hover:scale-105 hover:shadow-2xl"
          >
            <img src={book.imgUrl} alt={book.bookName} className="h-40 w-full object-contain mb-4 rounded" />
            <div className="flex-grow flex flex-col justify-between w-full">
              <div className="text-center">
                <h4 className="font-semibold text-lg mb-2 text-indigo-700">{book.bookName}</h4>
                <p className="text-gray-600 mb-1">Author: {book.authorName}</p>
                <p className="text-gray-600 mb-1">Publisher: {book.publisherName}</p>
                <p className="text-gray-600 mb-1">{new Date(book.publisherDate).toLocaleDateString()}</p>
                <p className="text-gray-600 mb-1">Total Copies: {book.totalCopies}</p>
                <p className="text-gray-600 mb-1">Purchased Copies: {book.purchasedCopies}</p>
                <p className="text-gray-600 mb-1">Added to Favorites: {book.count || 0}</p>
              </div>
              <div className="flex justify-between mt-4 w-full">
                <button
                  onClick={() => handleViewMore(book)}
                  className="bg-indigo-500 text-white w-1/2 py-1 rounded hover:bg-indigo-700 transition duration-300 mr-1"
                >
                  View More
                </button>
                <button
                  onClick={() => handleAddToFavorites(book)}
                  className="bg-green-500 text-white w-1/2 py-1 rounded hover:bg-green-700 transition duration-300 ml-1"
                >
                  Add Favorites
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedBook && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-4 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-center text-indigo-600">{selectedBook.bookName}</h3>
            <img src={selectedBook.imgUrl} alt={selectedBook.bookName} className="h-48 w-full object-contain mb-4 rounded" />
            <p className="text-gray-600 mb-2"><strong>Author:</strong> {selectedBook.authorName}</p>
            <p className="text-gray-600 mb-2"><strong>Publisher:</strong> {selectedBook.publisherName}</p>
            <p className="text-gray-600 mb-2"><strong>Published Date:</strong> {new Date(selectedBook.publisherDate).toLocaleDateString()}</p>
            <p className="text-gray-600 mb-2"><strong>Total Copies:</strong> {selectedBook.totalCopies}</p>
            <p className="text-gray-600 mb-2"><strong>Purchased Copies:</strong> {selectedBook.purchasedCopies}</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={closeModal}
                className="bg-red-500 text-white w-1/2 py-1 rounded hover:bg-red-700 transition duration-300 mr-1"
              >
                Close
              </button>
              <button
                onClick={() => handleBuyNow(selectedBook)}
                className="bg-indigo-500 text-white w-1/2 py-1 rounded hover:bg-indigo-700 transition duration-300 ml-1"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
