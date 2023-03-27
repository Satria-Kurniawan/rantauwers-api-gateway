const express = require("express");
const router = express.Router();
const axios = require("axios");
const registry = require("../registry.json");

router.all("/:apiName/:path*", async (req, res) => {
  axios.defaults.headers.common["Authorization"] = req.headers.authorization;

  req.body.thumbnailImage = req.files?.thumbnailImage
    ? req.files.thumbnailImage[0].filename
    : null;

  const moreImages = [];
  req.files?.moreImages?.map((image) => moreImages.push(image.filename));
  req.body.moreImages = moreImages;

  if (registry.services[req.params.apiName]) {
    try {
      const response = await axios({
        method: req.method,
        url: `${registry.services[req.params.apiName].url}/${req.params.path}/${
          req.params[0]
        }`,
        data: req.body,
      });
      res.json(response.data);
    } catch (error) {
      if (!error.response) return res.json({ message: error });

      res.status(error.response.status).json({
        message: error.response.data.message,
        statusText: error.response.statusText,
      });
    }
  } else {
    res.json("API name doesn't exist");
  }
});

module.exports = router;
