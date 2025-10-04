import { Router } from "express";
import { getMenuList, createMenu } from "../controller/menu.controller.js";

const router = Router();

router.route('/menus').get(getMenuList);
router.route('/create-menu').post(createMenu)

export default router;