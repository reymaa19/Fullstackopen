import patients from "../../data/patients";
import { v1 as uuid } from "uuid";

import { Patient, NonSensitivePatient, NewPatient } from "../types";

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

const addPatient = (newPatient: NewPatient): Patient => {
    const newPatientInfo = {
        id: uuid(),
        ...newPatient,
    };

    patients.push(newPatientInfo);
    return newPatientInfo;
};

export default {
    getPatients,
    getNonSensitivePatientInfo,
    addPatient,
};
