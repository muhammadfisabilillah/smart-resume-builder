import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware 
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai
from google.genai import types

# Load file .env
load_dotenv()

# Inisialisasi FastAPI
app = FastAPI()

# --- BLOK CORS (Pastikan bagian ini masuk) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Mengizinkan Next.js frontend akses API
    allow_credentials=True,
    allow_methods=["*"],                      # Mengizinkan semua method (GET, POST, dll)
    allow_headers=["*"],                      # Mengizinkan semua headers
)

# Inisialisasi Client Gemini menggunakan API Key dari .env
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise RuntimeError("GEMINI_API_KEY tidak ditemukan di file .env")

client = genai.Client(api_key=api_key)

# Struktur data input dari user (Frontend)
class ResumeInput(BaseModel):
    text: str

@app.get("/")
def read_root():
    return {"message": "AI Smart Resume Builder API is running!"}

@app.post("/api/optimize")
def optimize_resume(input_data: ResumeInput):
    try:
        # Prompt untuk memaksa AI bertindak sebagai professional resume writer dan mengembalikan format JSON
        prompt = f"""
        Kamu adalah seorang Professional Resume Writer dan Pakar HR Rekrutmen standar ATS (Applicant Tracking System).
        Tugasmu adalah memperbaiki kalimat deskripsi pengalaman kerja berikut agar menjadi lebih profesional, menggunakan kata kerja aktif (action verbs), dan berorientasi pada hasil (result-oriented).

        Teks Asli: "{input_data.text}"

        Kamu WAJIB mengembalikan jawaban HANYA dalam format JSON dengan struktur seperti contoh berikut tanpa tambahan teks markdown lainnya:
        {{
            "original_text": "Teks asli dari user",
            "suggested_text": "Hasil perbaikan teks yang lebih profesional dan ramah ATS",
            "reason": "Alasan singkat kenapa kalimat tersebut diubah"
        }}
        """

        # Memanggil Model Gemini
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json", # Mengunci output agar wajib JSON
            ),
        )

        # Mengembalikan teks JSON dari Gemini langsung ke frontend
        import json
        return json.loads(response.text)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))