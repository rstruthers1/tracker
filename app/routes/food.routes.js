const { authJwt } = require("../middleware");
const controller = require("../controllers/food.controller");

module.exports = function(app) {
  app.post(
    "/api/food",
    [authJwt.verifyToken],
    controller.createFood
  );

  app.patch(
    "/api/food",
    [authJwt.verifyToken],
    controller.updateFood
  );

  app.delete(
    "/api/food/:id",
    [authJwt.verifyToken],
    controller.deleteFood
  );


  app.get("/api/food",
    [authJwt.verifyToken],
    controller.getAllFoods
  );

  app.get("/api/food/filter/:filterValue",
    [authJwt.verifyToken],
    controller.getFoodsFiltered
  );
};
