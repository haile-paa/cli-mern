#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { execSync } = require("child_process");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askForProjectName = () => {
  return new Promise((resolve) => {
    rl.question("Enter your project name: ", (projectName) => {
      rl.close();
      resolve(projectName || "mern-project"); // Default to "mern-project" if no name is provided
    });
  });
};

const createFolderStructure = (projectPath) => {
  console.log("Creating project folder structure...");

  const folders = [
    `${projectPath}/backend/config`,
    `${projectPath}/backend/controllers`,
    `${projectPath}/backend/models`,
    `${projectPath}/backend/routes`,
    `${projectPath}/frontend/src`,
    `${projectPath}/frontend/public`,
  ];

  folders.forEach((folder) => {
    try {
      fs.mkdirSync(folder, { recursive: true });
      console.log(`Created folder: ${folder}`);
    } catch (err) {
      console.error(`Failed to create folder: ${folder}`, err);
    }
  });

  console.log("Folder structure created successfully!");
};

const initBackend = async (projectPath) => {
  console.log("Initializing backend...");
  const backendPath = `${projectPath}/backend`;

  try {
    // Initialize package.json and install dependencies
    execSync(
      `cd ${backendPath} && npm init -y && npm install express mongoose cors dotenv`,
      { stdio: "inherit" }
    );

    // Create `server.js` file for the backend
    fs.writeFileSync(
      `${backendPath}/server.js`,
      `const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/mernDB";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// Example route
app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});
    `
    );

    // Create `.env` file with default Mongo URI
    fs.writeFileSync(
      `${backendPath}/.env`,
      `PORT=5000
MONGO_URI=mongodb://localhost:27017/mernDB
    `
    );

    console.log("Backend initialized successfully!");
  } catch (err) {
    console.error("Failed to initialize backend:", err);
  }
};

const initFrontend = (projectPath) => {
  console.log("Initializing frontend...");
  const frontendPath = `${projectPath}/frontend`;

  try {
    // Initialize package.json and install dependencies
    execSync(
      `cd ${frontendPath} && npm init -y && npm install react react-dom vite tailwindcss postcss autoprefixer toastify-js`,
      { stdio: "inherit" }
    );

    // Overwrite package.json with the desired structure
    const frontendPackageJson = {
      name: "frontend",
      version: "1.0.0",
      main: "src/main.jsx",
      scripts: {
        dev: "vite",
        build: "vite build",
        preview: "vite preview",
      },
      dependencies: {
        react: "^19.0.0",
        "react-dom": "^19.0.0",
        tailwindcss: "^3.4.17",
        vite: "^6.0.7",
        "toastify-js": "^1.13.2",
      },
    };

    fs.writeFileSync(
      `${frontendPath}/package.json`,
      JSON.stringify(frontendPackageJson, null, 2)
    );

    // Create Tailwind CSS configuration
    execSync(`cd ${frontendPath} && npx tailwindcss init -p`, {
      stdio: "inherit",
    });

    // Create `App.jsx` with Toastify functionality
    fs.writeFileSync(
      `${frontendPath}/src/App.jsx`,
      `import React from "react";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const App = () => {
  const showToast = () => {
    Toastify({
      text: "Welcome to Your MERN Project!",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "linear-gradient(to right, #4caf50, #81c784)",
      stopOnFocus: true,
    }).showToast();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Welcome to Your MERN Project!</h1>
      <button
        onClick={showToast}
        className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
      >
        Show Toast Notification
      </button>
    </div>
  );
};

export default App;
    `
    );

    fs.writeFileSync(
      `${frontendPath}/src/index.css`,
      `@tailwind base;
@tailwind components;
@tailwind utilities;
    `
    );

    fs.writeFileSync(
      `${frontendPath}/src/main.jsx`,
      `import React from 'react'; 
import { StrictMode } from 'react'; 
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
  `
    );

    // Create `index.html` file
    fs.writeFileSync(
      `${frontendPath}/index.html`,
      `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MERN App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`
    );

    // Create Tailwind configuration file
    fs.writeFileSync(
      `${frontendPath}/tailwind.config.js`,
      `module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {},
    },
    plugins: [],
};
    `
    );

    console.log("Frontend initialized successfully!");
  } catch (err) {
    console.error("Failed to initialize frontend:", err);
  }
};

const main = async () => {
  const projectName = await askForProjectName(); // Prompt for the project name
  const projectPath = path.join(process.cwd(), projectName);

  console.log(`Creating project: ${projectName}`);
  try {
    fs.mkdirSync(projectPath, { recursive: true });
  } catch (err) {
    console.error("Error creating project folder:", err);
    return;
  }

  createFolderStructure(projectPath);
  await initBackend(projectPath);
  initFrontend(projectPath);

  console.log("Project setup complete!");

  console.log(`
To start the project, follow these steps:

Frontend:
1. Navigate to the project folder:
   cd ${projectName}/frontend
2. Start the development server:
   npm run dev

Backend:
1. Navigate to the project folder:
   cd ${projectName}/backend
2. Start the backend server:
   node server.js
  `);
};

main();
