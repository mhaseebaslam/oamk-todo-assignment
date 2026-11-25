# Daymark

Daymark is a simple, responsive task list for keeping your day focused. The same interface runs as a static site or with the optional Express and PostgreSQL backend.

## Features

- Add, complete, and remove tasks
- Filter tasks by all, to do, and done
- See remaining work and completion progress at a glance
- Use the static demo without an account or a backend; tasks are saved in this browser
- Run the API-backed version with PostgreSQL for server-side persistence
- Responsive layout, keyboard-friendly controls, and screen-reader labels

## Static demo

Open `index.html`, or serve the project root with any static file server. For example:

```sh
python3 -m http.server 8080
```

Then visit `http://localhost:8080`. GitHub Pages serves this static version automatically.

## PostgreSQL-backed version

1. Create a PostgreSQL database, for example `todo_db`.
2. Create `backend/.env` from the sample and set your database connection string:

   ```sh
   cp backend/.env.example backend/.env
   ```

   ```dotenv
   PORT=3000
   DATABASE_URL=postgresql://username:password@localhost:5432/todo_db
   ```

3. Install and start the backend:

   ```sh
   cd backend
   npm install
   npm run dev
   ```

4. Visit `http://localhost:3000`. The server creates the `todos` table on startup and serves the API-backed app.

The API is available at `GET /api/todos`, `POST /api/todos`, `PUT /api/todos/:id`, and `DELETE /api/todos/:id`. A lightweight status endpoint is available at `GET /api/health`.

## License

This project is available under the MIT License. See [LICENSE](LICENSE).
