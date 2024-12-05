import patients from "../../data/patients";
import { v1 as uuid } from "uuid";

import { Patient, NonSensitivePatient, NewPatient } from "../types";

const getPatients = (): Patient[] => {
    return patients;
};

const getNonSensitivePatientInfo = (): NonSensitivePatient[] => {
    return patients.map(({ id, name, dateOfBirth, gender, occupation, entries }) => ({
        id,
        name,
        dateOfBirth,
        gender,
        occupation,
        entries,
    }));
};

const addPatient = (newPatient: NewPatient): Patient => {
    const newPatientInfo = {
        id: uuid(),
        entries: [],
        ...newPatient,
    };

    patients.push(newPatientInfo);
    return newPatientInfo;
};

const getPatient = (id: string): Patient | null => {
    const foundPatient = patients.filter((p) => p.id == id)[0];
    if (!foundPatient) {
        return null;
    } else {
        return foundPatient;
    }
};

export default {
    getPatients,
    getNonSensitivePatientInfo,
    addPatient,
    getPatient,
};
