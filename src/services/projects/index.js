const express = require("express");
const fs = require("fs");
const path = require("path");
const uniqid = require("uniqid");
const { check, validationResult } = require("express-validator");
const { findByID, addPropertyNoProject } = require("./utils");

const router = express.Router();

const fileRead = (fileName) => {
  const buffer = fs.readFileSync(path.join(__dirname, fileName));
  const fileContent = buffer.toString();
  return JSON.parse(fileContent);
};

router.get("/", (req, res, next) => {
  try {
    const projectDb = fileRead("projects.json");
    if (req.query && req.query.name) {
      const filteredData = projectDb.filter(
        (project) =>
          project.hasOwnProperty("name") &&
          project.name.toLowerCase() === req.query.name.toLowerCase()
      );
      res.status(200).send(filteredData);
    } else {
      res.status(200).send(projectDb);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/:id", (req, res, next) => {
  try {
    const projectDb = fileRead("projects.json");

    const filteredData = projectDb.find(
      (project) => project.ID === req.params.id
    );

    if (!filteredData) {
      const err = new Error();
      err.message = "ID is incorrect";
      err.httpStatusCode = 404;
      next(err);
    } else {
      res.status(200).send(filteredData);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post(
  "/",
  [
    check("name")
      .exists()
      .withMessage("Name is required")
      .isLength({ min: 3 })
      .withMessage("Name must contain more than 3 characters"),
    check("studentID").exists().withMessage("Student ID is required"),
    check("description")
      .exists()
      .withMessage("Description is required")
      .isLength({ min: 8, max: 50 })
      .withMessage(
        "Description should be longer than 8 charcacters and shorter than 50 characters"
      ),
    check("repoURL")
      .exists()
      .withMessage("Repo Url of project is required")
      .isURL()
      .withMessage("This is not a correct URL"),
  ],
  (req, res, next) => {
    try {
      const errors = validationResult(req);
      //   if (!findByID(req.body.studentID))
      //     throw new Error("Student id is not valid");
      if (errors.isEmpty()) {
        addPropertyNoProject(req.body.studentID);
        const projectDb = fileRead("projects.json");
        const newProject = {
          ...req.body,
          ID: uniqid(),
          creationDate: new Date(),
        };

        projectDb.push(newProject);

        fs.writeFileSync(
          path.join(__dirname, "projects.json"),
          JSON.stringify(projectDb)
        );

        res.status(201).send({ ID: newProject.ID });
      } else {
        const err = new Error();
        err.message = errors;
        err.httpStatusCode = 400;
        next(err);
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

router.put(
  "/:id",
  [
    check("name")
      .exists()
      .withMessage("Name is required")
      .isLength({ min: 3 })
      .withMessage("Name must contain more than 3 characters"),
    check("studentID").exists().withMessage("Student ID is required"),
    check("description")
      .exists()
      .withMessage("Description is required")
      .isLength({ min: 8, max: 50 })
      .withMessage(
        "Description should be longer than 8 charcacters and shorter than 50 characters"
      ),
    check("repoURL")
      .exists()
      .withMessage("Repo Url of project is required")
      .isURL()
      .withMessage("This is not a correct URL"),
  ],
  (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        const modifiedPoject = req.body;
        const projectDb = fileRead("projects.json");
        const modifiedDb = projectDb.filter(
          (project) => project.ID !== req.params.id
        );
        const findID = projectDb.find(
          (project) => project.ID === req.params.id
        );

        if (!findID) {
          const err = new Error();
          err.message = "ID is incorrect";
          err.httpStatusCode = 404;
          next(err);
        } else {
          modifiedPoject.ID = req.params.id;
          modifiedDb.push(modifiedPoject);

          fs.writeFileSync(
            path.join(__dirname, "projects.json"),
            JSON.stringify(modifiedDb)
          );

          res.status(200).send(modifiedDb);
        }
      } else {
        const err = new Error();
        err.message = errors;
        err.httpStatusCode = 400;
        next(err);
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

router.delete("/:id", (req, res, next) => {
  try {
    const projectDb = fileRead("projects.json");
    const modifiedDb = projectDb.filter(
      (project) => project.ID !== req.params.id
    );

    const findID = projectDb.find((project) => project.ID === req.params.id);
    if (!findID) {
      const err = new Error();
      err.message = "ID is incorrect";
      err.httpStatusCode = 404;
      next(err);
    } else {
      fs.writeFileSync(
        path.join(__dirname, "projects.json"),
        JSON.stringify(modifiedDb)
      );

      res.status(204).send();
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
