import { Router } from "express";
import { registerClient, getParentEntity } from "../controller/client.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";


const router = Router();

router.route('/save-client').post(authenticateUser,registerClient);
router.route('/get_parent_entity').get(getParentEntity);

export default router;