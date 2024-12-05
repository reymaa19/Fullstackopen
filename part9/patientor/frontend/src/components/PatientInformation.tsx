import { Female, Male, Transgender } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Patient, Gender } from "../types";
import patientService from "../services/patients";

export default function PatientInformation() {
    const [patient, setPatient] = useState<Patient>({
        id: "",
        name: "",
        occupation: "",
        gender: Gender.Male,
        ssn: "",
        dateOfBirth: "",
    });

    const { id = "" } = useParams();

    useEffect(() => {
        async function getPatient() {
            const data = await patientService.getPatient(id);
            setPatient(data);
        }

        getPatient();
    }, [id]);

    return (
        <div>
            <h2>
                {patient.name}{" "}
                {patient.gender == "male" ? <Male /> : patient.gender == "female" ? <Female /> : <Transgender />}
            </h2>
            <p>
                ssn: {patient.ssn} <br />
                occupation: {patient.occupation}
            </p>
        </div>
    );
}
