interface CoursePart {
    name: string;
    exerciseCount: number;
}

const Content = ({ courseParts }: { courseParts: CoursePart[] }) => {
    return (
        <div>
            {courseParts.map((coursePart: CoursePart) => (
                <p>
                    {coursePart.name} {coursePart.exerciseCount}
                </p>
            ))}
        </div>
    );
};

export default Content;
