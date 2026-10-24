# Two-Way Filipino Sign Language (FSL) Translator

A real-time web application for bidirectional communication between the Deaf and hearing communities. 
* **Handsign-to-Text:** Uses **Google MediaPipe** (126 skeletal hand keypoints), **Scikit-Learn** (Random Forest for static alphabet signs), and **TensorFlow/Keras** (LSTM Neural Network for dynamic phrase sequences).
* **Speech-to-Handsign:** Uses the **Web Speech API** (`fil-PH`) with a custom Tagalog/English phonetic correction engine and dynamic `.mp4` sign video queuing.

---

## Prerequisites
Before setting up the project, ensure you have the following installed:
1. **Node.js** (v18 or higher)
2. **Python** (v3.9 – v3.11 recommended for TensorFlow compatibility)
3. **Google Chrome** or **Microsoft Edge** (Required for Web Speech API support)
4. A working **Webcam** and **Microphone**

---

## Step-by-Step Setup Guide

### 1. Clone the Repository
Open your terminal and run:
```bash
git clone https://github.com/steiusido/fsl-api.git
cd <YOUR_PROJECT_FOLDER>
```

---

### 2. Backend Setup (Python / FastAPI)
Open a terminal inside the backend folder (`fsl-api`):

```bash
# 1. Create a virtual environment
python -m venv venv

# 2. Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# 3. Install required Python libraries
pip install -r requirements.txt

# 4. Run the FastAPI server
uvicorn main:app --reload
```
* The backend API will start at: `http://localhost:8000`
* Interactive API Swagger Docs: `http://localhost:8000/docs`

---

### 3. Frontend Setup (React / Vite)
Keep the backend terminal running. Open a **second terminal** inside the frontend folder (`fsl-frontend`):

```bash
# 1. Install frontend dependencies
npm install

# 2. Start the development server
npm run dev
```
* Open **Google Chrome** and navigate to: `http://localhost:5173`
* **Important:** Click **"Allow"** when the browser asks for **Camera** and **Microphone** permissions.

---

## Troubleshooting
* **`ERR_ADDRESS_INVALID` on `0.0.0.0:8000`:** Always open `http://localhost:8000/docs` or `http://127.0.0.1:8000/docs` in your browser instead of `0.0.0.0`.
* **Speech-to-Handsign not listening:** Ensure you are using **Google Chrome** or **Edge** and that your microphone is set as the default input device in your system settings.
* **Missing Sign Video:** Ensure `.mp4` files are placed inside `public/signs/` in uppercase hyphenated format (e.g., `public/signs/MAGANDANG-GABI.mp4`).
