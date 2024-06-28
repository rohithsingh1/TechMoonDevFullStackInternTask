const express = require("express");
const app = express();
const dbConfig = require("./config/dbConfig");
const usersRoute = require("./routes/usersRoute");

const cors = require("cors");

require("dotenv").config();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
dbConfig();

app.use("/api/users", usersRoute);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`node server listening at port no ${port}`);
});