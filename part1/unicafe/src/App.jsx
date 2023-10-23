import { useState } from 'react';

const Button = ({ text, clickHandler }) => {
  return <button onClick={clickHandler}>{text}</button>;
};

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  );
};

const Statistics = ({ good, neutral, bad }) => {
  if (good == 0 && neutral == 0 && bad == 0) return <p>No feedback given</p>;
  const total = good + neutral + bad;
  const average = (good - bad) / total;
  const goodPercentage = (good / total) * 100 + ' %';

  return (
    <>
      <h2>statistics</h2>
      <table>
        <tbody>
          <StatisticLine text={'good'} value={good} />
          <StatisticLine text={'neutral'} value={neutral} />
          <StatisticLine text={'bad'} value={bad} />
          <StatisticLine text={'total'} value={total} />
          <StatisticLine text={'average'} value={average} />
          <StatisticLine text={'positive'} value={goodPercentage} />
        </tbody>
      </table>
    </>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleGoodClick = () => setGood(good + 1);
  const handleNeutralClick = () => setNeutral(neutral + 1);
  const handleBadClick = () => setBad(bad + 1);

  return (
    <div>
      <h1>give feedback</h1>
      <Button text={"good"} clickHandler={handleGoodClick} />
      <Button text={"bad"} clickHandler={handleNeutralClick} />
      <Button text={"neutral"} clickHandler={handleBadClick} />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

export default App;
