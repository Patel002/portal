import { createRoles, updateRoles, getRole } from "../controller/roles.controller.js";
import { Router } from "express";

const router = Router();

router.route('/').post(createRoles);
router.route('/update').patch(updateRoles)
router.route('/list-role').get(getRole)

export default router;