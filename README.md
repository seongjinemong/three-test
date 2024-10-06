# Exhaust Three.js Example

This project demonstrates a 3D car exhaust simulation using Three.js. It features a realistic exhaust smoke effect that responds to user input, creating an interactive and visually appealing experience.

## Features

- 3D car model rendering
- Dynamic exhaust smoke simulation
- Interactive revving mechanism
- Responsive design

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed on your local machine
- npm (Node Package Manager) installed

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/exhaust-three-example.git
   ```

2. Navigate to the project directory:
   ```
   cd exhaust-three-example
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Usage

1. Start the development server:
   ```
   npm run dev
   ```

2. Open your browser and visit `http://localhost:3000`

3. Click and hold the "REV" button to increase the exhaust effect

## Project Structure

- `app.js`: Express server setup
- `index.html`: Main HTML file
- `public/src/main.js`: Main Three.js scene setup and animation
- `public/src/Helpers/ModelHelper.js`: GLTF model loading utility
- `public/src/lib/revbar.js`: Rev bar update functionality
- `public/src/style.css`: Styles for the application

## Dependencies

- Express.js
- Three.js

## License

This project is licensed under the [MIT License](LICENSE).
