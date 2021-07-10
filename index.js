const express = require("express");
const router = require("./router");

const PORT = 8081;

const app = express();

app.use(express.json());
app.use("/api", router);

app.listen(PORT, () => console.log("Authentication server running on " + PORT));