interface CoursePartBase {
    name: string;
    exerciseCount: number;
}

interface CoursePartDesc extends CoursePartBase {
    description: string;
}

interface CoursePartBasic extends CoursePartDesc {
    kind: "basic";
}

interface CoursePartGroup extends CoursePartBase {
    groupProjectCount: number;
    kind: "group";
}

interface CoursePartBackground extends CoursePartDesc {
    backgroundMaterial: string;
    kind: "background";
}

interface CoursePartSpecial extends CoursePartDesc {
    requirements: string[];
    kind: "special";
}

type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground | CoursePartSpecial;

const assertNever = (value: never): never => {
    throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};

const Part = ({ coursePart }: { coursePart: CoursePart }) => {
    switch (coursePart.kind) {
        case "basic":
            return (
                <div>
                    <h3>
                        {coursePart.name} {coursePart.exerciseCount}
                    </h3>
                    <p>{coursePart.description}</p>
                </div>
            );
        case "group":
            return (
                <div>
                    <h3>
                        {coursePart.name} {coursePart.exerciseCount}
                    </h3>
                    <p>project exercises {coursePart.groupProjectCount}</p>
                </div>
            );
        case "background":
            return (
                <div>
                    <h3>
                        {coursePart.name} {coursePart.exerciseCount}
                    </h3>
                    <p>{coursePart.description}</p>
                    <p>{coursePart.backgroundMaterial}</p>
                </div>
            );
        case "special":
            return (
                <div>
                    <h3>
                        {coursePart.name} {coursePart.exerciseCount}
                    </h3>
                    <p>{coursePart.description}</p>
                    <p>required skills: {coursePart.requirements.join(", ")}</p>
                </div>
            );
        default:
            assertNever(coursePart);
            break;
    }
};

const Content = ({ courseParts }: { courseParts: CoursePart[] }) => {
    return (
        <div>
            {courseParts.map((coursePart: CoursePart) => (
                <Part coursePart={coursePart} key={coursePart.name} />
            ))}
        </div>
    );
};

export default Content;
