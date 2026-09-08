import { type Book } from "../types/Book";
import { useState } from "react";

type Props = {
  addBook: (book: Omit<Book, "id">) => void;
};

type GoogleBook = {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
  };
};

function AddBookForm({ addBook }: Props) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState("");

  const [search, setSearch] = useState("");
  const [results, setResults] = useState<GoogleBook[]>([]);
  const [searching, setSearching] = useState(false);

  async function searchBooks() {
    if (!search.trim()) return;

    setSearching(true);

    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(search)}&key=AIzaSyBiaXi9lC3IhhmTKeVAigdXQFO8Cp2xTVg`
      );

      if (!response.ok) {
        throw new Error("Failed to search books");
      }

      const data = await response.json();

      setResults(data.items || []);

      } catch (error) {
        console.error("Error searching books:", error);
        alert("Could not search for books.");
      } finally {
        setSearching(false);
      }
  }

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

      <div>
        <label htmlFor="search">Search for a book:</label>

        <input
          className="text-input"
          type="text"
          id="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button className = "search-button" type="button" onClick={searchBooks}>
          {searching ? "Searching..." : "Search"}
        </button>
      </div>

      {results.map((book) => (
        <div key={book.id}>
            <p>{book.volumeInfo.title}</p>
            <p>{book.volumeInfo.authors?.join(", ")}</p>

            <button
              type="button"
              onClick={() => {
                setTitle(book.volumeInfo.title);
                setAuthor(book.volumeInfo.authors?.join(", ") || "");
              }}
            >
              Use this book
            </button>
          </div>
        ))}

      
      <p className="gaps"><strong>Or add a book manually.</strong></p>

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