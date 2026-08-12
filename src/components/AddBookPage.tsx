import AddBookForm from "../components/AddBookForm";
import { type Book } from "../types/Book";

type Props = {
  addBook: (book: Omit<Book, "id">) => void;
};

function AddBookPage({ addBook }: Props) {
  return (
    <div>
      <h1>Add a Book</h1>

      <div className="book-form">
        <AddBookForm addBook={addBook} />
      </div>
    </div>
  );
}

export default AddBookPage;