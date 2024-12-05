import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";

interface DiaryEntry {
    id: number;
    date: string;
    weather: string;
    visibility: string;
    comment?: string;
}

type NewDiaryEntry = Omit<DiaryEntry, "id">;

export default function App() {
    const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
    const [newDiaryEntry, setNewDiaryEntry] = useState<NewDiaryEntry>({
        date: "",
        weather: "",
        visibility: "",
        comment: "",
    });
    const [notification, setNotification] = useState("");

    useEffect(() => {
        async function getDiaries() {
            const response = await axios.get<DiaryEntry[]>("http://localhost:3000/api/diaries");
            setDiaryEntries(response.data);
        }

        getDiaries();
    }, []);

    function handleChange(e: React.FormEvent<HTMLInputElement>): void {
        const { value, name } = e.currentTarget;
        setNewDiaryEntry({ ...newDiaryEntry, [name]: value });
    }

    async function createDiary(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            const response = await axios.post<DiaryEntry>("http://localhost:3000/api/diaries", newDiaryEntry);

            setNotification("successfully created a new diary entry");
            setTimeout(() => {
                setNotification("");
            }, 5000);

            setDiaryEntries(diaryEntries.concat(response.data));
            setNewDiaryEntry({
                date: "",
                weather: "",
                visibility: "",
                comment: "",
            });
        } catch (e) {
            const err = e as AxiosError;
            setNotification(String(err.response?.data));
            setTimeout(() => {
                setNotification("");
            }, 5000);
        }
    }

    if (!diaryEntries) {
        return <p>loading...</p>;
    }

    return (
        <div>
            <form onSubmit={createDiary}>
                {notification.includes("Error") ? (
                    <p style={{ color: "red" }}>{notification}</p>
                ) : (
                    <p style={{ color: "green" }}>{notification}</p>
                )}
                <div>
                    date
                    <input type="date" name="date" value={newDiaryEntry.date} onChange={handleChange} />
                </div>
                <div style={{ display: "flex", gap: "1rem" }}>
                    visibility
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        <div>
                            <label htmlFor="great"> great</label>
                            <input id="great" type="radio" name="visibility" value="great" onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="good">good</label>
                            <input id="good" type="radio" name="visibility" value="good" onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="ok">ok</label>
                            <input id="ok" type="radio" name="visibility" value="ok" onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="poor">poor</label>
                            <input id="poor" type="radio" name="visibility" value="poor" onChange={handleChange} />
                        </div>
                    </div>
                </div>
                <div style={{ display: "flex", gap: "1rem" }}>
                    weather
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        <div>
                            <label htmlFor="sunny">sunny</label>
                            <input id="sunny" type="radio" name="weather" value="great" onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="rainy">rainy</label>
                            <input id="rainy" type="radio" name="weather" value="rainy" onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="cloudy">cloudy</label>
                            <input id="cloudy" type="radio" name="weather" value="cloudy" onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="stormy">stormy</label>
                            <input id="stormy" type="radio" name="weather" value="stormy" onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="windy">windy</label>
                            <input id="windy" type="radio" name="weather" value="windy" onChange={handleChange} />
                        </div>
                    </div>
                </div>
                <div>
                    comment
                    <input type="text" name="comment" value={newDiaryEntry.comment} onChange={handleChange} />
                </div>
                <button type="submit">add</button>
            </form>
            <h2>diary entries</h2>
            {diaryEntries.map((diary) => {
                return (
                    <div key={diary.id}>
                        <h3>{diary.date}</h3>
                        <p>
                            visibility: {diary.visibility} <br /> weather: {diary.weather}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}
