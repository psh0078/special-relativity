# Special Relativity Simulator

An interactive simulator for visualizing scenarios in special relativity. Built with a Vue 3 frontend and Django REST backend.

## 🛠️ Tech Stack

- **Frontend**: Vue.js 3, TypeScript, Vite, Vuetify, Two.js
- **Backend**: Django 5.2, Django REST Framework
- **Package Manager**: pnpm

---

## ⚙️ Development Setup

### 📦 Prerequisites

- Python 3.10+
- Node.js (v18+ recommended)
- `pnpm` (instead of `npm`)
- `virtualenv` or `venv` for Python

---

### 🔧 Backend Setup

1. Navigate to the `backend/` directory:

    ```bash
    cd backend
    ```

2. Create and activate a virtual environment:

    ```bash
    python -m venv venv
    source venv/bin/activate  # or use `venv\Scripts\activate` on Windows
    ```

3. Install Python dependencies:

    ```bash
    pip install -r requirements.txt
    ```

4. Set up environment variables:

   Create a `.env` file in the `backend/` directory and add:

   ```env
   DEBUG=True
   SECRET_KEY=your-secret-key-here  # generate your own with `python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`
   ALLOWED_HOSTS=localhost,127.0.0.1
   CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
   CORS_ALLOW_CREDENTIALS=True
   ```

5. Run the Django server:

    ```bash
    python manage.py runserver
    ```

---

### 🎨 Frontend Setup

1. Navigate to the frontend directory (where `package.json` is located):

    ```bash
    cd frontend
    ```

2. Install dependencies using pnpm:

    ```bash
    pnpm install
    ```

3. Start the development server:

    ```bash
    pnpm dev
    ```

This will concurrently run both the Vite frontend and Django backend.

---
