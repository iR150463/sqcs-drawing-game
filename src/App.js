import './App.css';
import Game from './Game.js';
import topics from './database.js';

function App() {
  const randomTopic = topics[Math.floor(Math.random() * topics.length)]

  return (
    <>
      <Game topic={randomTopic} allTopics={topics} />
    </>
  );
}

export default App;
