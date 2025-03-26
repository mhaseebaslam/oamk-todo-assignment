class Task {
    constructor(id, description) {
        this.id = id;
        this.description = description;
    }

    getId() {
        return this.id;
    }

    getDescription() {
        return this.description;
    }
}

export { Task };

class Todos {
    #tasks = [];
    #backend_url = '';

    /**
     * @param {string} url - The backend URL for the tasks API.
     */
    constructor(url) {
        this.#backend_url = url;
    }

    /**
     * Fetches tasks from the backend.
     * @returns {Promise<Task[]>} - A promise that resolves to an array of tasks.
     */
    getTasks = async () => {
        try {
            const response = await fetch(`${this.#backend_url}`);
            this.#checkResponse(response);
            const tasksJson = await response.json();
            this.#readJson(tasksJson);
            return this.#tasks;
        } catch (error) {
            throw new Error(`Failed to fetch tasks: ${error.message}`);
        }
    }

    /**
     * Adds a new task to the backend and the local array.
     * @param {string} text - The description of the task.
     * @returns {Promise<Task>} - A promise that resolves to the newly added task.
     */
    addTask = async (text) => {
        try {
            const response = await fetch(`${this.#backend_url}/new`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ description: text })
            });
            this.#checkResponse(response);
            const newTaskJson = await response.json();
            return this.#addToArray(newTaskJson.id, newTaskJson.description);
        } catch (error) {
            throw new Error(`Failed to save task: ${error.message}`);
        }
    }

    /**
     * Removes a task from the backend and the local array.
     * @param {number} id - The ID of the task to remove.
     * @returns {Promise<number>} - A promise that resolves to the ID of the removed task.
     */
    removeTask = async (id) => {
        try {
            const response = await fetch(`${this.#backend_url}/delete/${id}`, {
                method: 'DELETE'
            });
            this.#checkResponse(response);
            this.#removeFromArray(id);
            return id;
        } catch (error) {
            throw new Error(`Failed to remove task: ${error.message}`);
        }
    }

    /**
     * Reads tasks from JSON and populates the local array.
     * @param {Object[]} tasksJson - The JSON array of tasks.
     * @private
     */
    #readJson = (tasksJson) => {
        tasksJson.forEach(node => {
            const task = new Task(node.id, node.description);
            this.#tasks.push(task);
        });
    }

    /**
     * Adds a task to the local array.
     * @param {number} id - The ID of the task.
     * @param {string} text - The description of the task.
     * @returns {Task} - The newly added task.
     * @private
     */
    #addToArray = (id, text) => {
        const task = new Task(id, text);
        this.#tasks.push(task);
        return task;
    }

    /**
     * Removes a task from the local array.
     * @param {number} id - The ID of the task to remove.
     * @private
     */
    #removeFromArray = (id) => {
        this.#tasks = this.#tasks.filter(task => task.getId() !== id);
    }

    /**
     * Checks the response status and throws an error if it's not OK.
     * @param {Response} response - The fetch response.
     * @throws {Error} - If the response status is not OK.
     * @private
     */
    #checkResponse = (response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    }
}

export { Todos };
