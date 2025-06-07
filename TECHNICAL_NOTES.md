# Technical Developer Notes

## Project Overview
This project is a web application built with Next.js, designed to provide a modern, scalable, and maintainable platform. It features a modular structure, reusable components, and integrates with a MongoDB database. The application is hosted on Vercel for seamless deployment and scalability.

## Tech Stack
- **Framework:** Next.js (React)
- **Language:** JavaScript/TypeScript
- **Styling:** Tailwind CSS
- **Database:** MongoDB
- **Hosting:** Vercel

## Project Structure
```
root/
├── src/
│   ├── app/           # Main application logic, pages, and routes
│   │   ├── components/    # Reusable UI components
│   │   ├── api/           # API route handlers
│   │   └── ...            # Other feature directories (walkthrough, details, etc.)
│   ├── models/        # Mongoose models for MongoDB
│   └── lib/           # Utility libraries (e.g., auth, database connection)
├── public/            # Static assets
├── package.json       # Project dependencies and scripts
├── tailwind.config.ts # Tailwind CSS configuration
├── next.config.ts     # Next.js configuration
└── ...                # Other config and environment files
```

## Setup Instructions
1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
2. **Environment variables:**
   - Create a `.env.local` file in the root directory.
   - Add your MongoDB connection string and any other required environment variables:
     ```env
     MONGODB_URI=your_mongodb_connection_string
     NEXTAUTH_SECRET=your_secret
     # Add other variables as needed
     ```
3. **Run the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000).

## Key Components & Files
- `src/app/components/`: Contains reusable UI components (e.g., `MapComp.jsx`, `SurveyBox.js`, `Select.jsx`).
- `src/models/`: Mongoose models for MongoDB collections (e.g., `user.js`, `surveyResponse.js`).
- `src/lib/`: Utility libraries for authentication (`auth.config.js`) and MongoDB connection (`mongodb.js`).
- `src/app/api/`: API route handlers for server-side logic.
- `src/app/page.jsx`: Main landing page.
- `src/app/layout.jsx`: Application layout and global styles.

## Development Notes
- **Component Structure:** Components are modular and reusable. Use the `components/` directory for shared UI elements.
- **Database:** Uses MongoDB, with models defined in `src/models/`. Database connection logic is in `src/lib/mongodb.js`.
- **API Routes:** Place server-side logic in `src/app/api/` following Next.js API route conventions.
- **Styling:** Tailwind CSS is used for utility-first styling. Global styles are in `src/app/globals.css`.
- **Authentication:** If used, authentication logic is in `src/lib/auth.config.js`.
- **TypeScript:** The project supports TypeScript. Add `.ts` or `.tsx` files as needed.

## Deployment
- **Hosting:** The application is deployed on Vercel. Push to the main branch to trigger deployment.
- **Environment Variables:** Set required environment variables (e.g., `MONGODB_URI`) in the Vercel dashboard.
- **Build Command:**
  ```bash
  npm run build
  ```
- **Start Command:**
  ```bash
  npm start
  ```

---
Developer Email: uditj668@gmail.com 