import diagnoses from "../../data/diagnoses";

import { Diagnosis, EnglishDiagnosis } from "../types";

const getDiagnoses = (): Diagnosis[] => {
    return diagnoses;
};

const getEnglishDiagnoses = (): EnglishDiagnosis[] => {
    return diagnoses.map(({ code, name }) => ({ code, name }));
};

export default {
    getDiagnoses,
    getEnglishDiagnoses,
};
