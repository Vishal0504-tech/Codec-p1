# Implementation Plan - Phase 1: Project Setup and Folder Structure

This document outlines the design, initialization commands, packages, configuration files, and code structure required to bootstrap our full-stack E-Commerce platform.

---

## 1. Directory & Folder Structure

We will create a clean separation between our backend service (API) and our frontend application (UI) in the workspace directory `e:/Vishal Folder/codex intern/Ecommerce website`.

```text
e:/Vishal Folder/codex intern/Ecommerce website/
├── backend/                       # Server-side API application (Node/Express)
│   ├── config/                    # Configuration files
│   │   └── db.js                  # Database connection configuration
│   ├── controllers/               # Business logic for requests (receives requests, returns responses)
│   │   ├── authController.js      # User registration, login, and profile operations
│   │   ├── productController.js   # Fetching, creating, updating, and deleting products
│   │   ├── orderController.js     # Creating orders, tracking status, and user order history
│   │   └── paymentController.js   # Stripe payment intents and checkout handling
│   ├── middleware/                # Code that runs between receiving a request and sending a response
│   │   ├── authMiddleware.js      # Protects routes by verifying JWT tokens (authenticating users)
│   │   └── errorMiddleware.js     # Intercepts errors and returns clean, uniform JSON error messages
│   ├── models/                    # MongoDB schemas (defines what data looks like in the database)
│   │   ├── User.js                # Schema structure for users (name, email, password, role)
│   │   ├── Product.js             # Schema structure for products (name, price, image, category, stock)
│   │   └── Order.js               # Schema structure for orders (user, items, price, payment details)
│   ├── routes/                    # API endpoints (maps URLs to controller functions)
│   │   ├── authRoutes.js          # Routes for sign-up, sign-in, and profiling (/api/auth/*)
│   │   ├── productRoutes.js       # Routes for querying and managing products (/api/products/*)
│   │   ├── orderRoutes.js         # Routes for completing and viewing orders (/api/orders/*)
│   │   └── paymentRoutes.js       # Routes for triggering Stripe transactions (/api/payment/*)
│   ├── utils/                     # Utility and helper functions
│   │   └── generateToken.js       # Generates a JSON Web Token (JWT) containing user ID
│   ├── .env                       # Environment variables (secret credentials, port settings)
│   ├── .gitignore                 # Files and folders to ignore in version control (like .env, node_modules)
│   ├── package.json               # Backend dependencies, metadata, and scripts
│   └── server.js                  # The main entry file that starts our server and connects to database
│
└── frontend/                      # Client-side user interface application (React/Vite)
    ├── public/                    # Static assets like images and logos served directly
    ├── src/                       # Main React source folder
    │   ├── assets/                # Visual media assets (images, icons, vectors)
    │   ├── components/            # Reusable UI building blocks
    │   │   ├── Navbar.jsx         # Global top navigation bar with cart count and user status
    │   │   ├── Footer.jsx         # Global bottom section with site details and links
    │   │   ├── ProductCard.jsx    # Displays individual product photo, title, price, and "Add to Cart" button
    │   │   ├── ProtectedRoute.jsx # Wrapper component protecting private routes from guest access
    │   │   └── CartItem.jsx       # Custom layout for items in the shopping cart list
    │   ├── context/               # Global state managers using React Context API
    │   │   ├── AuthContext.jsx    # Manages user authentication state (logged in user details, tokens)
    │   │   └── CartContext.jsx    # Manages shopping cart state (adding/removing items, counts, totals)
    │   ├── hooks/                 # Custom React Hooks to simplify fetching state
    │   │   ├── useAuth.js         # Shorthand custom hook to access AuthContext
    │   │   └── useCart.js         # Shorthand custom hook to access CartContext
    │   ├── pages/                 # Full view layouts (pages) rendered by routing
    │   │   ├── Home.jsx           # Main homepage showing promotional banners and product grid
    │   │   ├── ProductDetail.jsx  # Detailed page for a product with full details, reviews, and options
    │   │   ├── Cart.jsx           # Summary page of selected items showing subtotals and check out button
    │   │   ├── Login.jsx          # Login form page
    │   │   ├── Register.jsx       # Registration form page
    │   │   ├── Checkout.jsx       # Secure payment form page powered by Stripe
    │   │   ├── OrderSuccess.jsx   # Feedback page showing success state after order completion
    │   │   └── Profile.jsx        # Account details page showing past order histories
    │   ├── services/              # API communications client
    │   │   └── api.js             # Configurations for Axios helper client pointing to our API URL
    │   ├── App.jsx                # Core App file containing routing definitions (React Router)
    │   ├── index.css              # Global styles file containing Tailwind CSS directives
    │   └── main.jsx               # Entry file mounting the React App into the index.html template
    ├── .env                       # Frontend environment configurations (e.g. backend API base URL)
    ├── .gitignore                 # Files/folders to ignore in Git (node_modules, builds)
    ├── index.html                 # Base HTML file where the React application renders
    ├── postcss.config.js          # Preprocessor configuration for processing Tailwind CSS
    ├── tailwind.config.js         # Tailwind utility styling theme configurations
    └── vite.config.js             # Configuration settings for our Vite build tool
```

