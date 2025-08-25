# 📄 PDF Chat Application

A modern, interactive PDF chat application that allows users to upload PDF documents and have intelligent conversations about their content using Google's Gemini AI. Built with React frontend and Node.js backend.

![PDF Chat App](https://img.shields.io/badge/React-18.x-blue) ![Node.js](https://img.shields.io/badge/Node.js-18.x-green) ![Google Gemini](https://img.shields.io/badge/Google-Gemini%20AI-orange)

## ✨ Features

- 🚀 **Drag & Drop PDF Upload** - Easy file upload with progress tracking
- 💬 **AI-Powered Chat** - Intelligent conversations about PDF content using Google Gemini
- 📖 **Split-Screen PDF Viewer** - View PDF alongside chat interface
- 🎨 **Modern UI/UX** - Beautiful gradient designs and smooth animations
- 📏 **Resizable Panels** - Draggable divider to adjust chat/PDF viewer sizes
- 🤖 **Welcome Messages** - Guided experience with suggested questions
- ⚡ **Real-time Responses** - Fast AI responses with loading indicators
- 📱 **Responsive Design** - Works on desktop and mobile devices

## 🏗️ Project Structure

```
PDF_Chat/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   ├── ChatView.jsx    # Main chat interface
│   │   └── FileUpload.jsx  # PDF upload component
│   ├── package.json
│   └── vite.config.js
├── server/                 # Node.js Backend
│   ├── index.js           # Main server file
│   ├── package.json
│   └── .env               # Environment variables
├── README.md
└── .gitignore
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Google Gemini API Key** - [Get it here](https://makersuite.google.com/app/apikey)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sravanr788/PDF_Chat.git
   cd PDF_Chat
   ```

2. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../client
   npm install
   ```

### Environment Setup

1. **Create environment file** in the `server` directory:
   ```bash
   cd server
   touch .env
   ```

2. **Add your Google Gemini API key** to `.env`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=5000
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd server
   npm start
   ```
   Server will run on: http://localhost:5000

2. **Start the Frontend Development Server** (in a new terminal)
   ```bash
   cd client
   npm run dev
   ```
   Frontend will run on: http://localhost:5173

## 📖 Usage Instructions

1. **Upload a PDF**
   - Drag and drop a PDF file onto the upload area
   - Or click to browse and select a PDF file
   - Wait for the upload progress to complete

2. **Start Chatting**
   - Once uploaded, you'll see a welcome message with suggested questions
   - Click on suggested questions or type your own
   - Ask anything about the PDF content

3. **Customize Your View**
   - Drag the blue divider between chat and PDF viewer to resize panels
   - Use the X button to close and upload a new PDF

## 🛠️ Technology Stack

### Frontend
- **[React 18](https://reactjs.org/)** - UI framework
- **[Vite](https://vitejs.dev/)** - Build tool and dev server
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling framework
- **[Lucide React](https://lucide.dev/)** - Icon library
- **[react-pdf](https://github.com/wojtekmaj/react-pdf)** - PDF rendering

### Backend
- **[Node.js](https://nodejs.org/)** - Runtime environment
- **[Express.js](https://expressjs.com/)** - Web framework
- **[Google Gemini AI](https://ai.google.dev/)** - AI chat responses
- **[pdf-extraction](https://www.npmjs.com/package/pdf-extraction)** - PDF text extraction
- **[Multer](https://github.com/expressjs/multer)** - File upload handling
- **[CORS](https://github.com/expressjs/cors)** - Cross-origin resource sharing

## 🔧 API Endpoints

### Backend Server (http://localhost:5000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/upload` | Upload PDF file and extract text |
| POST | `/chat` | Send question and get AI response |

### Frontend Development Server

| URL | Description |
|-----|-------------|
| http://localhost:5173 | Main application interface |

## 🎨 Key Components

### FileUpload.jsx
- Handles PDF file upload with drag & drop
- Shows upload progress with animated progress bar
- Manages application state transitions

### ChatView.jsx
- Split-screen layout with chat and PDF viewer
- Draggable divider for panel resizing
- AI chat interface with bot icons
- Welcome messages with suggested questions

## 🚀 Deployment

### Frontend Deployment
The frontend can be deployed to platforms like:
- **[Vercel](https://vercel.com/)** - Recommended for React apps
- **[Netlify](https://netlify.com/)** - Easy static site deployment
- **[GitHub Pages](https://pages.github.com/)** - Free hosting

### Backend Deployment
The backend can be deployed to:
- **[Railway](https://railway.app/)** - Simple Node.js deployment
- **[Render](https://render.com/)** - Free tier available
- **[Heroku](https://heroku.com/)** - Popular platform-as-a-service

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) for powerful AI capabilities
- [React PDF](https://github.com/wojtekmaj/react-pdf) for PDF rendering
- [Lucide](https://lucide.dev/) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for styling utilities

## 📞 Support

If you have any questions or run into issues, please:
- Open an issue on [GitHub](https://github.com/sravanr788/PDF_Chat/issues)
- Check the documentation above
- Ensure all dependencies are properly installed

---

**Made with ❤️ by [Sravan](https://github.com/sravanr788)**