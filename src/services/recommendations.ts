import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export async function getRecommendations(
  books: { title: string; author: string }[],
  mood: string
) {
  console.log("getRecommendations CALLED");
  
  const bookList = books
    .map((book) => `"${book.title}" by ${book.author}`)
    .join("\n");

  const prompt = `
A reader has these books in their library:

${bookList}

They are currently in the mood for:
${mood}

Recommend 4 books they might enjoy.

Do not recommend any book already in their library.

Return ONLY a JSON array in exactly this format:

[
  {
    "title": "Book title",
    "author": "Author name",
    "reason": "Short explanation of why this book matches the reader's library and mood."
  }
]

Do not include markdown, code fences, or any text outside the JSON array.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    const recommendations = JSON.parse(response.text || "[]");

    console.log("RECOMMENDATIONS:", recommendations);

    return recommendations;
  } catch (error) {
    console.error("Gemini error:", error);
  }
}






export async function getLibraryRecommendations(
  books: { title: string; author: string }[]
) {
  const bookList = books
    .map((book) => `"${book.title}" by ${book.author}`)
    .join("\n");

  const prompt = `
A reader has these books in their library:

${bookList}

Based only on the books in their library, recommend 4 books they might enjoy.

Look for patterns in the reader's existing books, such as:
- authors
- genres
- themes
- writing styles
- subject matter

Do not recommend any book already in their library.

Return ONLY a JSON array in exactly this format:

[
  {
    "title": "Book title",
    "author": "Author name",
    "reason": "Short explanation of why this book matches the reader's library."
  }
]

Do not include markdown, code fences, or any text outside the JSON array.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    const recommendations = JSON.parse(response.text || "[]");

    console.log("LIBRARY RECOMMENDATIONS:", recommendations);

    return recommendations;
  } catch (error) {
    console.error("Gemini error:", error);
  }
}