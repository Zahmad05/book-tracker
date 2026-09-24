import { useEffect,useState } from "react";
import { supabase } from "../supabaseClient";
import { getRecommendations, getLibraryRecommendations } from "../services/recommendations";

function DiscoverPage(){

    const [mood, setMood] = useState("");
    const [books, setBooks] = useState<{ title: string; author: string }[]>([]);
    const [recommendations, setRecommendations] = useState<{ title: string; author: string; reason: string }[]>([]);

    useEffect(() => {
        getBooks();
    }, []);

    async function getBooks(){
        const {data, error} = await supabase
        .from("books")
        .select("title, author");

        if (error) {
            console.error(error);
            return;
        }

        setBooks(data || []);
    }

    async function handleMoodRecommendation() {
        const recommendations = await getRecommendations(books, mood);

        if (recommendations) {
            setRecommendations(recommendations);
        }
    }

    async function handleLibraryRecommendation() {
        const recommendations = await getLibraryRecommendations(books);

        if (recommendations) {
            setRecommendations(recommendations);
        }
    }

    return(
    <div className="discover-page">
      <h1>Discover</h1>

      <p>
        Find your next read based on your library or what you're in the mood for.
      </p>

        <p className="ai-notice">
  AI recommendations are temporarily unavailable. Please try again later.
</p>

      <div className="mood-section">
        <label htmlFor="mood">
          What are you in the mood for?
        </label>

        <input
          type="text"
          id="mood"
          placeholder="e.g. a mystery with a plot twist"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
        />

        <button 
        type="button"
        onClick={handleMoodRecommendation}
        >
             Find My Next Read
    </button>
    </div>

    {recommendations.length > 0 && (
    <div className="recommendation-results">
        <h2>Your Recommendations</h2>

        {recommendations.map((book, index) => (
        <div className="recommendation-card" key={index}>
            <h3>{book.title}</h3>
            <p><strong>{book.author}</strong></p>
            <p>{book.reason}</p>
        </div>
        ))}
    </div>
    )}

    <div className="recommendation-section">
        <h2>Or discover something based on your library</h2>

        <button 
            type="button"
            onClick={handleLibraryRecommendation}
        >
          Get AI Recommendations
        </button>
      </div>
    </div>
    );
}

export default DiscoverPage;