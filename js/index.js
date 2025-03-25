import { Todos } from './class/Todos.js';

const BACKEND_ROOT_URL = 'http://localhost:3001';
const todos = new Todos(BACKEND_ROOT_URL);

const list = document.querySelector('.list-group');
const input = document.querySelector('.form-control');
const loadingIndicator = document.querySelector('.loading-indicator');

if (!list || !input || !loadingIndicator) {
    console.error('One or more required elements are missing from the DOM.');
    alert('Failed to initialize the app. Please check the DOM elements.');
    throw new Error('Initialization error');
}

input.disabled = true;

// Function to render a task in the list
const renderTask = (task) => {
    const li = document.createElement('li');
    li.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-center');
    li.setAttribute('data-key', task.getId().toString());
    li.innerHTML = `
        <span>${task.getText()}</span>
        <button type="button" class="btn btn-danger delete-task"><i class="fas fa-trash-alt"></i></button>
    `;
    list.appendChild(li);

    // Add event listener for delete task
    const deleteButton = li.querySelector('.delete-task');
    deleteButton.addEventListener('click', async (event) => {
        event.preventDefault();
        try {
            await todos.removeTask(task.getId());
            li.remove();
        } catch (error) {
            console.error(error);
            alert('Failed to delete task. Please try again.');
        }
    });
}

// Function to fetch and render tasks
const getTasks = async () => {
    try {
        loadingIndicator.style.display = 'block';
        const tasks = await todos.getTasks();
        tasks.forEach(task => {
            renderTask(task);
        });
        input.disabled = false;
    } catch (error) {
        console.error(error);
        alert('Failed to fetch tasks. Please try again.');
    } finally {
        loadingIndicator.style.display = 'none';
    }
}

// Function to save a new task
const saveTask = async (taskText) => {
    try {
        loadingIndicator.style.display = 'block';
        input.disabled = true;
        const newTask = await todos.addTask(taskText);
        renderTask(newTask);
        input.value = '';
    } catch (error) {
        console.error(error);
        alert('Failed to add task. Please try again.');
    } finally {
        loadingIndicator.style.display = 'none';
        input.disabled = false;
    }
}

// Event listener for adding a task on Enter key press
input.addEventListener('keypress', async (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        const taskText = input.value.trim();
        if (taskText !== '') {
            await saveTask(taskText);
        }
    }
});

// Initial fetch of tasks
getTasks();
