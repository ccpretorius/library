// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { collection, getDocs, addDoc } from "firebase/firestore";
import axios from "axios";
import { AuthProvider } from "./contexts/AuthContext";
import { db } from "./firebaseConfig";
import Navbar from "./components/Navbar";
import Signup from "./components/Signup";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import BookList from "./components/BookList";
import CustomBarcodeScanner from "./components/CustomBarcodeScanner";

const App = () => {
  const [isbn, setIsbn] = useState("");
  const [scanStatus, setScanStatus] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      const booksCollection = collection(db, "books");
      const booksSnapshot = await getDocs(booksCollection);
      const booksList = booksSnapshot.docs.map((doc) => doc.data());
      setBooks(booksList);
      setLoading(false);
    };

    fetchBooks();
  }, []);

  const handleScan = async (scannedIsbn) => {
    console.log("Scanned ISBN:", scannedIsbn);
    setIsbn(scannedIsbn);
    await fetchAndSaveBookDetails(scannedIsbn);
  };

  const fetchAndSaveBookDetails = async (isbn) => {
    try {
      const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
      if (response.data.items && response.data.items.length > 0) {
        const book = response.data.items[0].volumeInfo;
        const bookDetails = {
          name: book.title,
          author: book.authors ? book.authors.join(", ") : "Unknown Author",
          cover: book.imageLinks ? book.imageLinks.thumbnail : "",
          isbn: isbn,
        };
        await addDoc(collection(db, "books"), bookDetails);
        console.log("Book details saved to Firestore:", bookDetails);
        setScanStatus("Book details saved successfully.");
        setBooks((prevBooks) => [...prevBooks, bookDetails]);
      } else {
        console.error("No book details found for this ISBN.");
        setScanStatus("No book details found for this ISBN.");
      }
    } catch (error) {
      console.error("Error fetching or saving book details:", error);
      setScanStatus("Error fetching or saving book details.");
    }
  };

  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<BookList books={books} />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
          <CustomBarcodeScanner onScan={handleScan} />
          <p>{scanStatus}</p>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
