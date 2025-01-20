This project provides an application that allows users to upload PDF or image files (JPEG/PNG). The server extracts text from the files using optical character recognition (OCR) for images and text parsing for PDFs. Additionally, it integrates an AI API for generating content suggestions to enhance engagement.

Features:
File Upload: Upload PDF, JPEG, or PNG files.
Text Extraction: Extracts text from PDF and images using OCR.
AI Suggestions: Get engagement suggestions for the extracted text, such as hashtags and bullet points.

Backend (Express.js)
The backend is built using Express.js to handle file uploads, process PDFs, and images. It uses multer for handling multipart form data and Tesseract.js for OCR image processing.

Technologies Used:
Node.js
Express.js
Multer: File upload middleware.
pdf-parse: Extracts text from PDF files.
Tesseract.js: Performs OCR on images to extract text.
CORS: To handle cross-origin requests from the frontend.

SETUP :- 
1. Clone the repository
    git clone https://github.com/your-username/repo-name.git
2. Install dependencies
   cd backend
    npm install
3. Start the server
   npm start

The backend will run on http://localhost:5000.

