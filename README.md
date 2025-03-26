# OAMK TODO Assignment

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Setting Up Your Environment Variables](#setting-up-your-environment-variables)
- [Creating the PostgreSQL Database](#creating-the-postgresql-database)
- [Usage](#usage)
- [Logic Behind the Code](#logic-behind-the-code)
- [Live Demo](#live-demo)
- [Feedback/Suggestions](#feedbacksuggestions)
- [How to Contribute](#how-to-contribute)
- [License](#license)

## Introduction

Welcome to the OAMK TODO Assignment repository! This project features a simple yet effective to-do list application created for an assignment at OAMK. The app helps users manage their daily tasks by allowing them to add, edit, and delete tasks with ease.

## Features

- **Add New Tasks:** Easily add new tasks to your to-do list to keep track of what needs to be done.
- **Edit Existing Tasks:** Modify the details of tasks that are already on your list to keep information up-to-date.
- **Delete Tasks:** Remove tasks that you no longer need to focus on.
- **Mark Tasks as Completed:** Keep track of your progress by marking tasks as completed.
- **Filter Tasks:** Filter tasks based on their completion status to focus on what's important.
- **Responsive Design:** Use the app seamlessly on both desktop and mobile devices.

## Installation

To set up the application on your local machine, follow these steps:

1. **Clone the Repository:**

    ```bash
    git clone https://github.com/mhaseebaslam/oamk-todo-assignment.git
    ```

2. **Navigate to the Project Directory:**

    ```bash
    cd oamk-todo-assignment
    ```

3. **Install the Dependencies:**

    ```bash
    npm install
    ```

## Setting Up Your Environment Variables

For your Todo application to work correctly, you'll need to properly configure the environment variables:

1. Create a `.env` file in the `backend` folder with the following content:

    ```plaintext
    PORT=3000
    DATABASE_URL=postgresql://username:password@localhost:5432/todo_db
    ```

2. Replace the `DATABASE_URL` value with your actual PostgreSQL connection details:
    1. Replace `username` with your PostgreSQL username
    2. Replace `password` with your PostgreSQL password
    3. If your database is named differently than `todo_db`, update that part as well
    4. If PostgreSQL is running on a different port than the default `5432`, update that too

For example, if your PostgreSQL username is "postgres", password is "mysecretpassword", and you want to use a database called "todo_app", your connection string would look like:

    ```plaintext
    DATABASE_URL=postgresql://postgres:mysecretpassword@localhost:5432/todo_app
    ```

## Creating the PostgreSQL Database

Before running the application, make sure you've created the database:

1. Connect to PostgreSQL using the command line or a tool like pgAdmin
2. Create the database:

    ```sql
    CREATE DATABASE todo_db;
    ```

(Or use whatever database name you specified in your DATABASE_URL)

## Usage

To start and use the application, follow these steps:

1. **Install the backend dependencies:**

    ```shell
    cd backend
    npm install
    ```

2. **Start the server:**

    ```shell
    npm run dev
    ```

3. The server will automatically create the necessary `todos` table in your database when it starts up.
4. Access your Todo application at:

    ```plaintext
    http://localhost:3000
    ```

## Troubleshooting Database Connection

If you encounter database connection issues:

1. Verify your PostgreSQL service is running.
2. Check that your username and password are correct.
3. Ensure the database exists.
4. Make sure your PostgreSQL server allows connections from your application.

The application is now set up to use port 3000 by default and will connect to your PostgreSQL database using the connection string you provided. All your todos will be persisted in the database, so they'll remain available even after restarting the application or refreshing the browser.

## Logic Behind the Code

This application is built using modern web development technologies and follows the MVC (Model-View-Controller) architecture to ensure maintainability and separation of concerns. The front-end is developed using React, providing a dynamic and responsive user interface. The back-end is powered by Node.js and Express, handling server-side logic and API requests. The application also uses MongoDB for data storage, ensuring efficient and scalable data management.

## Live Demo

You can see a live demo of the application [here](https://mhaseebaslam.github.io/oamk-todo-assignment/). Check it out to see the app in action!

## Feedback/Suggestions

Your feedback and suggestions are highly appreciated! If you have any ideas on how to improve the application, please open an issue on the GitHub repository or contact me directly.

## How to Contribute

Contributions are welcome! If you would like to contribute to this project, please fork the repository, make your changes, and create a pull request. Your contributions will help make this application even better.

## License

This project is licensed under the MIT License. For more details, see the [LICENSE](LICENSE) file.
