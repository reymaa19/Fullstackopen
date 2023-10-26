const Header = ({ name }) => {
  return <h1>{name}</h1>
}

const Total = ({ sumOfExercises }) => {
  return <p><strong>Total of exercises {sumOfExercises}</strong></p>
}

const Part = ({ part }) => {
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  )
}

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map(part => <Part part={part} key={part.id}/>)}
    </div>
  )
}

const Course = ({ courses }) => {
  return (
    <>
      {courses.map((course) => { 
        const sumOfExercises = course.parts.reduce((sum, part) => sum += part.exercises, 0)
        return <div key={course.id}>
            <Header name={course.name} />
            <Content parts={course.parts} />
            <Total sumOfExercises={sumOfExercises} />
          </div>
        })
      }
    </>
  )
}

export default Course
