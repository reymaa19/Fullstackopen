import express, { Response, Request, NextFunction } from "express";
import patientService from "../services/patientService";
import { NonSensitivePatient, Patient, NewPatient } from "../types";
import { NewPatientSchema } from "../utils";
import { z } from "zod";

const router = express.Router();

router.get("/", (_req, res: Response<NonSensitivePatient[]>) => {
    res.send(patientService.getNonSensitivePatientInfo());
});

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
    try {
        NewPatientSchema.parse(req.body);
        next();
    } catch (error: unknown) {
        next(error);
    }
};

const errorMiddleware = (error: unknown, _req: Request, res: Response, next: NextFunction) => {
    if (error instanceof z.ZodError) {
        res.status(400).send({ error: error.issues });
    } else {
        next(error);
    }
};

router.post("/", newPatientParser, (req: Request<unknown, unknown, NewPatient>, res: Response<Patient>) => {
    const addedPatient = patientService.addPatient(req.body);
    res.json(addedPatient);
});

interface ErrorMessage {
    error: string;
}

router.get("/:id", (req, res: Response<Patient | ErrorMessage>) => {
    const foundPatient = patientService.getPatient(req.params.id);

    if (!foundPatient) {
        res.status(400).json({ error: "No patient found" });
    } else {
        res.status(200).json(foundPatient);
    }
});

router.use(errorMiddleware);

export default router;
