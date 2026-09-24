import { supabase } from "../supabaseClient";

export async function getRecommendations(
  books: { title: string; author: string }[],
  mood: string
) {
  const { data, error } = await supabase.functions.invoke(
    "gemini-recommendations",
    {
      body: {
        books,
        mood,
      },
    }
  );

  if (error) {
    console.error("Recommendation error:", error);
    return;
  }

  return data;
}

export async function getLibraryRecommendations(
  books: { title: string; author: string }[]
) {
  const { data, error } = await supabase.functions.invoke(
    "gemini-recommendations",
    {
      body: {
        books,
        mood: "",
      },
    }
  );

  if (error) {
    console.error("Recommendation error:", error);
    return;
  }

  return data;
}