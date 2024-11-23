import express from "express";
import bmiCalculator from "./bmiCalculator";
import { exerciseNumbers } from "./exerciseCalculator";

const app = express();
app.use(express.json());

const PORT = 3003;

app.get("/", (_req, res) => {
    res.send("Hello, world!");
});

app.get("/bmi", (req, res) => {
    const { height, weight } = req.query;

    if (!height || !weight || isNaN(Number(height)) || isNaN(Number(weight))) {
        res.status(400).json({ error: "malformatted parameters" });
    } else {
        try {
            const heightNum = Number(height);
            const weightNum = Number(weight);

            if (heightNum <= 0 || weightNum <= 0) {
                res.status(400).json({ error: "height and weight must be positive numbers" });
            } else {
                const bmi = bmiCalculator(heightNum, weightNum);
                res.status(200).json({
                    height: heightNum,
                    weight: weightNum,
                    bmi,
                });
            }
        } catch (e) {
            console.log(e);
            res.status(500).json({ error: "calculation failed" });
        }
    }
});

app.post("/exercises", (req, res) => {
    const numbers = { hours: req.body.daily_exercises, target: req.body.target } as exerciseNumbers;
    console.log(daily_exercises);
    console.log(target);

    //const result = exerciseCalculator(daily_exercises, target);
    //console.log("result: ", result);
    res.send("yes");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
