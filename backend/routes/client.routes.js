import { Router } from "express";
import { registerClient, 
    getParentEntity, 
    getAllClientInfo, 
    deleteFromList, 
    updateClientDetails,
    getClientInfoById,
    getAllServicesInfo,
    updateClientService ,
    updateClientShiftPattern
} from "../controller/client.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = Router();

router.route('/save-client').post(authenticateUser,registerClient);
router.route('/get_parent_entity').get(getParentEntity);
router.route('/info').get(getClientInfoById);
router.route('/get-client-info').get(getAllClientInfo);
router.route('/delete').patch(authenticateUser,deleteFromList);
router.route('/update-client-details').patch(updateClientDetails);
router.route('/get-all-services').get(getAllServicesInfo);
router.route('/update-client-service').patch(updateClientService);
router.route('/update-client-shift-pattern').patch(updateClientShiftPattern);


export default router;