---

## 2. Terminal Commands to Initialize Projects

Execute these commands in the terminal to initialize both directories:

### A. Initialize the Backend
Run these commands from the project root (`e:/Vishal Folder/codex intern/Ecommerce website`):
```powershell
# Create the backend folder and enter it
mkdir backend
cd backend

# Initialize a package.json file with default settings
npm init -y
```

### B. Initialize the Frontend (using Vite)
Run these commands from the project root (`e:/Vishal Folder/codex intern/Ecommerce website`):
```powershell
# Initialize a React project using Vite template inside a new 'frontend' directory
npx -y create-vite@latest frontend -- --template react

# Enter the frontend folder and prepare to install dependencies
cd frontend
```

---

## 3. NPM Packages & Explanations

### Backend Packages
These packages must be installed in the `backend/` directory:
```powershell
npm install express mongoose dotenv cors jsonwebtoken bcryptjs stripe
npm install --save-dev nodemon
```
*   **`express`**: A minimal, flexible web application framework for Node.js. It simplifies setting up server routes, processing HTTP requests, and returning JSON.
*   **`mongoose`**: An Object Data Modeling (ODM) library for MongoDB and Node.js. It translates database documents into JavaScript objects and enforces schema structures.
*   **`dotenv`**: A zero-dependency module that loads variables from a `.env` file into `process.env`. This keeps credentials secure and separate from code.
*   **`cors`**: Stands for Cross-Origin Resource Sharing. This middleware permits our React frontend (running on a different port like 5173) to securely request data from our Express backend (running on port 5000).
*   **`jsonwebtoken` (JWT)**: An implementation of JSON Web Tokens. Used to sign and verify secure, stateless tokens to authorize user requests.
*   **`bcryptjs`**: A library to hash passwords using secure mathematical algorithms. It ensures we store passwords securely in our database instead of in plain-text.
*   **`stripe`**: The official Node.js library for Stripe. It enables us to interact with the Stripe API to create secure payment intents and process cards.
*   **`nodemon` (Dev Dependency)**: A utility tool that monitors backend files and automatically restarts the server when code modifications are saved.

### Frontend Packages
These packages must be installed in the `frontend/` directory:
```powershell
npm install react-router-dom axios @stripe/stripe-js @stripe/react-stripe-js lucide-react
npm install -D tailwindcss postcss autoprefixer
```
*   **`react-router-dom`**: The routing engine for React web apps. Enables moving between different views (like Home, Cart, Checkout) without refreshing the browser window.
*   **`axios`**: A promise-based HTTP client for making API requests. Used to securely fetch data from our Node/Express backend.
*   **`@stripe/stripe-js` & `@stripe/react-stripe-js`**: Official Stripe client integrations. It securely renders custom payment inputs (Stripe Elements) directly inside React.
*   **`lucide-react`**: A library containing beautiful, clean icons (cart, user, search, chevron, checkmark) to style our design modernly.
*   **`tailwindcss`, `postcss`, `autoprefixer`**: PostCSS and layout processors required to set up Tailwind utility styling.

