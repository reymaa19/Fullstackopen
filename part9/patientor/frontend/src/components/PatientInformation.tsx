import { Female, Male, Transgender, LocalHospital, Work, MonitorHeart, Favorite } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@mui/material";
//import { Patient, Gender, Entry, Diagnosis } from "../types";
import { Patient, Gender, Entry, HealthCheckRating } from "../types";
import patientService from "../services/patients";
//import diagnosisService from "../services/diagnoses";
import EntryForm from "./EntryForm";

const assertNever = (value: never): never => {
    throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};

const EntryType: React.FC<{ entry: Entry }> = ({ entry }) => {
    switch (entry.type) {
        case "Hospital":
            return <LocalHospital />;
        case "HealthCheck":
            return <MonitorHeart />;
        case "OccupationalHealthcare":
            return <Work />;
        default:
            return assertNever(entry);
    }
};

const HealthCheckRatingIcon: React.FC<{ healthCheckRating: HealthCheckRating }> = ({ healthCheckRating }) => {
    switch (healthCheckRating) {
        case 0:
            return <Favorite style={{ color: "green" }} />;
        case 1:
            return <Favorite style={{ color: "yellow" }} />;
        case 2:
            return <Favorite style={{ color: "red" }} />;
        default:
            return <Favorite style={{ color: "black" }} />;
    }
};

const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
    return (
        <div style={{ border: "1px solid black", borderRadius: "5px", paddingLeft: "0.5rem", marginBottom: "1rem" }}>
            <p style={{ margin: "0.5rem" }}>
                {entry.date} <EntryType entry={entry} /> <br />
                <span style={{ fontStyle: "italic" }}>{entry.description}</span> <br />
                {entry.type == "HealthCheck" && <HealthCheckRatingIcon healthCheckRating={entry.healthCheckRating} />}
                {entry.type == "HealthCheck" && <br />}
                diagnose by {entry.specialist}
            </p>
        </div>
    );
};

export default function PatientInformation() {
    const [patient, setPatient] = useState<Patient>({
        id: "",
        name: "",
        occupation: "",
        gender: Gender.Male,
        ssn: "",
        dateOfBirth: "",
        entries: [],
    });
    const [toggle, setToggle] = useState(false);
    //const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

    const { id = "" } = useParams();

    async function getPatient() {
        const data = await patientService.getPatient(id);
        setPatient(data);
    }

    useEffect(() => {
        //async function getDiagnoses() {
        //    const data = await diagnosisService.getAll();
        //    setDiagnoses(data);
        //}

        async function getPatient() {
            const data = await patientService.getPatient(id);
            setPatient(data);
        }

        getPatient();
        //getDiagnoses();
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
            {toggle && <EntryForm id={id} onAddEntry={getPatient} setToggle={() => setToggle(!toggle)} />}
            <h3 style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                entries
                {!toggle && (
                    <Button variant="contained" color="secondary" onClick={() => setToggle(true)}>
                        Add Entry
                    </Button>
                )}
            </h3>
            {patient.entries?.map((entry: Entry) => {
                return (
                    <div key={entry.id}>
                        {
                            //<p>
                            //    {entry.date} <span>{entry.description}</span>
                            //</p>
                        }
                        <EntryDetails entry={entry} />
                        {
                            //<ul>
                            //    {entry.diagnosisCodes?.map((code: string) => {
                            //        return (
                            //            <li key={code}>
                            //                {code} {diagnoses.find((diagnosis) => diagnosis.code == code)?.name}
                            //            </li>
                            //        );
                            //    })}
                            //</ul>
                        }
                    </div>
                );
            })}
        </div>
    );
}
