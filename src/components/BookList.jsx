// src/components/BookList.jsx
import { useEffect, useState } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import axios from "axios";
import { db } from "../firebaseConfig";
import BookCard from "./BookCard";
import "./BookList.css";

const BookList = ({ scannedIsbn }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanStatus, setScanStatus] = useState("");

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

  useEffect(() => {
    if (scannedIsbn) {
      fetchAndSaveBookDetails(scannedIsbn);
    }
  }, [scannedIsbn]);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="book-list">
        {books.map((book) => (
          <BookCard key={book.isbn} {...book} />
        ))}
      </div>
      <p>{scanStatus}</p>
    </div>
  );
};

export default BookList;
