const { authJwt } = require("../middleware");
const controller = require("../controllers/food.diary.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/food/diary",
    [authJwt.verifyToken],
    controller.foodDiary
  );

  app.post(
    "/api/food",
    [authJwt.verifyToken],
    controller.foodSubmitted
  );

  app.delete(
    "/api/food/:foodId",
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
  

  app.post(
    "/api/food/diary",
    [authJwt.verifyToken],
    controller.addFoodsToDiary
  );

  app.delete(
    "/api/food/diary",
    [authJwt.verifyToken],
    controller.deleteFoodDiaryItem
  );

  app.put(
    "/api/food/diary",
    [authJwt.verifyToken],
    controller.updateFoodDiaryItem
  )


};
