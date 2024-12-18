import { z } from "zod";
import { NewPatientSchema, Discharge, SickLeave } from "./utils";

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

//export interface Entry {}

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

interface BaseEntry {
    id: string;
    description: string;
    date: string;
    specialist: string;
    diagnosisCodes?: Diagnosis["code"][];
}

type Discharge = z.infer<typeof Discharge>;
type SickLeave = z.infer<typeof SickLeave>;

export enum HealthCheckRating {
    "Healthy" = 0,
    "LowRisk" = 1,
    "HighRisk" = 2,
    "CriticalRisk" = 3,
}

interface HealthCheckEntry extends BaseEntry {
    type: "HealthCheck";
    healthCheckRating: HealthCheckRating;
}

interface HospitalEntry extends BaseEntry {
    type: "Hospital";
    discharge: Discharge;
}

interface OccupationalHealthcareEntry extends BaseEntry {
    type: "OccupationalHealthcare";
    employerName: string;
    sickLeave?: SickLeave;
}

export enum EntryType {
    HealthCheck = "HealthCheck",
    Hospital = "Hospital",
    OccupationalHealthcare = "OccupationalHealthcare",
}

export type Entry = HospitalEntry | OccupationalHealthcareEntry | HealthCheckEntry;

// Define special omit for unions
export type UnionOmit<T, K extends string | number | symbol> = T extends unknown ? Omit<T, K> : never;
// Define Entry without the 'id' property
export type EntryWithoutId = UnionOmit<Entry, "id">;
