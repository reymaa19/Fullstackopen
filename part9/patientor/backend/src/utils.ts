import { NewPatient, Gender, Diagnosis, HealthCheckRating, EntryType } from "./types";
import { z } from "zod";

export const NewPatientSchema = z.object({
    name: z.string(),
    dateOfBirth: z.string().date(),
    ssn: z.string(),
    gender: z.nativeEnum(Gender),
    occupation: z.string(),
});

export const toNewPatientInfo = (object: unknown): NewPatient => {
    return NewPatientSchema.parse(object);
};

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis["code"]> => {
    if (!object || typeof object !== "object" || !("diagnosisCodes" in object)) {
        // we will just trust the data to be in correct form
        return [] as Array<Diagnosis["code"]>;
    }

    return object.diagnosisCodes as Array<Diagnosis["code"]>;
};

const diagnosisCodesSchema = z.array(z.string()).transform((codes) => parseDiagnosisCodes({ diagnosisCodes: codes }));

const parseHealthCheckRating = z.preprocess(
    (val) => {
        if (typeof val === "string") {
            return parseInt(val);
        }
        return val;
    },
    z.number().superRefine((val, ctx) => {
        if (!Object.values(HealthCheckRating).includes(val)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Value of healthCheckRating incorrect: ${val}`,
            });
        }
    }),
);

export const SickLeave = z.object({
    startDate: z.string().date(),
    endDate: z.string().date(),
});

export const Discharge = z.object({
    date: z.string().date(),
    criteria: z.string(),
});

export const NewEntrySchema = z.object({
    description: z.string(),
    date: z.string().date(),
    specialist: z.string(),
    type: z.nativeEnum(EntryType),
    diagnosisCodes: diagnosisCodesSchema.optional(),
});

export const NewHealthCheckEntrySchema = NewEntrySchema.extend({
    type: z.literal(EntryType.HealthCheck),
    healthCheckRating: parseHealthCheckRating,
});

export const NewOccupationalHealthcareEntry = NewEntrySchema.extend({
    type: z.literal(EntryType.OccupationalHealthcare),
    employerName: z.string(),
    sickLeave: SickLeave.optional(),
});

export const NewHospitalEntry = NewEntrySchema.extend({
    type: z.literal(EntryType.Hospital),
    discharge: Discharge,
});
