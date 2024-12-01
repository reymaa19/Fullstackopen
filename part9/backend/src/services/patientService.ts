import patients from "../../data/patients";
import { v1 as uuid } from "uuid";

import { Patient, NonSensitivePatient, NewPatientInfo } from "../types";

const getPatients = (): Patient[] => {
    return patients;
};

const getNonSensitivePatientInfo = (): NonSensitivePatient[] => {
    return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
        id,
        name,
        dateOfBirth,
        gender,
        occupation,
    }));
};

const addPatient = (newPatientInfo: NewPatientInfo): Patient => {
    const newPatient = {
        id: uuid(),
        ...newPatientInfo,
    };

    patients.push(newPatient);
    return newPatient;
};

export default {
    getPatients,
    getNonSensitivePatientInfo,
    addPatient,
};
