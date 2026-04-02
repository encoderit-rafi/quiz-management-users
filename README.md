# Installation Guide

Follow these steps to set up the **quiz-management-users** project locally.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js**: Version 18.0 or higher (Check with `node -v`)
- **npm**: (Check with `npm -v`)

## Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd quiz-management-users
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

## Environment Setup

1.  **Create a `.env` file** in the root directory.
2.  **Configure the following variables:**
    ```env
    VITE_BASE_URL='<your_api_base_url>'
    ```

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in development mode at [http://localhost:3000](http://localhost:3000).

### `npm run build`

Builds the app for production to the `.output` folder.
