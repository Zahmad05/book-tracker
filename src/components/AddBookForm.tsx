import { type Book } from "../types/Book";
import { useState } from "react";

type Props = {
  addBook: (book: Omit<Book, "id">) => void;
};

function AddBookForm({ addBook }: Props) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim() || !author.trim() || !status) {
      alert("Please fill in all fields.");
      return;
    }

    const newBook: Omit<Book, "id"> = {
      title,
      author,
      status
    };

    addBook(newBook);

    setTitle("");
    setAuthor("");
    setStatus("");
  }

  return (
    <form onSubmit={handleSubmit}>

      <label htmlFor="bookname">Book Title:</label>

      <input
        className="text-input"
        type="text"
        id="bookname"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <br />

      <label htmlFor="author">Author's Name:</label>

      <input
        className="text-input"
        type="text"
        id="author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />

      <br />

      <div className="status-options">

        <label>Reading Status:</label>

        <label>
          <input
            type="radio"
            name="status"
            value="Not Started"
            checked={status === "Not Started"}
            onChange={(e) => setStatus(e.target.value)}
          />
          Not Started
        </label>

        <label>
          <input
            type="radio"
            name="status"
            value="Reading Now"
            checked={status === "Reading Now"}
            onChange={(e) => setStatus(e.target.value)}
          />
          Reading Now
        </label>

        <label>
          <input
            type="radio"
            name="status"
            value="Completed"
            checked={status === "Completed"}
            onChange={(e) => setStatus(e.target.value)}
          />
          Completed
        </label>

        <label>
          <input
            type="radio"
            name="status"
            value="DNF"
            checked={status === "DNF"}
            onChange={(e) => setStatus(e.target.value)}
          />
          DNF
        </label>

      </div>

      <button type="submit">
        Add Book
      </button>

    </form>
  );
}

export default AddBookForm;