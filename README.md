# Dreams Furniture - Digital Showroom

An elegant digital showroom for Dreams Furniture, showcasing our premium collection of beds, dining sets, office furniture, sofas, and wardrobes.

## Project info

This project is built using:
- **Vite**
- **TypeScript**
- **React**
- **shadcn-ui**
- **Tailwind CSS**

## Development Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (Latest LTS version recommended)

### Getting Started

1.  **Clone the repository:**
    ```sh
    git clone <repository-url>
    cd dreams-digital-showroom
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Start the development server:**
    ```sh
    npm run dev
    ```

### Environment

Create a `.env` file from `.env.example` and set:

```sh
VITE_STRAPI_URL=https://dreams-cms.onrender.com
VITE_STRAPI_TOKEN=
```

For Vercel production, configure `VITE_STRAPI_URL` in the Vercel dashboard to point at the Render Strapi backend.

## Project Structure

- `src/assets/`: Static assets like images and logos.
- `src/components/`: Reusable React components.
- `src/pages/`: Main application pages.
- `src/data/`: Product data and other static content.
- `src/lib/`: Utility functions and library configurations.

## License

All rights reserved. Dreams Furniture.
