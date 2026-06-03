# TalentBridge

This repository contains a Django backend and a Next.js frontend for TalentBridge.

## Backend Setup

1. Open a terminal and go to `backend`:
   ```bash
   cd backend
   ```

2. Create and activate your virtual environment:
   ```powershell
   python -m venv venv
   venv\Scripts\activate
   ```

3. Install backend packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update values for PostgreSQL if using it

5. Run migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. Create a superuser:
   ```bash
   python manage.py createsuperuser
   ```

7. Start the backend server:
   ```bash
   python manage.py runserver
   ```

The backend is available at `http://127.0.0.1:8000`.

## Frontend Setup

1. Open a terminal and go to `frontend`:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend:
   ```bash
   npm run dev
   ```

The frontend is available at `http://localhost:3000`.

## Notes

- The backend settings now support a PostgreSQL configuration through environment variables and fall back to SQLite when `DJANGO_DB_ENGINE` is not set.
- The frontend includes authentication pages, recruiter pages, and candidate pages with a shared sidebar and navbar layout.
- API calls use `http://127.0.0.1:8000/api` by default.
