import { type Book } from "../types/Book";
import { useState } from "react";

type Props = {
  book: Book;
  deleteBook: (id: number) => void;
  updateBook: (book: Book) => void;
};

function BookCard({ book, deleteBook, updateBook }: Props) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [status, setStatus] = useState(book.status);

  return (
    <div className="book-card">

      <h2>{book.title}</h2>
      <p>Author: {book.author}</p>
      <p>Status: {book.status}</p>

      <button
        type="button"
        className="button-gap"
        onClick={() => {
          const confirmed = window.confirm(
            "Are you sure you want to delete this book?"
          );

          if (confirmed) {
            deleteBook(book.id);
          }
        }}
      >
        Delete Book
      </button>

      <button
        type="button"
        className="button-gap"
        onClick={() => setEditing(true)}
      >
        Edit Book
      </button>

      {editing && (
        <div className="edit-modal">
          <div className="edit-modal-content">

            <form
              onSubmit={(e) => {
                e.preventDefault();

                if (!title.trim() || !author.trim() || !status){
                  alert("please fill in all fields");
                  return;
                }

                const updatedBook: Book = {
                  id: book.id,
                  title,
                  author,
                  status
                };

                updateBook(updatedBook);
                setEditing(false);
              }}
            >

              <h3>Edit Book</h3>

              <label htmlFor={`bookname-${book.id}`}>
                Book Title:
              </label>

              <input
                className="text-input"
                type="text"
                id={`bookname-${book.id}`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <br />

              <label htmlFor={`author-${book.id}`}>
                Author's Name:
              </label>

              <input
                className="text-input"
                type="text"
                id={`author-${book.id}`}
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />

              <br />

              <div className="status-options">

                <label>Reading Status:</label>

                <label>
                  <input
                    type="radio"
                    name={`status-${book.id}`}
                    value="Not Started"
                    checked={status === "Not Started"}
                    onChange={(e) => setStatus(e.target.value)}
                  />
                  Not Started
                </label>

                <label>
                  <input
                    type="radio"
                    name={`status-${book.id}`}
                    value="Reading Now"
                    checked={status === "Reading Now"}
                    onChange={(e) => setStatus(e.target.value)}
                  />
                  Reading Now
                </label>

                <label>
                  <input
                    type="radio"
                    name={`status-${book.id}`}
                    value="Completed"
                    checked={status === "Completed"}
                    onChange={(e) => setStatus(e.target.value)}
                  />
                  Completed
                </label>

                <label>
                  <input
                    type="radio"
                    name={`status-${book.id}`}
                    value="DNF"
                    checked={status === "DNF"}
                    onChange={(e) => setStatus(e.target.value)}
                  />
                  DNF
                </label>

              </div>

              <button type="submit">
                Save Changes
              </button>

            </form>

            <button
              type="button"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

export default BookCard;