---

## 4. Initial package.json Scripts

### Backend (`backend/package.json`)
Replace the default `"scripts"` block in backend's package.json with:
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```
*   **`start`**: Used in production deployment environments to start the server directly using standard Node.js.
*   **`dev`**: Starts the server in development mode using `nodemon` to watch and auto-reload on file edits.

### Frontend (`frontend/package.json`)
The Vite template provides these scripts default:
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
  "preview": "vite preview"
}
```
*   **`dev`**: Starts the local Vite development server (fast reload server).
*   **`build`**: Packs the entire React application into static files (HTML, CSS, JS) optimized for production hosting.
*   **`preview`**: Launches a preview server of the built production bundle locally to test before deploying.

---

## 5. Setting up the Environment Variables (`backend/.env`)

We will create a `.env` file inside the `backend/` root directory to hold our environment variables:

```env
# Server Port Configuration
PORT=5000

# MongoDB Database Connection URL
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/ecommerce?retryWrites=true&w=majority

# JWT Token Secret Key (Used for cryptographic signatures)
JWT_SECRET=super_secret_jwt_key_should_be_long_and_random

# Stripe API Keys (Secret Key goes on backend, Publishable goes on frontend)
STRIPE_SECRET_KEY=sk_test_51Px...PlaceholderStripeSecretKey

# Node Environment state
NODE_ENV=development
```

---

## 6. How to Connect to MongoDB Atlas (Step-by-Step)

MongoDB Atlas is a cloud-hosted MongoDB service. Here is how to create a cluster and configure the connection:

