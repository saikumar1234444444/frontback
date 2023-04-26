const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const databasePath = path.join(__dirname, "userData.db");

const app = express();

app.use(express.json());

// app.get("/api", (req, res) => {
//   res.json({ users: ["sai", "ram"] });
// });

// app.listen(5000, () => console.log("Server Running at http://localhost:5000"));

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });

    app.listen(5000, () =>
      console.log("Server Running at http://localhost:5000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

app.post("/submit/", async (request, response) => {
  const { id, name, company } = request.body;
  console.log("company type: ", typeof company);
  const postTodoQuery = `
  INSERT INTO
    todo (id,name,company)
  VALUES
    (${id},'${name}','${company}');`;

  await database.run(postTodoQuery);
  response.json({ status: "user Added Successfully" });
});

app.get("/users/:id", async (request, response) => {
  const { id } = request.params;
  const getName = `
        SELECT 
        * 
        FROM 
        todo
        WHERE id=${id};`;
  const result = await database.get(getName);
  response.send(result);
});

module.exports = app;
