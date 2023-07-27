const router = require("express").Router();

router.get("/", function (req, res) {
 res.send("Index page");
});

module.exports = router;
