import express from "express";
import cors from "cors";
import Database from "better-sqlite3";

const db = Database("./db/data.db", { verbose: console.log });
const app = express();
app.use(cors());
app.use(express.json());

const port = 3000;

const createInterview = db.prepare(`
INSERT INTO interviews (applicantId, interviewerId, date, score) VALUES (@applicantId, @interviewerId, @date, @score)`)
const createApplicant = db.prepare(`
INSERT INTO applicants (name, email) VALUES (@name, @email)`)
const getInterviewById = db.prepare(`
SELECT * FROM interviews WHERE id = @id `);
const createInterviewer = db.prepare(`
INSERT INTO interviewers (name, email) VALUES (@name, @email)`)

const getApplicantById = db.prepare(`
SELECT * FROM applicants WHERE id = @id `);

const getApplicants = db.prepare(`
SELECT * FROM applicants
`);
const getInterviewersForApplicants = db.prepare(`
 SELECT interviewers.* FROM interviewers
JOIN interviews ON interviewers.id = interviews.interviewerId
 WHERE interviews.applicantId = @id `);

const getInterviewForApplicants = db.prepare(`
 SELECT * FROM interviews WHERE applicantId = @id`);

const getInterviewerById = db.prepare(`
SELECT * FROM interviewers WHERE id = @id `);

const getApplicantsForInterviewers = db.prepare(`
 SELECT applicants.* FROM applicants
JOIN interviews ON applicants.id = interviews.applicantId
 WHERE interviews.interviewerId = @id `);

const getInterviewForInterviewers = db.prepare(`
SELECT * FROM interviews WHERE interviewerId = @id `);

const getInterviewers = db.prepare(`
SELECT * FROM interviewers`);

app.get("/applicants", (req, res) => {
  const specificApplicant = getApplicants.all(req.params);
  res.send(specificApplicant);
});

app.get("/applicants/:id", (req, res) => {
  const specificApplicant = getApplicantById.get(req.params);

  if (specificApplicant) {
    specificApplicant.interview = getInterviewForApplicants.all(req.params);
    specificApplicant.interviewer = getInterviewersForApplicants.all(
      req.params
    );
    res.send(specificApplicant);
  } else {
    res.status(404).send("applicant not found");
  }
});

app.get("/interviewers", (req, res) => {
  const specificInterviewer = getInterviewers.all(req.params);
  res.send(specificInterviewer);
});

app.get("/interviewers/:id", (req, res) => {
  const specificInterviewer = getInterviewerById.get(req.params);

  if (specificInterviewer) {
    specificInterviewer.interview = getInterviewForInterviewers.all(req.params);
    specificInterviewer.applicants = getApplicantsForInterviewers.all(
      req.params
    );
    res.send(specificInterviewer);
  } else {
    res.status(404).send("interviewer not found");
  }
});

app.post("/applicants", (req, res) => {
  let errors: string[] = [];

  if (typeof req.body.name !== "string") {
    errors.push("name is not found or is not a string");
  }
  if (typeof req.body.email !== "string") {
    errors.push("email is not found or is not a string");
  }
  if (errors.length === 0) {
   const newApplicant = createApplicant.run(req.body)
   const newApplicantData = getApplicantById.get({id : newApplicant.lastInsertRowid})
   res.send(newApplicantData)
  }
  else{
    res.status(404).send({errors : errors})
  }

});

app.post("/interviewers", (req, res) => {
  let errors: string[] = [];

  if (typeof req.body.name !== "string") {
    errors.push("name is not found or is not a string");
  }
  if (typeof req.body.email !== "string") {
    errors.push("email is not found or is not a string");
  }
  if (errors.length === 0) {
   const newInterviewer = createInterviewer.run(req.body)
   const newInterviewerData = getInterviewerById.get({id : newInterviewer.lastInsertRowid})
   res.send(newInterviewerData)
  }
  else{
    res.status(404).send({errors : errors})
  }

});

const getInterviews = db.prepare(`
SELECT * FROM interviews`)

app.get("/interviews", (req, res) => {
  const interviews = getInterviews.all(req.params);
  res.send(interviews);
});

app.post("/interviews", (req, res) => {
  let errors: string[] = [];

  if (typeof req.body.applicantId !== "number") {
    errors.push("applicantId is not found or is not a number");
  }
  if (typeof req.body.interviewerId !== "number") {
    errors.push("interviewerId is not found or is not a number");
  }
  if (typeof req.body.score !== "number") {
    errors.push("score is not found or is not a number");
  }
  if (typeof req.body.date !== "string") {
    errors.push("date is not found or is not a string");
  }
  if (errors.length === 0) {
   const newInterview = createInterview.run(req.body)
   const checkApplicant = getApplicantById.run(req.body.applicantId)
   const checkInterviewer = getInterviewerById.run(req.body.interviewerId)
   if (checkApplicant && checkInterviewer) {
    const newInterviewData = getInterviewById.get({id : newInterview.lastInsertRowid})
   res.send(newInterviewData)
   }
   else{
    errors.push("applicant or interviewer doesnt exist")
   }
  }
  else{
    res.status(404).send({errors : errors})
  }

});

app.listen(port, () => {
  console.log(`App running: http://localhost:${port}`);
});
