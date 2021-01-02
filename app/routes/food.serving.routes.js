const { authJwt } = require("../middleware");
const controller = require("../controllers/food.serving.controller");

module.exports = function(app) {
  app.post(
    "/api/food/serving",
    [authJwt.verifyToken],
    controller.createFoodServing
  );


};
