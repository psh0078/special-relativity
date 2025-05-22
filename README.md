# Special Relativity Simulator

An interactive simulator for visualizing scenarios in special relativity. Built with a Vue 3 frontend and Django REST backend.

<img src="https://github.com/user-attachments/assets/2226f101-590b-4eb5-b7e2-a1b624f5ba4d" width="400"/>

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

4. Run the development server:

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
