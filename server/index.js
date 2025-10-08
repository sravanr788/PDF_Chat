import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import axios from "axios";
import pdfExtract from "pdf-extraction";

dotenv.config();

const app = express();

app.use(cors({
  origin: true,
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.get("/", (req, res) => {
  res.json({
    message: "PDF Chat Server is running!",
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

/**
 * Fetches a remote PDF file and extracts its text content.
 * @param {string} url - The URL of the PDF file.
 * @returns {Promise<string>} The extracted text content.
 */
async function fetchPdfText(url) {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const dataBuffer = Buffer.from(response.data);

    const data = await pdfExtract(dataBuffer);
    console.log("PDF Extract Result:", Object.keys(data));

    let text = "";
    // Prioritize 'text' field, fallback to joining page texts
    if (data.text) {
      text = data.text;
    } else if (data.pages) {
      text = data.pages.map(p => p.text).join(" ");
    } else {
      throw new Error("No text found in PDF");
    }

    return text;
  } catch (error) {
    console.error("Error fetching or extracting PDF:", error.message);
    throw new Error("Could not process PDF file.");
  }
}

app.post("/chat", async (req, res) => {
  try {
    const { fileUrl, question } = req.body;
    if (!fileUrl || !question) {
      return res.status(400).json({ error: "fileUrl and question are required" });
    }

    console.log("Fetching PDF from URL:", fileUrl);
    const pdfText = await fetchPdfText(fileUrl);

    const words = pdfText.split(/\s+/);
    const pdfPages = [];
    const wordsPerPage = 500;

    for (let i = 0; i < words.length; i += wordsPerPage) {
      const pageText = words.slice(i, i + wordsPerPage).join(" ");
      pdfPages.push({
        pageNumber: Math.floor(i / wordsPerPage) + 1,
        text: pageText
      });
    }

    const prompt = `
You are an AI assistant that answers questions STRICTLY based on the provided PDF content.

1. Use Markdown formatting (e.g., **bold**, lists, headers) for clear readability.
2. IMPORTANT: Always cite the source page(s) using the exact format [Page X] immediately following the piece of information derived from that page.
3. If the answer is not in the document, state clearly that you cannot find the information in the provided PDF.

--- PDF Content (First ~6000 characters) ---
${pdfPages.map(p => `\n--- PAGE ${p.pageNumber} ---\n${p.text}`).join("\n").slice(0, 6000)}

--- Question ---
Question: ${question}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', 
      contents: prompt,
    });
    
    const answer = response.text;
    console.log("AI Answer Generated.");
    
    res.json({
      answer,
      totalPages: pdfPages.length
    });
  } catch (err) {
    console.error("Error chatting with PDF:", err.message);
    res.status(500).json({ error: err.message || "Failed to chat with PDF" });
  }
});
if (process.env.NODE_ENV !== "production") {
  app.listen(3000, () => console.log("Server running on http://localhost:3000"));
}

export default app;
