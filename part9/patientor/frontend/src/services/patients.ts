import axios from "axios";
import { EntryWithoutId, Patient, PatientFormValues, Entry } from "../types";

import { apiBaseUrl } from "../constants";

const getAll = async () => {
    const { data } = await axios.get<Patient[]>(`${apiBaseUrl}/patients`);

    return data;
};

const create = async (object: PatientFormValues) => {
    const { data } = await axios.post<Patient>(`${apiBaseUrl}/patients`, object);

    return data;
};

async function getPatient(id: string): Promise<Patient> {
    const { data } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
    return data;
}

async function addEntry(id: string, newEntry: EntryWithoutId): Promise<Entry | { error: string[] | string }> {
    try {
        const { data } = await axios.post<Entry>(`${apiBaseUrl}/patients/${id}/entries`, newEntry);
        return data;
    } catch (e: unknown) {
        if (axios.isAxiosError(e) && e.response) {
            return { error: e.response.data };
        } else {
            return { error: "An unknown error occurred" };
        }
    }
}

export default {
    getAll,
    create,
    getPatient,
    addEntry,
};
