import { type Book } from "../types/Book";
import BookCard from "./BookCard";

type Props = {
  books: Book[];
  deleteBook: (id: number) => void;
  updateBook: (book: Book) => void;
  loading: boolean;
  error: string;
};

function BookList({
  books,
  deleteBook,
  updateBook,
  loading,
  error
}: Props) {

  if (loading) {
    return <p>Loading books...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
  <h1>Book List</h1>

  {books.length === 0 ? (
    <p>No books added yet.</p>
  ) : (
    <div className="book-grid">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          deleteBook={deleteBook}
          updateBook={updateBook}
        />
      ))}
    </div>
  )}
</div>
  );
}

export default BookList;