import axios from "axios";
import { Diagnosis } from "../types";

import { apiBaseUrl } from "../constants";

const getAll = async () => {
    const { data } = await axios.get<Diagnosis[]>(`${apiBaseUrl}/diagnoses`);

    return data;
};

//const create = async (object: PatientFormValues) => {
//    const { data } = await axios.post<Patient>(`${apiBaseUrl}/patients`, object);
//
//    return data;
//};

//async function getDiagnosis(id: string): Promise<Diagnosis> {
//    const { data } = await axios.get<Diagnosis>(`${apiBaseUrl}/diagnosis/${id}`);
//    return data;
//}

export default {
    getAll,
};
