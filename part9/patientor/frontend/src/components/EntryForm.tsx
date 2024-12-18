import { useState } from "react";
import { EntryType } from "../types";
import patientService from "../services/patients";
import { Box, Button, Input, InputLabel, MenuItem } from "@mui/material";
import { ErrorOutline, CheckCircleOutline } from "@mui/icons-material";
import Select, { SelectChangeEvent } from "@mui/material/Select";

interface Notification {
    error?: string;
    success?: string;
}

export interface ResponseError {
    code: string;
    validation: string;
    message: string;
    path: string[];
}

const codes = ["Z57.1", "N30.0", "L60.1", "R.32.2", "D.54.1"];

const EntryForm: React.FC<{ id: string; onAddEntry: () => void; setToggle: () => void }> = ({
    id,
    onAddEntry,
    setToggle,
}) => {
    const [notification, setNotification] = useState<Notification>({});
    const [type, setType] = useState<EntryType>("HealthCheck");
    const baseNewEntry = {
        type,
        description: "",
        date: "",
        specialist: "",
        diagnosisCodes: [],
        healthCheckRating: 0,
        employerName: "",
        sickLeave: {
            startDate: "",
            endDate: "",
        },
        discharge: {
            date: "",
            criteria: "",
        },
    };

    const [newEntry, setNewEntry] = useState(baseNewEntry);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const { name, value } = e.currentTarget;
        if (type == "Hospital")
            if (name == "dischargeDate") {
                setNewEntry({
                    ...newEntry,
                    discharge: {
                        date: value,
                        criteria: newEntry.discharge.criteria,
                    },
                });
            } else if (name == "criteria") {
                setNewEntry({
                    ...newEntry,
                    discharge: {
                        date: newEntry.discharge.date,
                        criteria: value,
                    },
                });
            } else {
                setNewEntry({ ...newEntry, [name]: value });
            }
        else if (type == "OccupationalHealthcare") {
            if (name == "sickLeaveStartDate") {
                setNewEntry({
                    ...newEntry,
                    sickLeave: {
                        startDate: value,
                        endDate: newEntry.sickLeave.endDate,
                    },
                });
            } else if (name == "sickLeaveEndDate") {
                setNewEntry({
                    ...newEntry,
                    sickLeave: {
                        startDate: newEntry.sickLeave.startDate,
                        endDate: value,
                    },
                });
            } else {
                setNewEntry({ ...newEntry, [name]: value });
            }
        } else {
            setNewEntry({ ...newEntry, [name]: value });
        }
    };

    const handleDiagnosisChange = (e: SelectChangeEvent<typeof newEntry.diagnosisCodes>) => {
        const {
            target: { value },
        } = e;

        setNewEntry({ ...newEntry, diagnosisCodes: typeof value === "string" ? value.split(",") : value });
    };

    const createEntry = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let entryData;

        switch (type) {
            case "Hospital":
                entryData = {
                    description: newEntry.description,
                    date: newEntry.date,
                    specialist: newEntry.specialist,
                    type,
                    discharge: newEntry.discharge,
                    diagnosisCodes: newEntry.diagnosisCodes ? newEntry.diagnosisCodes : [],
                };
                break;
            case "OccupationalHealthcare":
                entryData = {
                    description: newEntry.description,
                    date: newEntry.date,
                    specialist: newEntry.specialist,
                    type,
                    employerName: newEntry.employerName,
                    sickLeave: newEntry.sickLeave,
                    diagnosisCodes: newEntry.diagnosisCodes ? newEntry.diagnosisCodes : [],
                };
                break;
            case "HealthCheck":
                entryData = {
                    description: newEntry.description,
                    date: newEntry.date,
                    specialist: newEntry.specialist,
                    type,
                    healthCheckRating: newEntry.healthCheckRating,
                    diagnosisCodes: newEntry.diagnosisCodes ? newEntry.diagnosisCodes : [],
                };
                break;
        }

        const response = await patientService.addEntry(id, entryData);

        if ("error" in response) {
            if (typeof response.error == "object" && "error" in response.error) {
                const error = response.error.error as ResponseError[];
                const message = error[0].message;
                setNotification({ error: message });
            } else {
                setNotification({ error: "Unexpected error occurred." });
            }

            setTimeout(() => {
                setNotification({});
            }, 5000);
        } else {
            onAddEntry();

            setNotification({ success: "Successfully created a new entry." });

            setTimeout(() => {
                setNotification({});
            }, 5000);

            setNewEntry(baseNewEntry);
            setToggle();
        }
    };

    const NotificationBox = ({ message, type }: { message: string; type: "error" | "success" }) => {
        const styles = { error: { backgroundColor: "rgb(253 236 233)" }, success: { backgroundColor: "#81c995" } };

        return (
            <Box
                sx={{
                    ...styles[type],
                    p: "1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                }}
            >
                {type === "error" ? <ErrorOutline /> : <CheckCircleOutline />} {message}
            </Box>
        );
    };

    return (
        <div>
            {notification.error && <NotificationBox message={notification.error} type="error" />}
            {notification.success && <NotificationBox message={notification.success} type="success" />}

            <form onSubmit={createEntry} style={{ display: "flex", flexDirection: "column" }}>
                <h4>New {type} entry</h4>
                <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                    Entry Type
                    <div>
                        <InputLabel htmlFor="healthCheckType">
                            Health Check{" "}
                            <input
                                type="radio"
                                id="healthCheckType"
                                name="entryType"
                                value="HealthCheck"
                                checked={type === "HealthCheck"}
                                onChange={(e) => {
                                    setType(e.target.value as EntryType);
                                    setNewEntry(baseNewEntry);
                                }}
                            />
                        </InputLabel>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        <InputLabel htmlFor="hospitalType">
                            Hospital
                            <input
                                type="radio"
                                id="hospitalType"
                                name="entryType"
                                value="Hospital"
                                checked={type === "Hospital"}
                                onChange={(e) => {
                                    setType(e.target.value as EntryType);
                                    setNewEntry(baseNewEntry);
                                }}
                            />
                        </InputLabel>
                    </div>
                    <div>
                        <InputLabel htmlFor="occupationalType">
                            Occupational Healthcare
                            <input
                                type="radio"
                                id="occupationalType"
                                name="entryType"
                                value="OccupationalHealthcare"
                                checked={type === "OccupationalHealthcare"}
                                onChange={(e) => {
                                    setType(e.target.value as EntryType);
                                    setNewEntry(baseNewEntry);
                                }}
                            />
                        </InputLabel>
                    </div>
                </div>
                <InputLabel htmlFor="description">Description</InputLabel>
                <Input
                    type="text"
                    id="description"
                    name="description"
                    value={newEntry.description}
                    onChange={handleChange}
                />
                <InputLabel htmlFor="date">Date</InputLabel>
                <Input type="date" id="date" name="date" value={newEntry.date} onChange={handleChange} />
                <InputLabel htmlFor="specialist">Specialist</InputLabel>
                <Input id="specialist" name="specialist" value={newEntry.specialist} onChange={handleChange} />
                <InputLabel htmlFor="diagnosisCodes">Diagnosis Codes</InputLabel>
                <Select
                    id="diagnosisCodes"
                    name="diagnosisCodes"
                    value={newEntry.diagnosisCodes}
                    onChange={handleDiagnosisChange}
                    multiple
                    sx={{ maxHeight: "2.5rem" }}
                >
                    {codes.map((code) => (
                        <MenuItem key={code} value={code}>
                            {code}
                        </MenuItem>
                    ))}
                </Select>
                {type === "HealthCheck" && (
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <InputLabel htmlFor="healthCheckRating">Healthcheck Rating</InputLabel>
                        <Input
                            type="number"
                            id="healthCheckRating"
                            name="healthCheckRating"
                            value={newEntry.healthCheckRating}
                            onChange={handleChange}
                        />
                    </Box>
                )}
                {type === "Hospital" && (
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <InputLabel htmlFor="dischargeDate">Discharge</InputLabel>
                        <InputLabel htmlFor="dischargeDate">Date</InputLabel>
                        <Input
                            type="date"
                            id="dischargeDate"
                            name="dischargeDate"
                            value={newEntry.discharge.date}
                            onChange={handleChange}
                        />
                        <InputLabel htmlFor="criteria">Criteria</InputLabel>
                        <Input
                            id="criteria"
                            name="criteria"
                            value={newEntry.discharge.criteria}
                            onChange={handleChange}
                        />
                    </Box>
                )}
                {type === "OccupationalHealthcare" && (
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <InputLabel htmlFor="employerName">Employer Name</InputLabel>
                        <Input
                            id="employerName"
                            name="employerName"
                            value={newEntry.employerName}
                            onChange={handleChange}
                        />
                        <InputLabel htmlFor="sickLeaveStartDate">Sick Leave</InputLabel>
                        <InputLabel htmlFor="sickLeaveStartDate">Start</InputLabel>
                        <Input
                            type="date"
                            id="sickLeaveStartDate"
                            name="sickLeaveStartDate"
                            value={newEntry.sickLeave.startDate}
                            onChange={handleChange}
                        />
                        <InputLabel htmlFor="sickLeaveEndDate">End</InputLabel>
                        <Input
                            type="date"
                            id="sickLeaveEndDate"
                            name="sickLeaveEndDate"
                            value={newEntry.sickLeave.endDate}
                            onChange={handleChange}
                        />
                    </Box>
                )}

                <Box sx={{ display: "flex", justifyContent: "space-between", mt: "1rem" }}>
                    <Button
                        type="button"
                        variant="contained"
                        color="error"
                        onClick={() => {
                            setNewEntry(baseNewEntry);
                            setToggle();
                        }}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" color="success">
                        Add
                    </Button>
                </Box>
            </form>
        </div>
    );
};

export default EntryForm;
