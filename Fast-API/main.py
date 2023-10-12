from fastapi import FastAPI, File, UploadFile
import cv2
import pytesseract
from fastapi.middleware.cors import CORSMiddleware
import tempfile
from pydantic import BaseModel
import speech_recognition as sr

app = FastAPI()

origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AudioFile(BaseModel):
    file: UploadFile

# Initialize the recognizer
recognizer = sr.Recognizer()



# @app.get("/")
# async def root():
#     # Provide the path to your image here
#     image_path = './test.jpeg'
    
#     # Call the function to extract text from the image
#     extracted_text = extract_text_from_image(image_path)
    
#     return {"extracted_text"}

def extract_text_from_image(image_path):
    # Read the image using OpenCV
    image = cv2.imread(image_path)

    # Preprocess the image (if needed)
    # You can apply various preprocessing techniques here, depending on your image quality.
    # For example, resizing or denoising.

    # Extract text using Tesseract
    text = pytesseract.image_to_string(image, config='--psm 6')
    return text

@app.post("/uploadfile/")
async def upload_file(file: UploadFile = File(...)):
    file_contents = await file.read()

    # Create a temporary file to store the uploaded content
    with tempfile.NamedTemporaryFile(delete=False) as temp_file:
        temp_file.write(file_contents)
        temp_path = temp_file.name

    extracted_text = extract_text_from_image(temp_path)

    # Don't forget to clean up the temporary file when done
    # os.remove(temp_path)  # Uncomment this when you're done using the file

    return {"extracted_text": extracted_text}

@app.post("/uploadsound/")
async def upload_audio(audio_file: AudioFile):
    try:
        with audio_file.file.file as source:
            audio_data = recognizer.record(source)
            # Recognize the speech using Google Web Speech API
            text = recognizer.recognize_google(audio_data)
            return {"text": text}
    except sr.UnknownValueError:
        return {"error": "Speech recognition could not understand the audio"}
    except sr.RequestError as e:
        return {"error": f"Could not request results from Google Web Speech API; {e}"}
        
        

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

    