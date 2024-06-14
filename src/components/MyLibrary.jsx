// src/components/MyLibrary.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import axios from "axios";
import { db } from "../firebaseConfig";
import { useAuth } from "../contexts/AuthContext";
import BookCard from "./BookCard";
import CustomBarcodeScanner from "./CustomBarcodeScanner";

const MyLibrary = () => {
  const [isbn, setIsbn] = useState("");
  const [scanStatus, setScanStatus] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { state } = useAuth();

  useEffect(() => {
    const fetchBooks = async () => {
      if (state.user) {
        const booksCollection = collection(db, "books");
        const userBooksQuery = query(booksCollection, where("owner", "==", state.user.uid));
        const booksSnapshot = await getDocs(userBooksQuery);
        const booksList = booksSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setBooks(booksList);
        setLoading(false);
      }
    };

    fetchBooks();
  }, [state.user]);

  const handleScan = async (scannedIsbn) => {
    console.log("Scanned ISBN:", scannedIsbn);
    setIsbn(scannedIsbn);
  };

  const fetchAndSaveBookDetails = async (isbn, location, availability) => {
    try {
      const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
      if (response.data.items && response.data.items.length > 0) {
        const book = response.data.items[0].volumeInfo;
        const bookDetails = {
          name: book.title,
          author: book.authors ? book.authors.join(", ") : "Unknown Author",
          cover: book.imageLinks ? book.imageLinks.thumbnail : "",
          isbn: isbn,
          owner: state.user.uid,
          location,
          availability,
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

  if (loading) {
    return <div className="flex justify-center items-center w-full h-full">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      <h2 className="text-2xl font-semibold mb-4 text-center">Manage Your Books</h2>
      <CustomBarcodeScanner onScan={handleScan} />
      <p>{scanStatus}</p>
      {isbn && (
        <div id="book-details-form" className="w-full flex justify-center">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const location = e.target.location.value;
              const availability = e.target.availability.checked;
              fetchAndSaveBookDetails(isbn, location, availability);
              e.target.reset();
              setIsbn("");
            }}
            className="w-full max-w-lg p-4 bg-white shadow-md rounded"
          >
            <div className="mb-4">
              <label className="block text-gray-700">Location Address:</label>
              <input type="text" name="location" required className="w-full p-2 border border-gray-300 rounded" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Available to Borrow:</label>
              <input type="checkbox" name="availability" className="mr-2" />
              <span className="text-gray-700">Yes</span>
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
              Save Book Details
            </button>
          </form>
        </div>
      )}
      <div className="flex flex-wrap justify-center p-5 bg-gray-100 w-full">
        {books.map((book) => (
          <BookCard key={book.isbn} {...book} />
        ))}
      </div>
    </div>
  );
};

export default MyLibrary;
