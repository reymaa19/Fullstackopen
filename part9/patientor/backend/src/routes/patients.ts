import express, { Response, Request, NextFunction } from "express";
import patientService from "../services/patientService";
import { NonSensitivePatient, Patient, NewPatient, EntryWithoutId, Entry, EntryType } from "../types";
import {
    NewPatientSchema,
    NewEntrySchema,
    NewHealthCheckEntrySchema,
    NewOccupationalHealthcareEntry,
    NewHospitalEntry,
} from "../utils";
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

const newEntryParser = (req: Request, _res: Response, next: NextFunction) => {
    try {
        const parsedEntry = NewEntrySchema.parse(req.body);

        switch (parsedEntry.type) {
            case EntryType.HealthCheck:
                NewHealthCheckEntrySchema.parse(req.body);
                break;
            case EntryType.Hospital:
                NewHospitalEntry.parse(req.body);
                break;
            case EntryType.OccupationalHealthcare:
                NewOccupationalHealthcareEntry.parse(req.body);
                break;
            default:
                throw new Error("Invalid entry type");
        }

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

router.post(
    "/:id/entries",
    newEntryParser,
    (req: Request<{ id: string }, unknown, EntryWithoutId>, res: Response<Entry | ErrorMessage>) => {
        const addedEntry = patientService.addEntry(req.params.id, req.body);
        res.status(201).json(addedEntry);
    },
);

router.use(errorMiddleware);

export default router;
