# 🚗💨 3D Exhaust Control

평소에 차를 좋아하는 만든이의 의식의 흐름에 따라 그저 차의 배기를 웹에서 3D로 만들어보고 싶다는 생각에서 시작되어 가속 페달을 밟듯 버튼을 지긋이 누르면, 내연기관의 RPM이 올라가듯 Progressbar가 차오르고, 배기구에서 연기가 모락모락 나게 됩니다. 가격대가 높은 차들의 가속페달을 마음대로 밟을 수 없는 것에 대한 한이 깃들어있는 프로젝트입니다.

It starts with the idea of just trying to make the exhaust of the car 3D on the web according to the flow of consciousness of the creator who likes cars, and if you press the button as if you are press on the gas, the Progressbar rises like the RPM of the combustion engine goes up, and smoke comes out of the exhaust pipes. It is a project about the inability to step on the gas of expensive cars at will.

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
