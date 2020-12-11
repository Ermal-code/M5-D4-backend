const express = require("express");

const cors = require("cors");
const { join } = require("path");
const students = require("./services/students");
const projects = require("./services/projects");
const {
  forbiddenErrorHandler,
  notFoundErrorHandler,
  badRequestErrorHandler,
  unauthorizedErrorHandler,
  catchAllErrorHandler,
} = require("./errorHandling");

const server = express();

const publicFolderPath = join(__dirname, "../public");

server.use(cors());
server.use(express.json());
server.use(express.static(publicFolderPath));

server.use("/students", students);
server.use("/projects", projects);

server.use(badRequestErrorHandler);
server.use(notFoundErrorHandler);
server.use(forbiddenErrorHandler);
server.use(unauthorizedErrorHandler);
server.use(catchAllErrorHandler);

server.listen(process.env.PORT, () =>
  console.log("Server running on port 3003")
);
