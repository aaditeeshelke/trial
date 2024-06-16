import React, { useState, useEffect } from 'react';

const Wishlist = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(fetchedFavorites);
  }, []);

  const handleRemoveFromWishlist = (bookId) => {
    const updatedFavorites = favorites.filter((book) => book._id !== bookId);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-indigo-600">Your Wishlist</h2>
      {favorites.length === 0 ? (
        <p className="text-gray-600">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((book) => (
            <div
              key={book._id}
              className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center h-full transition-transform transform hover:scale-105 hover:shadow-2xl"
            >
              <img
                src={book.imgUrl}
                alt={book.bookName}
                className="h-40 w-full object-contain mb-4 rounded"
              />
              <div className="flex-grow flex flex-col justify-between w-full">
                <div className="text-center">
                  <h4 className="font-semibold text-lg mb-2 text-indigo-700">{book.bookName}</h4>
                  <p className="text-gray-600 mb-1">Author: {book.authorName}</p>
                  <p className="text-gray-600 mb-1">Publisher: {book.publisherName}</p>
                  <p className="text-gray-600 mb-1">Published on: {new Date(book.publisherDate).toLocaleDateString()}</p>
                  <p className="text-gray-600 mb-1">Total Copies: {book.totalCopies}</p>
                  <p className="text-gray-600 mb-1">Purchased Copies: {book.purchasedCopies}</p>
                  <p className="text-gray-600 mb-1">Count in Favorites: {book.count || 0}</p>
                </div>
                <div className="flex justify-between mt-4 w-full">
                  <button
                    onClick={() => handleRemoveFromWishlist(book._id)}
                    className="bg-red-500 text-white w-full py-1 rounded hover:bg-red-700 transition duration-300"
                  >
                    Remove from Wishlist
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
