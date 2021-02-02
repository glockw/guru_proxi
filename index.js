const express = require("express");

const cors = require("cors");
const app = express();
const apollo = require("./lib/apollo");
const { request, response } = require("express");
require("dotenv").config();

app.use(express.json());

app.use(cors());

app.get("/api/business", async (request, response) => {
  try {
    const { term, location, offset } = request.query;
    const { data } = await apollo.GetBusinesses(term, location, offset);
    response.json(data);
  } catch (error) {
    response.status(404).json({ error: error });
    return;
  }
});

app.get("/api/business/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const data = await apollo.GetBusinnes(id);
    response.json(data);
  } catch (error) {
    response.status(404).json({ error: error });
    return;
  }
});
const PORT = 5000;
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
