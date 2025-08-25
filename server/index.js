import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import pdfExtract from "pdf-extraction";

dotenv.config();

const app = express();

// Simplified CORS configuration
app.use(cors({
  origin: true,
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


app.get("/", (req, res) => {
  res.json({
    message: "PDF Chat Server is running!",
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Fetch remote PDF file and extract text
async function fetchPdfText(url) {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  const dataBuffer = Buffer.from(response.data);

  const data = await pdfExtract(dataBuffer);
  console.log("PDF Extract Result:", Object.keys(data));

  // Some libs give 'text', some give 'pages'
  let text = "";
  if (data.text) {
    text = data.text;
  } else if (data.pages) {
    text = data.pages.map(p => p.text).join(" ");
  } else {
    throw new Error("No text found in PDF");
  }

  return text;
}

app.post("/chat", async (req, res) => {
  try {
    const { fileUrl, question } = req.body;
    if (!fileUrl || !question) {
      return res.status(400).json({ error: "fileUrl and question are required" });
    }

    console.log("Fetching PDF from URL:", fileUrl);
    const pdfText = await fetchPdfText(fileUrl);

    // Split into pseudo-pages (every 500 words = 1 "page")
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
You are an AI assistant that answers questions based on the provided PDF.

IMPORTANT: Always cite in [Page X] format.

PDF Content:
${pdfPages.map(p => `\n--- PAGE ${p.pageNumber} ---\n${p.text}`).join("\n").slice(0, 6000)}

Question: ${question}
`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const answer = result.response.text();

    res.json({
      answer,
      totalPages: pdfPages.length
    });
  } catch (err) {
    console.error("Error chatting with PDF:", err);
    res.status(500).json({ error: "Failed to chat with PDF" });
  }
});



if (process.env.NODE_ENV !== "production") {
  app.listen(3000, () => console.log("Server running on http://localhost:3000"));
}

export default app;
