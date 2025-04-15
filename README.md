# How to use this repo?
- This repository supports a Dockerised environment. Get Docker set-up or skip to using npm for downloading dependencies.

# How to get started once Docker is set-up and you have cloned this?

1. Building a Docker Image:
  - If you're in the root directory:
  > docker build -t receipt-processor ./backend
  - If you're inside ./backend:
  > docker build -t receipt-processor .

2. Running the Docker Image:
  > docker run -p 8080:8080 receipt-processor

If everything goes well, this should output "Server is running on Port 8080." on the console

# I don't like Docker. Get me started with npm instead!
1. This reads my package.json file and installs all the dependencies listed there into a gargantuan node_modules folder
  > npm install

2. This will start the Node.js application by executing my index.js file
  > npm start 

# Features:
1. 2 required endpoints processing:
  1.1 /receipts/process
  1.2 /receipts/:id/points
2. Calculating the points accumulated by a valid receipt in calcPoints function
3. Generating unique uuid for each receipt

# Improvements/Sanity Checks:
1. Providing JSON responses with status codes: 200, 400, 400
2. Input validation, taking advantage of regex patterns found in api.yml
3. Console logging for total and partial calculation of points, both outside and inside respective function calls
4. Demarkation between different receipts in console logs

# What did I use to develop this with?
1. IDE: VS Code
2. Tech Stack: JavaScript, Node.js (back-end), Express.js(middleware, Node.js framework), UUID, Docker, Command-line Version Control with Git
3. RESTful API with in-memory backend development




