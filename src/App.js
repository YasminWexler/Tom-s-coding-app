import { Lobby } from './components/Lobby/Lobby';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import {ArrayMethodsMastery} from './components/CodeBlock/ArrayMethodsMastery/ArrayMethodsMastery';
import {Asynccase} from './components/CodeBlock/AsyncCase/Asynccase'
import {CallbackHell} from './components/CodeBlock/CallbackHell/CallbackHell';
import {EventLoopExplained} from './/components/CodeBlock/EventLoopExplained/EventLoopExplained';
import {PromisesPuzzle} from './/components/CodeBlock/PromisesPuzzle/PromisesPuzzle';

function App() {
  return (
    <div>
    <Routes>
      <Route path="/" element={<Lobby />} />
      <Route path="/array-methods-mastery" element={<ArrayMethodsMastery />} />
      <Route path="/Async-case" element={<Asynccase/>} />
      <Route path="/Callback-Hell" element={<CallbackHell/>} />
      <Route path="/Event-Loop-Explained" element={<EventLoopExplained/>} />
      <Route path="/Promises-Puzzle" element={<PromisesPuzzle/>} />
    </Routes>
  </div>
  );
    
  
}

export default App;
