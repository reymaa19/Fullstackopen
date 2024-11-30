interface BmiNumbers {
    height: number;
    weight: number;
}

function parseBmiNumbers(args: string[]): BmiNumbers {
    if (args.length < 4) throw new Error("Not enough arguments");
    if (args.length > 4) throw new Error("Too many arguments");

    if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
        return {
            height: Number(args[2]),
            weight: Number(args[3]),
        };
    } else {
        throw new Error("Provided values were not numbers!");
    }
}

function calculateBmi(height: number, weight: number): string {
    const bmi = weight / (height / 100) ** 2;

    if (bmi < 18.5) return "Underweight";
    else if (bmi < 24.9) return "Normal";
    else if (bmi < 29.9) return "Overweight";
    else return "Obese";
}

export default function calculate(height: number, weight: number): string {
    return calculateBmi(height, weight);
}

try {
    // Check if the script is run directly from the command line
    if (require.main === module) {
        const { height, weight } = parseBmiNumbers(process.argv);
        console.log(calculateBmi(height, weight));
    }
} catch (error: unknown) {
    let errorMessage = "Something bad happened.";
    if (error instanceof Error) errorMessage += " Error: " + error.message;

    console.log(errorMessage);
}
