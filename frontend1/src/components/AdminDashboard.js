import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showAddBookForm, setShowAddBookForm] = useState(false);

  const [book, setBook] = useState({
    bookName: '',
    authorName: '',
    publisherName: '',
    publisherDate: '',
    totalCopies: '',
    imgUrl: '',
    description: ''
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/users');
        if (response.ok) {
          const data = await response.json();
          const filteredUsers = data.filter(user => user.role !== 'admin');
          setUsers(filteredUsers);
        } else {
          console.error('Failed to fetch users');
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleAddBook = async (e) => {
    e.preventDefault();

    const bookDetails = {
      bookName: book.bookName,
      imgUrl: book.imgUrl,
      description: book.description,
      publisherDate: new Date(book.publisherDate),
      totalCopies: parseInt(book.totalCopies),
      purchasedCopies: 0,
    };

    const data = {
      publisherName: book.publisherName,
      authorName: book.authorName,
      bookDetails,
    };

    try {
      const response = await fetch('http://localhost:5000/api/auth/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        alert('Book added successfully');
        setBook({
          bookName: '',
          authorName: '',
          publisherName: '',
          publisherDate: '',
          totalCopies: '',
          imgUrl: '',
          description: ''
        });
        setShowAddBookForm(false); // Hide the form after adding the book
      } else {
        console.error('Failed to add book');
      }
    } catch (error) {
      console.error('Failed to add book:', error);
    }
  };

  const handleBookChange = (e) => {
    const { name, value } = e.target;
    setBook({ ...book, [name]: value });
  };

  const handleLogout = () => {
    window.location.href = '/login';
  };

  const navigate = useNavigate();

  const handleViewBooks = () => {
    navigate('/view-books');
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
  };

  /*const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/users/${userId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setUsers(users.filter(user => user._id !== userId));
      } else {
        console.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };*/
  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/users/${userId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setUsers(users.filter(user => user._id !== userId));
      } else {
        console.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };
  

  /*const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/auth/users/${editingUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingUser),
      });
      if (response.ok) {
        const updatedUser = await response.json();
        setUsers(users.map(user => (user._id === editingUser._id ? updatedUser : user)));
        setEditingUser(null);
      } else {
        console.error('Failed to update user');
      }
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };*/
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/auth/users/${editingUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: editingUser.username,
          loginTime: editingUser.loginTime, // Ensure loginTime and logoutTime are set correctly
          logoutTime: editingUser.logoutTime,
        }),
      });
      if (response.ok) {
        const updatedUser = await response.json();
        setUsers(users.map(user => (user._id === editingUser._id ? updatedUser.user : user))); // Assuming the response returns `{ user: updatedUser }`
        setEditingUser(null);
      } else {
        console.error('Failed to update user');
      }
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingUser({ ...editingUser, [name]: value });
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
    <div className="bg-purple-600 text-white py-4 px-6 rounded mb-4 mt-4">
    <h1 className="text-3xl font-bold">Welcome to Admin Dashboard</h1>
    </div>

      <div className="flex justify-between mb-4">
        <div className="space-x-2 mt-6">
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300" onClick={handleLogout}>Logout</button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300" onClick={handleViewBooks}>View Books</button>
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300" onClick={() => setShowAddBookForm(!showAddBookForm)}>Add Book</button>
        </div>
      </div>

      {showAddBookForm && (
        <div className="mb-6 bg-white p-4 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-indigo-600">Add Book</h2>
          <form onSubmit={handleAddBook} className="space-y-4">
            <input type="text" name="bookName" placeholder="Book Name" value={book.bookName} onChange={handleBookChange} className="w-full p-2 border rounded" required />
            <input type="text" name="authorName" placeholder="Author Name" value={book.authorName} onChange={handleBookChange} className="w-full p-2 border rounded" required />
            <input type="text" name="publisherName" placeholder="Publisher Name" value={book.publisherName} onChange={handleBookChange} className="w-full p-2 border rounded" required />
            <input type="date" name="publisherDate" placeholder="Publication Date" value={book.publisherDate} onChange={handleBookChange} className="w-full p-2 border rounded" required />
            <input type="number" name="totalCopies" placeholder="Total Copies" value={book.totalCopies} onChange={handleBookChange} className="w-full p-2 border rounded" required />
            <input type="text" name="imgUrl" placeholder="Image URL" value={book.imgUrl} onChange={handleBookChange} className="w-full p-2 border rounded" required />
            <textarea name="description" placeholder="Description" value={book.description} onChange={handleBookChange} className="w-full p-2 border rounded" required />
            <button type="submit" className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-300">Add Book</button>
          </form>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4 text-indigo-600 mt-8">User List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg mt-4">
          <thead className="bg-indigo-100">
            <tr>
              <th className="py-2 px-4 text-left">Full Name</th>
              <th className="py-2 px-4 text-left">Username</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Phone Number</th>
              <th className="py-2 px-4 text-left">Login Date</th>
              <th className="py-2 px-4 text-left">Login Time</th>
              <th className="py-2 px-4 text-left">Logout Time</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} className="border-t">
                <td className="py-2 px-4">{user.fullName}</td>
                <td className="py-2 px-4">{user.username}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">{user.mobile}</td>
                <td className="py-2 px-4">{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}</td>
                <td className="py-2 px-4">{user.lastLogin ? new Date(user.lastLogin).toLocaleTimeString() : 'N/A'}</td>

                <td className="py-2 px-4">{user.logoutTime ? user.logoutTime : 'N/A'}</td>
                <td className="py-2 px-4 space-x-2">
                  <button onClick={() => handleEditUser(user)} className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-700 transition duration-300">Edit</button>
                  <button onClick={() => handleDeleteUser(user._id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700 transition duration-300">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingUser && (
        <form className="mt-6 bg-white p-4 rounded-lg shadow-lg" onSubmit={handleEditSubmit}>
          <h3 className="text-2xl font-bold mb-4 text-indigo-600">Edit User</h3>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={editingUser.username}
            onChange={handleEditChange}
            className="w-full p-2 border rounded mb-4"
            required
          />
          <input
            type="text"
            name="loginTime"
            placeholder="Login Time"
            value={editingUser.loginTime}
            onChange={handleEditChange}
            className="w-full p-2 border rounded mb-4"
            required
          />
          <input
            type="text"
            name="logoutTime"
            placeholder="Logout Time"
            value={editingUser.logoutTime}
            onChange={handleEditChange}
            className="w-full p-2 border rounded mb-4"
            required
          />
          <div className="flex space-x-2">
            <button type="submit" className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-300">Save</button>
            <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-300" onClick={() => setEditingUser(null)}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminDashboard;
