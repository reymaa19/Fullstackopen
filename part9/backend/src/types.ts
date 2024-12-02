import { z } from "zod";
import { NewPatientSchema } from "./utils";

export enum Gender {
    Male = "male",
    Female = "female",
    Other = "other",
}

export type Diagnosis = {
    code: string;
    name: string;
    latin?: string;
};

export type EnglishDiagnosis = Omit<Diagnosis, "latin">;

export interface Patient extends NewPatient {
    id: string;
}

export type NonSensitivePatient = Omit<Patient, "ssn">;

export type NewPatient = z.infer<typeof NewPatientSchema>;
