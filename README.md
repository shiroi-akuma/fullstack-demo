# Full-Stack Demo: Quote Request Log

Frontend (HTML/CSS/JS) → Backend (Express API) → Database (SQLite file).
Already tested working: submit the form, it's saved for real and reloads on refresh.

## Run it locally

```
npm install
npm start
```

Then open http://localhost:3000 in your browser.

- Submitting the form → sends data to the backend → saved in `data.db`
- Reloading the page → backend reads `data.db` → list still shows your entries
- "Remove" button → deletes that row from the database

`data.db` is created automatically on first run — it's the whole database, just one file.

## How the pieces talk to each other

1. Browser loads `public/index.html` (the frontend)
2. Frontend JavaScript calls `fetch('/api/requests')` — this hits your Express backend
3. Express (`server.js`) runs a SQL query against `data.db` and sends back JSON
4. Frontend JS turns that JSON into the `<li>` list on the page

Same round-trip happens on submit (POST) and remove (DELETE) — that loop is the entire
idea of "full-stack": frontend never talks to the database directly, only through the API.

## Deploy it so it's live 24/7

1. Push this folder to a GitHub repo
2. Go to [render.com](https://render.com) → New → Web Service → connect the repo
3. Build command: `npm install` — Start command: `npm start`
4. Deploy — Render gives you a live URL, running continuously (not just on your laptop)

Note: on Render's free tier, the SQLite file resets if the service restarts/redeploys,
since free instances don't keep persistent disk. Fine for a demo/learning; for something
real (like your uncle's site) you'd either pay for Render's persistent disk add-on, or
swap SQLite for a hosted database like Render's free PostgreSQL.
