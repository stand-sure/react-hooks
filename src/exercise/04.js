// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from "react";

const emptyBoard = Array(9).fill(null);

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = React.useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(`%c ${error}`, "color:red");
      return initialValue;
    }
  });

  const setValue = value => setStoredValue(value);

  React.useEffect(() => {
    console.log(
      `%c persist ${key}=${JSON.stringify(storedValue)}`,
      "color:green",
    );
    window.localStorage.setItem(key, JSON.stringify(storedValue));
  }, [key, storedValue]);

  return [storedValue, setValue];
}

function Board() {
  const [savedSquares, setSavedSquares] = useLocalStorage(
    "squares",
    emptyBoard,
  );

  const [history, setHistory] = useLocalStorage("history", []);
  const [stepNumber, setStepNumber] = useLocalStorage("stepNumber", 0);
  const [squares, setSquares] = React.useState(savedSquares);
  const nextValue = calculateNextValue(squares);
  const winner = calculateWinner(squares);
  const status = calculateStatus(winner, squares, nextValue);

  React.useEffect(() => {
    setSavedSquares(squares);
  }, [setSavedSquares, squares]);

  const selectSquare = function selectSquare(square) {
    if (winner || squares[square]) {
      return;
    }

    const newSquares = [...squares];
    newSquares[square] = nextValue;
    setStepNumber(stepNumber + 1);
    setSquares(newSquares);
    setSavedSquares(newSquares);

    console.log(`%c step ${stepNumber}`, "color:purple");
    const newHistory = [...history].slice(0, stepNumber + 1);
    console.log(`%c ${JSON.stringify(newHistory)}`, "color:purple");
    newHistory.push(newSquares);
    setHistory(newHistory);
  };

  const restart = () => {
    setHistory([]);
    setStepNumber(0);
    setSquares(emptyBoard);
  };

  const renderSquare = i => (
    <button className="square" onClick={() => selectSquare(i)}>
      {" "}
      {squares[i]}{" "}
    </button>
  );

  const gotoStep = stepNumber => {
    setStepNumber(stepNumber);
    setSquares(history[stepNumber]);
  };

  return (
    <>
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </div>
        <div className="board-row">
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </div>
        <div className="board-row">
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </div>
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <History items={history} gotoStep={gotoStep} />
    </>
  );
}

const History = function History({items, gotoStep}) {
  items = items || [];
  return (
    <div>
      {items.map((_, idx) => (
        <HistoryItem key={idx} stepNumber={idx} gotoStep={gotoStep} />
      ))}
    </div>
  );
};

const HistoryItem = function HistoryItem({stepNumber, gotoStep}) {
  function getText(stepNumber) {
    stepNumber = Number(stepNumber);
    return stepNumber > 0 ? `Go to step ${stepNumber}` : "Go to start";
  }

  return (
    <button
      type="button"
      style={{display: "block"}}
      onClick={() => gotoStep(stepNumber)}
    >
      {getText(stepNumber)}
    </button>
  );
};

const Game = () => (
  <div className="game">
    <div className="game-board">
      <Board />
    </div>
  </div>
);

const calculateStatus = function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`;
};

const calculateNextValue = function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? "X" : "O";
};

const calculateWinner = function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

const App = function App() {
  return <Game />;
};

export default App;
