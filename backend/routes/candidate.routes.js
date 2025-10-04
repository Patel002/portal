import { candidateRegister, getAllInfoCandidate, formAction } from "../controller/candidate.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { Router } from "express";

const router = Router();

router.route('/candidate').post(upload.fields([{
    name: 'upload_cv',
    maxCount: 1
}, {
    name: 'profile_img',
    maxCount: 1
}]), candidateRegister);

router.route('/info').get(getAllInfoCandidate);
router.route('/action').patch(formAction);

export default router;