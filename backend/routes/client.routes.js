import { Router } from "express";
import { registerClient, getParentEntity, getAllClientInfo, updateClientDetails, updateClientService  } from "../controller/client.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = Router();

router.route('/save-client').post(authenticateUser,registerClient);
router.route('/get_parent_entity').get(getParentEntity);
router.route('/get-client-info').get(getAllClientInfo);
router.route('/update-client-details').patch(updateClientDetails);
router.route('/update-client-service').patch(updateClientService);

export default router;