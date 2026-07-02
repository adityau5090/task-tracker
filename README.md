# Tracklet — MERN Task Tracker

A full-stack task tracker built with MongoDB, Express, React, and Node.js.

WebSite link: https://task-tracker-1-70ow.onrender.com

Backend: https://task-tracker-vtvo.onrender.com/ 

Features:
- Sign up / sign in with name, email, and password (no token-based auth — kept intentionally simple)
- Create, view, update, and delete tasks (full CRUD via REST API)
- Filter by status/priority, search by title, and sort tasks
- Dynamic updates with no page reloads
- Light and dark theme toggle, orange accent throughout
- Frosted-glass ("smoky glass") navbar
- Animated typewriter greeting on the dashboard (types the user's name/email, pauses, erases, repeats)
- Uniquely styled, animated task cards — no two neighboring cards look identical
- Toast notifications, form validation, responsive layout down to mobile
- Environment variables for easy configuration (MongoDB URL, API URL)

---

## 1. Project structure

```
task-tracker/
├── backend/          Express + MongoDB REST API
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── .env.example
└── frontend/         React (Vite) client
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── services/
    │   └── index.css
    └── .env.example
```

## 2. Prerequisites

- Node.js 18+ and npm
- A MongoDB database — either:
  - [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier, cloud-hosted), or
  - a local MongoDB instance

## 3. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and paste in your own values:

```
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/task-tracker
PORT=5000
CLIENT_URL=http://localhost:5173
```

Run it:

```bash
npm run dev      # with nodemon, auto-restarts on changes
# or
npm start
```

The API will be available at `http://localhost:5000`.

### API reference

| Method | Route              | Description                          |
|--------|---------------------|---------------------------------------|
| POST   | /api/auth/signup     | Create an account (name, email, password) |
| POST   | /api/auth/login      | Log in (email, password)             |
| GET    | /api/tasks?userId=   | List tasks (supports `status`, `priority`, `search`, `sort` query params) |
| POST   | /api/tasks            | Create a task                        |
| PUT    | /api/tasks/:id         | Update a task                        |
| DELETE | /api/tasks/:id         | Delete a task                        |

## 4. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
```

Open `.env` and point it at your backend:

```
VITE_API_URL=http://localhost:5000/api
```

Run it:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## 5. Building for production

```bash
cd frontend
npm run build
```

This outputs static files to `frontend/dist`, ready to deploy anywhere that serves static sites.

## 6. Deployment (suggested free options)

**Backend** — deploy the `backend` folder to [Render](https://render.com), [Railway](https://railway.app), or [Cyclic](https://www.cyclic.sh):
1. Push this project to a GitHub repo.
2. Create a new Web Service pointing at the `backend` folder.
3. Set the build command to `npm install` and start command to `npm start`.
4. Add environment variables `MONGO_URI`, `PORT`, and `CLIENT_URL` (your deployed frontend URL) in the host's dashboard.

**Frontend** — deploy the `frontend` folder to [Vercel](https://vercel.com) or [Netlify](https://netlify.com):
1. Import the same GitHub repo, set the root directory to `frontend`.
2. Build command: `npm run build`, output directory: `dist`.
3. Add an environment variable `VITE_API_URL` pointing at your deployed backend's `/api` URL.

**Database** — use a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster and whitelist `0.0.0.0/0` (or your host's IPs) so your deployed backend can connect.

Once both are deployed, update `CLIENT_URL` on the backend and `VITE_API_URL` on the frontend to match each other's live URLs, and redeploy.

## 7. Notes

- Authentication is intentionally simple (no JWT/sessions) per assignment scope — passwords are hashed with bcrypt before being stored, but login only checks credentials without issuing a token.
- All form inputs are validated both client-side (immediate feedback) and server-side (via Mongoose schema validation).
