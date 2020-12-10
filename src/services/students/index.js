const express = require("express");
const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");
const uniqid = require("uniqid");
const { studentProjects } = require("../projects/utils");

const router = express.Router();

router.get("/", (req, res) => {
  const buffer = fs.readFileSync(path.join(__dirname, "students.json"));
  const fileContent = buffer.toString();

  res.send(JSON.parse(fileContent));
});

router.get("/:id", (req, res) => {
  const buffer = fs.readFileSync(path.join(__dirname, "students.json"));
  const studentsArray = JSON.parse(buffer.toString());

  const student = studentsArray.find((student) => student.ID === req.params.id);

  if (!student) {
    res.status(400).send("ID does not exist");
  } else {
    res.status(200).send(student);
  }
});

router.post("/", (req, res) => {
  const newStudent = req.body;
  const buffer = fs.readFileSync(path.join(__dirname, "students.json"));
  const studentDB = JSON.parse(buffer.toString());
  newStudent.ID = uniqid();
  console.log(studentDB);

  let errors = false;

  for (let i = 0; i < studentDB.length; i++) {
    if (newStudent.email === studentDB[i].email) {
      errors = true;
    }
  }

  if (errors === true) {
    res.send("This email already exist in our database");
  } else {
    studentDB.push(newStudent);
    fs.writeFileSync(
      path.join(__dirname, "students.json"),
      JSON.stringify(studentDB)
    );

    res.status(201).send({ ID: newStudent.ID });
  }
});

router.put("/:id", (req, res) => {
  const modifiedStudent = req.body;
  const buffer = fs.readFileSync(path.join(__dirname, "students.json"));
  const studentDB = JSON.parse(buffer.toString());
  const newStudentDB = studentDB.filter(
    (student) => student.ID !== req.params.id
  );
  modifiedStudent.ID = req.params.id;
  newStudentDB.push(modifiedStudent);

  let errorHandle = studentDB.find((student) => student.ID === req.params.id);

  fs.writeFileSync(
    path.join(__dirname, "students.json"),
    JSON.stringify(newStudentDB)
  );
  if (!errorHandle) {
    res.status(400).send("ID does not exist");
  } else {
    res.status(201).send(newStudentDB);
  }
});

router.delete("/:id", (req, res) => {
  const buffer = fs.readFileSync(path.join(__dirname, "students.json"));
  const studentDB = JSON.parse(buffer.toString());
  const newStudentDB = studentDB.filter(
    (student) => student.ID !== req.params.id
  );

  let errorHandle = studentDB.find((student) => student.ID === req.params.id);

  if (!errorHandle) {
    res.status(400).send("ID does not exist");
  } else {
    fs.writeFileSync(
      path.join(__dirname, "students.json"),
      JSON.stringify(newStudentDB)
    );
    res.status(204).send();
  }
});

// students Projects

router.get("/:id/projects", (req, res) => {
  const projects = studentProjects(req.params.id);
  if (!projects) {
    res.status(400).send("ID does not exist");
  } else {
    res.status(200).send(projects);
  }
});

module.exports = router;
