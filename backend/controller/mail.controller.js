import nodemailer from 'nodemailer';
import { mailConfig } from '../model/mail_config.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import mjml2html from 'mjml'

const sendMail = async(req, res) => {
    const { to, subject, candidate,text } = req.body;

    try {
     if (!to || !subject || (!candidate)) {
      return res.status(400).json({ message: "Missing email fields" });
     }
      const smtp = await mailConfig.findOne();
      if (!smtp) {
        return res.status(500).json({ message: "SMTP configuration not found" });
    }

     const mjmlTemplate = `
      <mjml>
        <mj-head>
          <mj-attributes>
            <mj-text font-family="Arial, sans-serif" color="#555" font-size="14px" />
            <mj-button background-color="#007bff" color="white" border-radius="5px" font-size="14px" />
          </mj-attributes>
        </mj-head>
        <mj-body background-color="#f4f6f9">
          <mj-section background-color="#f4f6f9" padding="20px 0">
            <mj-column>
              <mj-image src="https://imgs.search.brave.com/FGBtrXzWq8w77zoDgltBvrSQ1WE7ALInKKImZk82cG0/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS12ZWN0/b3IvbmlnaHRpbmdh/bGUtYmlyZC1jaXJj/bGUtbmlnaHRpbmdh/bGUtYmlyZC1sb2dv/LWRlc2lnbi10ZW1w/bGF0ZS12ZWN0b3It/aWxsdXN0cmF0aW9u/XzU2NTU4NS01NjIz/LmpwZz9zZW10PWFp/c19oeWJyaWQmdz03/NDAmcT04MA" alt="Company Logo" width="120px" />
            </mj-column>
          </mj-section>

          <mj-section background-color="#ffffff" padding="20px">
            <mj-column>
              <mj-text font-size="20px" color="#007bff" font-weight="bold" align="center">
                Application Received!
              </mj-text>
              <mj-text>
                Hi <b>${candidate.candidate_name}</b>,<br/>
                Thank you for submitting your application. We have received your details and will review your profile shortly.
              </mj-text>
            </mj-column>
          </mj-section>

          <mj-section background-color="#ffffff" padding="20px">
            <mj-column>
              <mj-text font-size="16px" color="#333" font-weight="bold" padding-bottom="10px">
                Candidate Details:
              </mj-text>
              <mj-text>
                <b>Email:</b> ${candidate.email_id || "-"}<br/>
                <b>Mobile:</b> ${candidate.mobile_number || "-"}<br/>
                <b>Job Titles:</b> ${candidate.jobTitle?.join(", ") || "-"}<br/>
                <b>Skills:</b> ${candidate.skills?.join(", ") || "-"}<br/>
                <b>Care Facilities:</b> ${candidate.careFacility?.join(", ") || "-"}
              </mj-text>

              ${candidate.cv_url ? `<mj-text><b>CV:</b> <a href="${candidate.cv_url}" target="_blank">Download CV</a></mj-text>` : ""}
              ${candidate.profile_img_url ? `<mj-image src="${candidate.profile_img_url}" alt="Profile Image" width="120px" />` : ""}

              <mj-button href="">
                View Your Application
              </mj-button>
            </mj-column>
          </mj-section>

          <mj-section background-color="#f4f6f9" padding="20px">
            <mj-column>
              <mj-text font-size="12px" color="#888" align="center">
                &copy; 2025 . All rights reserved.
              </mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `;

    const { html } = mjml2html(mjmlTemplate, { validationLevel: "strict" });

    const transporter = nodemailer.createTransport({
        host: smtp.smtp_host,
        port: smtp.smtp_port,
        secure: smtp.secure,
        auth: {
            user: smtp.smtp_user,
            pass: smtp.smtp_password
        }
    });

    const senMail = await transporter.sendMail({
        from: smtp.smtp_user,
        to,
        subject,
        text,
        html
    });

    console.log("Message sent: %s", senMail.messageId);
    return res.status(200).json(new ApiResponse(200,senMail,"Email sent successfully", true ));

    } catch (error) {
        return res.status(500).json(new ApiResponse(500,"Error while sending email", false, error));
    }
}

export { sendMail };