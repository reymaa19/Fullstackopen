import { isNotNumber } from "./utils";

export interface exerciseResults {
    periodLength: number;
    trainingDays: number;
    success: boolean;
    rating: number;
    ratingDescription: string;
    target: number;
    average: number;
}

export interface exerciseNumbers {
    target: number;
    hours: number[];
}

function parseExerciseNumbers(args: string[]): exerciseNumbers {
    const target = Number(args[2]);
    const hours = args.slice(3).map((hour) => {
        if (isNotNumber(hour)) throw new Error(`${hour} is not a number`);
        return Number(hour);
    });

    return { target, hours };
}

export default function calculateExercises(hours: number[], target: number): exerciseResults {
    const periodLength = hours.length;
    const trainingDays = hours.filter((day) => day != 0).length;
    const average = hours.filter((day) => day != 0).reduce((acc, curr) => acc + Number(curr), 0) / periodLength;
    const success = average > target;
    const rating = () => {
        if (average < target / 2) return 1;
        else if (average < target) return 2;
        else return 3;
    };
    const ratingDescription = () => {
        if (rating() === 1) return "Not good enough!";
        else if (rating() === 2) return "You can do better!";
        else return "Good job, you've proved yourself!";
    };

    return {
        periodLength,
        trainingDays,
        success,
        rating: rating(),
        ratingDescription: ratingDescription(),
        target,
        average,
    };
}

try {
    const { target, hours } = parseExerciseNumbers(process.argv);
    console.log(calculateExercises(hours, target));
} catch (error: unknown) {
    let errorMessage = "Something bad happened.";
    if (error instanceof Error) {
        errorMessage += " Error: " + error.message;
    }
    console.log(errorMessage);
}
