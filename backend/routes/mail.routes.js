import { sendMail } from "../controller/mail.controller.js";
import {smtpConfig} from "../services/smtp.service.js";
import { Router } from "express";

const router = Router();

router.route('/config').post(smtpConfig);
router.route('/send').post(sendMail);

export default router;