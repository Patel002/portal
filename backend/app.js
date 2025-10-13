import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import candidateRouter from './routes/candidate.routes.js'
import countryCodeRouter from './routes/country_code.routes.js'
import jobTitleRouter from './routes/job_title.routes.js'
import addressRouter from './routes/address.routes.js'
import careFacilityRouter from './routes/care_facility.routes.js'
import skillRouter from './routes/skills.routes.js'
import clientNeedsRouter from './routes/client_needs.routes.js'
import employeeRouter from './routes/auth.routes.js'
import roleRouter from './routes/roles.routes.js'
import menuRouter from './routes/menu.routes.js'
import accessRouter from './routes/access_controle.routes.js'
import clietnRouter from './routes/client.routes.js'
import mailRoutes from './routes/mail.routes.js'

const app = express();
dotenv.config();

app.use(express.json());

app.use(cors());

app.use('/uploads', express.static(path.join(path.resolve(), '/uploads')));

app.use('/api/candidate', candidateRouter);
app.use('/api/country-code', countryCodeRouter);
app.use('/api/job-title', jobTitleRouter);
app.use('/api/address', addressRouter);
app.use('/api/care-facility', careFacilityRouter);
app.use('/api/skill', skillRouter);
app.use('/api/client-needs', clientNeedsRouter);
app.use('/api/auth', employeeRouter);
app.use('/api/role', roleRouter);
app.use('/api/menu', menuRouter);
app.use("/api/access", accessRouter);
app.use("/api/client", clietnRouter);
app.use("/api/mail", mailRoutes);

export { app };