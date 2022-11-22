import express, { Express, NextFunction, Response, Router } from "express";
import controllers from "../controllers";
import validations from "./validations";
import required from "./required";
import { Request } from "express-jwt";

export default (e: Router) => {
  const r = express.Router();
  e.use("/orders", required.login, r);

  r.post("/", ...validations.order.create, controllers.order.create);

  r.get("/", ...validations.order.search, controllers.order.find.pageByUser);

  r.get("/data-center");

  r.get("/:id", ...validations.order.getDetail, controllers.order.find.byId);

  r.patch(
    "/:id",
    ...validations.order.updateStatus,
    controllers.order.update.status
  );

  r.delete("/:id", ...validations.order.delete, controllers.order.del);
};
