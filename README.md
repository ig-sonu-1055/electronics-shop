# Electronics Shop

Project structure is now separated into frontend and backend folders.

## Folder Structure

- `frontend/` - React app (Create React App)
- `backend/` - Node.js + Express API

## Run Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:3000` by default.

## Run Backend

```bash
cd backend
npm install
npm start
```

Backend runs on `http://localhost:5000` (or `PORT` from `backend/.env`).

## Environment Variables

Backend environment file: `backend/.env`

Required backend variables:

- `MONGODB_URI`
- `JWT_SECRET`
- `PORT`

Frontend can use:

- `REACT_APP_API_URL` (example: `http://localhost:5000/api`)

## Deployment Notes

- Deploy `backend/` as a Node Web Service on Render.
- Deploy `frontend/` as a Static Site on Render.
- Add rewrite rule for SPA routing on frontend: `/* -> /index.html`.
