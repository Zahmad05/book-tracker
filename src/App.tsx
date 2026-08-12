import { useState, useEffect } from "react";
import { HashRouter, Routes, Route, Link } from "react-router-dom";
import { type Book } from "./types/Book";
import { supabase } from "./supabaseClient";
import BookList from "./components/BookList";
import AddBookPage from "./components/AddBookPage";

function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getBooks();
  }, []);

  async function getBooks() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("books")
      .select("*");

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (error) {
      console.error(error);
      setError("Failed to load books.");
      setLoading(false);
      return;
    }

    setBooks(data);
    setLoading(false);
  }

  async function addBook(book: Omit<Book, "id">) {
    const { data, error } = await supabase
      .from("books")
      .insert(book)
      .select()
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setBooks([...books, data]);
  }

  async function deleteBook(id: number) {
    const { error } = await supabase
      .from("books")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    setBooks(books.filter((book) => book.id !== id));
  }

  async function updateBook(updatedBook: Book) {
    const { error } = await supabase
      .from("books")
      .update({
        title: updatedBook.title,
        author: updatedBook.author,
        status: updatedBook.status,
      })
      .eq("id", updatedBook.id);

    if (error) {
      console.error(error);
      return;
    }

    setBooks(
      books.map((book) =>
        book.id === updatedBook.id ? updatedBook : book
      )
    );
  }

  return (
    <HashRouter>
      <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/booklist">Book List</Link> |{" "}
        <Link to="/add">Add Book</Link>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
          <section className="tracker-home">
            <div className="tracker-hero">

              <p className="tracker-label">BOOK TRACKER</p>

              <h1>Your Reading Space</h1>

              <p className="tracker-description">
                Keep track of what you're reading and see your progress.
              </p>

              <div className="reading-stats">
                <div className="stat-card">
                  <span className="stat-number">{books.length}</span>
                  <span className="stat-label">Books</span>
                </div>

                <div className="stat-card">
                  <span className="stat-number">
                    {books.filter((book) => book.status === "Reading Now").length}
                  </span>
                  <span className="stat-label">Reading</span>
                </div>

                <div className="stat-card">
                  <span className="stat-number">
                    {books.filter((book) => book.status === "Completed").length}
                  </span>
                  <span className="stat-label">Completed</span>
                </div>
              </div>
            </div>
          </section>
        }
        />

        <Route
          path="/booklist"
          element={
            <BookList
              books={books}
              deleteBook={deleteBook}
              updateBook={updateBook}
              loading={loading}
              error={error}
            />
          }
        />

        <Route
          path="/add"
          element={<AddBookPage addBook={addBook} />}
        />
      </Routes>
    </HashRouter>
  );
}

export default App;