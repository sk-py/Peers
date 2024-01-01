const express = require("express");
const { createRequest, displayRequest } = require("../Controllers/Requests");
const router = express.Router();

router.post("/add", createRequest);

router.get("/display/:id", displayRequest);
module.exports = router;
