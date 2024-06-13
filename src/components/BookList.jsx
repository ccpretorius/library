import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import BookCard from "./BookCard";
import "./BookList.css";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    const booksCollection = collection(db, "books");
    const booksSnapshot = await getDocs(booksCollection);
    const booksList = booksSnapshot.docs.map((doc) => doc.data());
    return booksList;
  };

  useEffect(() => {
    const loadBooks = async () => {
      const booksList = await fetchBooks();
      setBooks(booksList);
      setLoading(false);
    };

    loadBooks();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="book-list">
      {books.map((book) => (
        <BookCard key={book.isdn} {...book} />
      ))}
    </div>
  );
};

export default BookList;
