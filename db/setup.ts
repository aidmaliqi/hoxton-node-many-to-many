import Database from "better-sqlite3";

const db = Database("./db/data.db", { verbose: console.log });

const applicants = [
  {
    name: "shiznit",
    email: "shiznit625@omtecha.com",
  },
  {
    name: "anastasia",
    email: "anastasia130383@meleni.xyz",
  },
  {
    name: "jimkirk",
    email: "jimkirk50@cudimex.com",
  },
  {
    name: "isantillan",
    email: "isantillan@indozoom.net",
  },
  {
    name: "udayth",
    email: "udayth@indozoom.net",
  },
  {
    name: "igyan",
    email: "igyan@pickuplanet.com",
  },
  {
    name: "pitiriti",
    email: "pitiriti@espadahost.com",
  },
  {
    name: "shload",
    email: "shload@mitakian.com",
  },
  {
    name: "petar",
    email: "petar123@playfunplus.com",
  },
  {
    name: "ivanezovano",
    email: "ivanezovano@otpku.com",
  },
];

const interviewers = [
  {
    name: "de",
    email: "de52150@debb.me",
  },
  {
    name: "erbhan",
    email: "erbhan@camachohome.com",
  },
  {
    name: "elolvido",
    email: "elolvido@hansenhu.com",
  },
  {
    name: "arturo",
    email: "arturo8@bukanimers.com",
  },
  {
    name: "mhandwe",
    email: "mhandwe1@dropthespot.com",
  },
  {
    name: "scribb",
    email: "scribb1e@fickdate-lamou.de",
  },
  {
    name: "glenophobia",
    email: "glenophobia@santonicrotone.it",
  },
  {
    name: "nomyac",
    email: "nomyac@o0i.es",
  },
  {
    name: "cdcalvetty",
    email: "cdcalvetty@supercoolrecipe.com",
  },
  {
    name: "abyyu",
    email: "abyyu@soccerfit.com",
  },
];
const interviews = [
  {
    applicantId: 1,
    interviewerId: 3,
    date: "21/4/21",
    score: 53,
  },
  {
    applicantId: 10,
    interviewerId: 4,
    date: "7/3/21",
    score: 64,
  },
  {
    applicantId: 2,
    interviewerId: 8,
    date: "14/9/21",
    score: 90,
  },
  {
    applicantId: 5,
    interviewerId: 6,
    date: "1/3/20",
    score: 15,
  },
  {
    applicantId: 7,
    interviewerId: 9,
    date: "7/8/22",
    score: 99,
  },
  {
    applicantId: 10,
    interviewerId: 3,
    date: "30/1/21",
    score: 45,
  },
  {
    applicantId: 1,
    interviewerId: 9,
    date: "27/12/21",
    score: 92,
  },
  {
    applicantId: 4,
    interviewerId: 2,
    date: "1/1/21",
    score: 83,
  },
  {
    applicantId: 7,
    interviewerId: 8,
    date: "5/4/21",
    score: 54,
  },
  {
    applicantId: 9,
    interviewerId: 10,
    date: "6/3/21",
    score: 61,
  },
];

const dropTableInterview = db.prepare(`
DROP TABLE IF EXISTS interviews `);
dropTableInterview.run();
const dropTableApplicants = db.prepare("DROP TABLE IF EXISTS applicants");
dropTableApplicants.run();
const dropTableInterviews = db.prepare(`DROP TABLE IF EXISTS interviewers`);
dropTableInterviews.run();

const createTableApplicants = db.prepare(
  `CREATE TABLE IF NOT EXISTS applicants (
    id INTEGER NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    PRIMARY KEY (id))`
);
createTableApplicants.run();
const createApplicant = db.prepare(
  `INSERT INTO applicants (name, email) VALUES (@name, @email)`
);
for (const iterator of applicants) {
  createApplicant.run(iterator);
}

const createTableInterviewers =
  db.prepare(`CREATE TABLE IF NOT EXISTS interviewers (
  id INTEGER NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  PRIMARY KEY (id)
)`);
createTableInterviewers.run();
const createInterviewer = db.prepare(
  ` INSERT INTO interviewers (name, email) VALUES (@name, @email)`
);
for (const iterator of interviewers) {
  createInterviewer.run(iterator);
}

const createTableInterview = db.prepare(`
CREATE TABLE IF NOT EXISTS interviews (
    id INTEGER NOT NULL,
    applicantId INTEGER NOT NULL,
    interviewerId INTEGER NOT NULL,
    date TEXT NOT NULL,
    score INTEGER NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (applicantId) REFERENCES applicants(id) ON DELETE CASCADE,
    FOREIGN KEY (interviewerId) REFERENCES interviewers(id) ON DELETE CASCADE
)
`);
createTableInterview.run();

const createInterview = db.prepare(
  `INSERT INTO interviews (applicantId, interviewerId, date, score) VALUES (@applicantId , @interviewerId, @date, @score)`
);
for (const iterator of interviews) {
  createInterview.run(iterator);
}
