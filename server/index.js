import express from "express";
import multer from "multer";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import pdf from "pdf-extraction";

dotenv.config();

const app = express();
const upload = multer();
app.use(cors());
app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// store pdf text in memory
let pdfText = "";

// upload PDF
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ error: "Only PDF files allowed" });
    }

    // extract text using pdf-extraction
    const data = await pdf(req.file.buffer);
    pdfText = data.text;

    res.json({ success: true, message: "PDF processed successfully" });
  } catch (error) {
    console.error("Error parsing PDF:", error);
    res.status(500).json({ error: "Failed to process PDF" });
  }
});

// chat with PDF
app.post("/chat", async (req, res) => {
  try {
    const { question } = req.body;
      if (!question) return res.status(400).json({ error: "No question provided" });
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    if (!pdfText) return res.status(400).json({ error: "No PDF uploaded yet" });

    const prompt = `
 "You are an AI assistant that answers questions based on the provided PDF. " +
        "If the answer cannot be found in the context but is about a general educational topic " +
        "(like explaining a concept, technology, or methodology), you can provide a helpful educational " +
        "response, but clearly indicate that you're sharing general knowledge rather than information " +
        "from the user's documents. " +
        "For questions that require specific information from documents that isn't available, " +
        "politely say that you don't know based on the available information, then suggest where the user might find this information elsewhere. " +
        "Be tolerant of typos and unclear phrasing - try to understand what the user meant even if there are mistakes. " +
        "If you recognize a typo or ambiguous reference, respond to what you believe the user intended to ask. " +
        "Answer like a helpful human would."

PDF Content (truncated to 4000 chars):
${pdfText.slice(0, 4000)}

Question: ${question}
    `;

    const result = await model.generateContent(prompt);
    res.json({ answer: result.response.text() });
  } catch (error) {
    console.error("Error chatting with PDF:", error);
    res.status(500).json({ error: "Failed to chat with PDF" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
