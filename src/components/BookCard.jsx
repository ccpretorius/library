import "./BookCard.css";

const BookCard = ({ name, author, isbn, cover }) => (
  <div className="book-card">
    <div className="cover-container">
      <img src={cover} alt={`${name} cover`} className="book-cover" />
    </div>
    <div className="book-details">
      <h3 className="book-title">{name}</h3>
      <p className="book-author">{author}</p>
      <p className="book-isbn">ISBN: {isbn}</p>
    </div>
  </div>
);

export default BookCard;
