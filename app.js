const express = require("express");
const app = express();
const cors = require("cors");
const dontenv = require("dotenv").config();
const port = process.env.PORT || 6000;
const upload = require("./middlewares/fileUpload");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("API Gateway is ready!");
});

app.use(
  "/api-gateway",
  upload.fields([
    { name: "thumbnailImage", maxCount: 1 },
    { name: "moreImages", maxCount: 10 },
  ]),
  require("./routes")
);

app.listen(port, () => {
  console.log(`Api Gateway ready on port ${port}`);
});
