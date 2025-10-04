import { Router } from "express";
import { registerClient, getParentEntity } from "../controller/client.controller.js";

const router = Router();

router.route('/save_client').post(registerClient);
router.route('/get_parent_entity').get(getParentEntity);

export default router;