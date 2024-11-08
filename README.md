
Blog Application
This project consists of a frontend (built with Next.js) and a backend (Node.js with TypeScript) to create a complete blog application.

Table of Contents
Frontend Setup (Next.js)
Backend Setup (Node.js)
Environment Variables
Running the Application
Frontend Setup (Next.js)
The frontend code is located in the blog-app directory. Follow these steps to set it up:

Install Dependencies

Navigate to the blog-app directory:


cd blog-app

npm install

Create Environment File

Inside the blog-app directory, create an .env file with the following configuration:


# Database Configuration
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_PORT=

# Server Configuration
PORT=3000
Start the Frontend

Run the following command to start the frontend development server:

npm run dev
The frontend should now be running at http://localhost:3000.

Backend Setup (Node.js)
The backend code is located in the root directory of the backend folder. Follow these steps to set it up:

Install Dependencies

Navigate to the backend directory and install dependencies:


cd backend
npm install
Run the Backend Server

Start the backend server with the following command:

npx ts-node index.ts
This command will run the backend using TypeScript, and it should be accessible as per the configuration in the .env file.

Environment Variables
Both frontend and backend use environment variables stored in .env files. Ensure that the variables are correctly filled out before running the application. Here’s an example configuration:

Example .env file:

# Database Configuration
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
DB_PORT=your_database_port

# Server Configuration
PORT=3000
Note: Replace your_database_host, your_database_user, etc., with the actual values for your database setup.

Running the Application
Once you've completed the setup steps for both frontend and backend:

Start the Backend: Make sure the backend is running by executing npx ts-node index.ts in the backend directory.
Start the Frontend: Run npm run dev in the blog-app directory.
Your application should now be accessible, with the frontend at http://localhost:3000.

