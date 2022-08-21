import './App.css';
import Game from './Game.js';
import topics from './database.js';

function App() {
  return (
    <>
      <Game allTopics={topics} />
    </>
  );
}

export default App;
