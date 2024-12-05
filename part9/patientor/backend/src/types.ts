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

//export interface Patient extends NewPatient {
//    id: string;
//}

export type NewPatient = z.infer<typeof NewPatientSchema>;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Entry {}

export interface Patient {
    id: string;
    name: string;
    ssn: string;
    occupation: string;
    gender: Gender;
    dateOfBirth: string;
    entries: Entry[];
}

export type NonSensitivePatient = Omit<Patient, "ssn" | "entries">;
