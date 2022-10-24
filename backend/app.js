const express = require("express");
var app = express();
const bodyparser = require("body-parser");
const helmet = require("helmet");
var cors = require("cors");
require("dotenv").config();

const commonRoutes = require("./routes/commonRoutes");
const PORT = process.env.PORT || 8081;
const { handleError } = require("./util/errorHandler");
const _db = require("./util/db");
const morgan = require("morgan");

app.use(morgan("combined"));
app.use(cors());

app.use(bodyparser.json({ limit: "10mb", extended: true }));

app.use(helmet());
app.use("/api", commonRoutes);

app.use((err, req, res, next) => {
  handleError(err, res);
});

_db.connect();
app.listen(PORT, () =>
  console.log("Express server is runnig at port no : ", PORT)
);
