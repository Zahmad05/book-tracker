import { GoogleGenAI } from "@google/genai";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle browser preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    const { books, mood } = await req.json();

    const apiKey = Deno.env.get("GEMINI_API_KEY");

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set");
    }

    const ai = new GoogleGenAI({
      apiKey,
    });

    const bookList = books
      .map(
        (book: { title: string; author: string }) =>
          `"${book.title}" by ${book.author}`
      )
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

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    const recommendations = JSON.parse(response.text || "[]");

    return new Response(JSON.stringify(recommendations), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);

    return new Response(
      JSON.stringify({ error: "Failed to generate recommendations" }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});