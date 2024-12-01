import express, { Response } from "express";
import patientService from "../services/patientService";
import { NonSensitivePatient } from "../types";
import toNewPatientInfo from "../utils";

const router = express.Router();

router.get("/", (_req, res: Response<NonSensitivePatient[]>) => {
    res.send(patientService.getNonSensitivePatientInfo());
});

router.post("/", (req, res) => {
    try {
        const newPatientInfo = toNewPatientInfo(req.body);

        const addedEntry = patientService.addPatient(newPatientInfo);
        res.json(addedEntry);
    } catch (error: unknown) {
        let errorMessage = "Something went wrong.";
        if (error instanceof Error) {
            errorMessage += " Error: " + error.message;
        }
        res.status(400).send(errorMessage);
    }
});

export default router;
