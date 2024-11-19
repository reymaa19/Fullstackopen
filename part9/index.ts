import express from "express";
import bmiCalculator from "./bmiCalculator";

const app = express();

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
            res.status(500).json({ error: "calculation failed" });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
