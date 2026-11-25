const taskList = document.querySelector("#taskList")
const todoForm = document.querySelector("#todoForm")
const taskInput = document.querySelector("#taskInput")
const statusMessage = document.querySelector("#statusMessage")
const taskCount = document.querySelector("#taskCount")
const remainingCount = document.querySelector("#remainingCount")
const progressTrack = document.querySelector(".progress-track")
const progressFill = document.querySelector("#progressFill")
const progressLabel = document.querySelector("#progressLabel")
const apiUrl = document.body.dataset.api
const storageKey = "daymark.todos"

let todos = []
let filter = "all"
let messageTimeout

function showMessage(message, isError = false) {
  window.clearTimeout(messageTimeout)
  statusMessage.textContent = message
  statusMessage.classList.toggle("is-error", isError)
  messageTimeout = window.setTimeout(() => {
    statusMessage.textContent = ""
    statusMessage.classList.remove("is-error")
  }, 3500)
}

async function request(path, options) {
  const response = await fetch(`${apiUrl}${path}`, options)
  if (!response.ok) {
    const result = await response.json().catch(() => ({}))
    throw new Error(result.error || "Something went wrong. Please try again.")
  }
  return response.status === 204 ? null : response.json()
}

function saveLocalTodos() {
  window.localStorage.setItem(storageKey, JSON.stringify(todos))
}

function visibleTodos() {
  if (filter === "active") return todos.filter((todo) => !todo.completed)
  if (filter === "completed") return todos.filter((todo) => todo.completed)
  return todos
}

function createTodoElement(todo) {
  const item = document.createElement("li")
  item.className = `task-row${todo.completed ? " is-completed" : ""}`
  item.dataset.id = todo.id

  const checkbox = document.createElement("input")
  checkbox.className = "task-checkbox"
  checkbox.type = "checkbox"
  checkbox.checked = Boolean(todo.completed)
  checkbox.setAttribute("aria-label", `Mark "${todo.task}" as ${todo.completed ? "to do" : "done"}`)
  checkbox.addEventListener("change", () => toggleTodo(todo.id, checkbox.checked))

  const copy = document.createElement("div")
  copy.className = "task-copy"
  const text = document.createElement("span")
  text.className = "task-text"
  text.textContent = todo.task
  copy.append(text)

  const remove = document.createElement("button")
  remove.className = "delete-button"
  remove.type = "button"
  remove.setAttribute("aria-label", `Delete "${todo.task}"`)
  remove.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3"/></svg>'
  remove.addEventListener("click", () => deleteTodo(todo.id))

  item.append(checkbox, copy, remove)
  return item
}

function render() {
  const visible = visibleTodos()
  taskList.replaceChildren()

  if (visible.length === 0) {
    const empty = document.createElement("li")
    empty.className = "empty-state"
    const icon = document.createElement("span")
    icon.className = "empty-icon"
    icon.setAttribute("aria-hidden", "true")
    icon.textContent = filter === "completed" ? "✓" : "✦"
    const title = document.createElement("strong")
    const detail = document.createElement("span")

    if (todos.length === 0) {
      title.textContent = "A clear start."
      detail.textContent = "Add a task above and take it from there."
    } else if (filter === "active") {
      title.textContent = "All caught up."
      detail.textContent = "You’ve finished everything on your list."
    } else if (filter === "completed") {
      title.textContent = "Nothing finished just yet."
      detail.textContent = "Completed tasks will find a home here."
    } else {
      title.textContent = "No tasks match this view."
      detail.textContent = "Try another filter to see your tasks."
    }

    empty.append(icon, title, detail)
    taskList.append(empty)
  } else {
    visible.forEach((todo) => taskList.append(createTodoElement(todo)))
  }

  const completed = todos.filter((todo) => todo.completed).length
  const remaining = todos.length - completed
  const percentage = todos.length === 0 ? 0 : Math.round((completed / todos.length) * 100)
  taskCount.textContent = String(todos.length)
  remainingCount.textContent = remaining === 0
    ? (todos.length === 0 ? "Nothing on your plate" : "Everything is done")
    : `${remaining} ${remaining === 1 ? "task" : "tasks"} left`
  progressFill.style.width = `${percentage}%`
  progressTrack.setAttribute("aria-valuenow", String(percentage))
  progressLabel.textContent = `${percentage}% complete`

  document.querySelectorAll("[data-filter]").forEach((button) => {
    const selected = button.dataset.filter === filter
    button.classList.toggle("is-active", selected)
    button.setAttribute("aria-pressed", String(selected))
  })
}

async function loadTodos() {
  try {
    if (apiUrl) {
      todos = await request("")
    } else {
      const saved = window.localStorage.getItem(storageKey)
      todos = saved ? JSON.parse(saved) : []
      if (!Array.isArray(todos)) throw new Error("Saved tasks could not be read.")
    }
    render()
  } catch (error) {
    console.error("Could not load tasks:", error)
    showMessage(error.message || "Could not load tasks.", true)
  }
}

async function addTodo(task) {
  try {
    if (apiUrl) {
      const created = await request("", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task }),
      })
      todos.unshift(created)
    } else {
      todos.unshift({ id: crypto.randomUUID(), task, completed: false })
      saveLocalTodos()
    }
    filter = "all"
    render()
    showMessage("Task added to your list.")
  } catch (error) {
    console.error("Could not add task:", error)
    showMessage(error.message || "Could not add task.", true)
  }
}

async function toggleTodo(id, completed) {
  try {
    if (apiUrl) {
      const updated = await request(`/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      })
      todos = todos.map((todo) => String(todo.id) === String(id) ? updated : todo)
    } else {
      todos = todos.map((todo) => String(todo.id) === String(id) ? { ...todo, completed } : todo)
      saveLocalTodos()
    }
    render()
  } catch (error) {
    console.error("Could not update task:", error)
    showMessage(error.message || "Could not update task.", true)
    render()
  }
}

async function deleteTodo(id) {
  try {
    if (apiUrl) {
      await request(`/${encodeURIComponent(id)}`, { method: "DELETE" })
    }
    todos = todos.filter((todo) => String(todo.id) !== String(id))
    if (!apiUrl) saveLocalTodos()
    render()
    showMessage("Task removed.")
  } catch (error) {
    console.error("Could not delete task:", error)
    showMessage(error.message || "Could not delete task.", true)
  }
}

todoForm.addEventListener("submit", (event) => {
  event.preventDefault()
  const task = taskInput.value.trim()
  if (!task) return
  addTodo(task)
  taskInput.value = ""
  taskInput.focus()
})

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    filter = button.dataset.filter
    render()
  })
})

loadTodos()
