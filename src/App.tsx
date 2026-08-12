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
            <div>
              <h1>Book Tracker</h1>
              <p>Welcome to your Book Tracker!</p>
            </div>
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