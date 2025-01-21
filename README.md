# CLI MERN Project Setup

This project setup script allows you to quickly create a full-stack application with React (frontend), TailwindCss (style), MongoDB (database), Node.js (backend), and Express (web framework). It initializes the project folder structure, sets up the backend with Node.js, Express, and MongoDB, and creates the frontend with React, Vite, Tailwind CSS, and Toast notifications.

## Prerequisites

Make sure you have the following installed on your system:

- **Node.js** (with `npm`): [Install Node.js](https://nodejs.org/)
- **MongoDB**: [Install MongoDB](https://www.mongodb.com/docs/manual/installation/)

## Installation

To use the setup script, run the following command:

```bash
npm install -g cli-mern
```

Run the CLI to create a new project:

```bash
create-my-project
```

Project Structure
After running the CLI, the following project structure will be created:

```bash
<your-project-name>/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── .env
├── frontend/
│   ├── public/
│   └── src/
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│       └── tailwind.config.js
```
