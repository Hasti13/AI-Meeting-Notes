const express = require("express");
const multer = require("multer");
const fs = require("fs");
const cors = require("cors");
const { GoogleGenAI, Type } = require("@google/genai");
require("dotenv").config();
const path = require('path');

const app = express();
app.use(cors({
    origin: '*',  
    methods: ['POST'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const storage = multer.diskStorage({
    destination: "uploadDir",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

app.post("/upload", upload.single("audio"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No audio file provided." });
    }

    let uploadedFileRef = null;

    try {
        const mimeType = req.file.mimetype || "audio/mp3";

        console.log("Uploading file to Gemini File API...");
        uploadedFileRef = await ai.files.upload({
            file: req.file.path,
            config: { mime_type: mimeType }
        });

        let fileState = await ai.files.get({ name: uploadedFileRef.name });
        while (fileState.state === "PROCESSING") {
            console.log("Audio is processing... waiting 2 seconds.");
            await new Promise((resolve) => setTimeout(resolve, 2000));
            fileState = await ai.files.get({ name: uploadedFileRef.name });
        }

        if (fileState.state === "FAILED") {
            throw new Error("Gemini audio processing failed on Google servers.");
        }

        console.log("Audio file is active! Running analysis...");

         let response = null;
        let retries = 3;
        let delay = 3000; 

        while (retries > 0) {
            try {
                 response = await ai.models.generateContent({
                    model: "gemini-2.5-flash", 
                    contents: [
                        {
                            fileData: {
                                fileUri: uploadedFileRef.uri,
                                mimeType: uploadedFileRef.mimeType
                            }
                        },
                        "Analyze this meeting audio and extract an executive summary, clear actionable items, and strategic key insights according to the requested schema."
                    ],
                    config: {
                        responseMimeType: "application/json",
                        responseSchema: {
                            type: Type.OBJECT,
                            properties: {
                                summary: { type: Type.STRING },
                                actionItems: {
                                    type: Type.ARRAY,
                                    items: { type: Type.STRING }
                                },
                                keyPoints: {
                                    type: Type.ARRAY,
                                    items: { type: Type.STRING }
                                }
                            },
                            required: ["summary", "actionItems", "keyPoints"]
                        }
                    }
                });
                break;
            } catch (apiError) {
                if (apiError.status === 503 && retries > 1) {
                    console.log(`Gemini is busy (503). Retrying in ${delay / 1000} seconds... (${retries - 1} retries left)`);
                    retries--;
                    await new Promise(resolve => setTimeout(resolve, delay));
                } else {
                    throw apiError;
                }
            }
        }

        if (!response) {
            throw new Error("Failed to get a valid response from Gemini after retries.");
        }

        let rawText = response.text || "";
        rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();

        console.log("Generated Payload Successfully:", rawText);
        const parsed = JSON.parse(rawText);
        res.json(parsed);

    } catch (error) {
        console.error("Gemini Server Error:", error);

        res.status(500).json({
            error: "Something went wrong processing your request with Gemini."
        });
    } finally {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
            console.log("Cleaned up local file from server storage.");
        }
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
