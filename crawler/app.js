const express = require("express");
const app = express();
const port = 3001;
const cors = require("cors");
const { getBestComments, getAllWebtoon, getWebtoon } = require("./crawler");

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.json({ test: "sample" });
});

app.get("/allwebtoon", async (req, res) => {
  const data = await getAllWebtoon();
  res.json(data);
});

app.get("/webtoon/:titleId", async (req, res) => {
  const data = await getWebtoon(req.params.titleId);
  res.json(data);
});

app.get("/bestcomments/:titleId/:chapter", async (req, res) => {
  const data = await getBestComments(req.params.titleId, req.params.chapter);
  res.json(data);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
