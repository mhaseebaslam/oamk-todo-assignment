import { fileURLToPath } from "node:url"
import path from "node:path"
import express from "express"
import pg from "pg"
import dotenv from "dotenv"

dotenv.config()

const app = express()
const PORT = Number(process.env.PORT) || 3000
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })

app.use(express.json({ limit: "10kb" }))
app.use("/css", express.static(path.join(projectRoot, "css")))
app.use("/js", express.static(path.join(projectRoot, "js")))
app.use(express.static(path.join(projectRoot, "frontend")))

app.get("/api/health", (_req, res) => res.json({ status: "ok" }))

app.get("/api/todos", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM todos ORDER BY created_at DESC")
    res.json(result.rows)
  } catch (error) {
    console.error("Error fetching todos:", error)
    res.status(500).json({ error: "Could not load tasks." })
  }
})

app.post("/api/todos", async (req, res) => {
  const task = typeof req.body?.task === "string" ? req.body.task.trim() : ""
  if (!task || task.length > 240) {
    return res.status(400).json({ error: "Task must be between 1 and 240 characters." })
  }

  try {
    const result = await pool.query("INSERT INTO todos (task) VALUES ($1) RETURNING *", [task])
    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error("Error adding todo:", error)
    res.status(500).json({ error: "Could not add task." })
  }
})

app.put("/api/todos/:id", async (req, res) => {
  const { id } = req.params
  const { completed } = req.body ?? {}
  if (!/^\d+$/.test(id) || typeof completed !== "boolean") {
    return res.status(400).json({ error: "A valid task ID and completion status are required." })
  }

  try {
    const result = await pool.query("UPDATE todos SET completed = $1 WHERE id = $2 RETURNING *", [completed, id])
    if (result.rows.length === 0) return res.status(404).json({ error: "Task not found." })
    res.json(result.rows[0])
  } catch (error) {
    console.error("Error updating todo:", error)
    res.status(500).json({ error: "Could not update task." })
  }
})

app.delete("/api/todos/:id", async (req, res) => {
  const { id } = req.params
  if (!/^\d+$/.test(id)) return res.status(400).json({ error: "A valid task ID is required." })

  try {
    const result = await pool.query("DELETE FROM todos WHERE id = $1 RETURNING id", [id])
    if (result.rows.length === 0) return res.status(404).json({ error: "Task not found." })
    res.status(204).end()
  } catch (error) {
    console.error("Error deleting todo:", error)
    res.status(500).json({ error: "Could not delete task." })
  }
})

async function start() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      task TEXT NOT NULL,
      completed BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)
  app.listen(PORT, () => console.log(`Daymark is running at http://localhost:${PORT}`))
}

start().catch((error) => {
  console.error("Could not start Daymark:", error)
  process.exitCode = 1
})