1.  **Create an Account**: Go to [MongoDB Atlas Website](https://www.mongodb.com/cloud/atlas) and register.
2.  **Create a New Deployment**:
    *   Click **"Create"** or **"New Cluster"**.
    *   Choose the **"M10 / Shared (Free Tier)"** cluster.
    *   Choose a Cloud Provider (e.g., AWS) and Region closest to you.
    *   Keep the default Cluster name or customize it, then click **"Create"**.
3.  **Configure Database Access Security**:
    *   Navigate to **Security > Database Access**.
    *   Click **"Add New Database User"**.
    *   Select **Password authentication**.
    *   Create a username (e.g., `admin`) and a secure password. Make a note of this password!
    *   Give them the role of **"Read and write to any database"**. Click **"Add User"**.
4.  **Configure Network Access Security**:
    *   Navigate to **Security > Network Access**.
    *   Click **"Add IP Address"**.
    *   Click **"Allow Access from Anywhere"** (adds IP `0.0.0.0/0`), or enter your current IP. Allowing access from anywhere is recommended for development and deployment.
    *   Click **"Confirm"**.
5.  **Retrieve Connection String**:
    *   Navigate to the **Database / Clusters** tab.
    *   Click the **"Connect"** button on your active Cluster.
    *   Select **"Drivers"** under connection methods.
    *   Copy the connection string. It will look like this:
        `mongodb+srv://admin:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
6.  **Update the Environment Variable**:
    *   Paste this string into the `MONGODB_URI` inside `backend/.env`.
    *   Replace `<password>` with your created database user's password. Make sure not to include the angle brackets `< >`.
    *   Before `?retryWrites=true`, add the database name you want to create (e.g. `ecommerce`), like `cluster0.abcde.mongodb.net/ecommerce?retryWrites...`

---

## 7. Connecting Mongoose & Setting up Express Server (`backend/server.js`)

We will create a helper connection file in [db.js](file:///e:/Vishal Folder/codex intern/Ecommerce website/backend/config/db.js) and the main entry file in [server.js](file:///e:/Vishal Folder/codex intern/Ecommerce website/backend/server.js).

### Complete Code & Line-by-Line Explanations

#### `backend/config/db.js`
```javascript
// We import mongoose, which is our library to speak with the MongoDB database.
import mongoose from 'mongoose';

// We define an asynchronous function to handle database connection. 
// "async" means this function performs operations that might take time (promises) and won't block the rest of the application execution.
const connectDB = async () => {
  try {
    // "await" pauses function execution until mongoose finishes connecting to the MONGODB_URI stored in process.env.
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    // Once successful, we print a green-colored message in our console showing the connection host name.
    console.log(`MongoDB Connected successfully to host: ${conn.connection.host}`);
  } catch (error) {
    // If anything fails during connection (e.g. invalid password, network down), the "catch" block triggers.
    // We print the exact error message to our console.
    console.error(`Database Connection Error: ${error.message}`);
    
    // We terminate the Node process with status code 1. "1" means the process exited due to an unrecoverable failure.
    process.exit(1);
  }
};

// We export the function so it can be imported and executed inside our main server.js.
export default connectDB;
```

#### `backend/server.js`
```javascript
// Import Express, our routing and HTTP framework.
import express from 'express';
// Import Dotenv, which will read our secret variables from the .env file.
import dotenv from 'dotenv';
// Import CORS, which allows web pages from other domains (like localhost:5173 React) to query our server.
import cors from 'cors';
// Import our database connection helper function we wrote above.
import connectDB from './config/db.js';

// Execute config() on dotenv. This reads our .env file and attaches its values to "process.env" so our code can read them.
dotenv.config();

// Create an instance of the Express application. "app" now represents our web server.
const app = express();

// Establish the database connection.
connectDB();

// Apply CORS middleware to the server. This permits client applications to access API endpoints securely.
app.use(cors());

// Apply JSON body parser middleware. This allows our server to automatically read and parse JSON payloads sent in the body of incoming requests.
app.use(express.json());

// Define a simple test route. When a user sends a GET request to the root URL "/" (e.g., http://localhost:5000/), we trigger this function.
app.get('/', (req, res) => {
  // We send a JSON response containing an API status message.
  res.json({ message: 'API is running successfully...' });
});

// Read the port number from environment variables. If it is not defined in the .env file, fallback to default port 5000.
const PORT = process.env.PORT || 5000;

// Start listening on the port. Once the server begins listening, it executes the callback function.
app.listen(PORT, () => {
  // We output a startup message to our terminal, informing us of the port and running mode.
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
```

---

## 8. Verification: What You Should See Running

Once Phase 1 is executed, here is what will run:

### Backend Terminal Verification
1.  Running `npm run dev` in the `backend/` folder will output:
    ```text
    [nodemon] starting `node server.js`
    Server running in development mode on port 5000
    MongoDB Connected successfully to host: cluster0.abcde.mongodb.net
    ```
2.  Opening a web browser or API tool (like Postman or ThunderClient) and navigating to `http://localhost:5000/` will return:
    ```json
    { "message": "API is running successfully..." }
    ```

### Frontend Browser Verification
1.  Running `npm run dev` in the `frontend/` folder will boot the Vite dev server on port `5173` (or similar).
2.  Navigating to `http://localhost:5173/` in a web browser will display the default Vite + React welcome interface, indicating the frontend is successfully initialized.

---

## 9. Verification & Automated Tests Plan

### Automated Tests
Currently, this is a bootstrap setup. We will run code validation tests using:
- `node --check server.js` inside the backend directory to check syntax.
- Standard imports verification.

### Manual Verification
- We will boot the server using `nodemon` (backend) and `vite` (frontend) and check logs.
- We will test the local API using `curl` or a browser visit.
