import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Die from "./Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import useWindowSize from "./hooks/useWindowSize.JSX";
import HighScore from "./highScore";
import { useTimer } from "./context/timer";

export default function App() {
  const { formatTime, start, stop, reset, elapsedTime } = useTimer();
  const { width, height } = useWindowSize();
  const [dice, setDice] = useState(() => generateAllNewDice());
  const buttonRef = useRef(null);
  const [highScore, setHighScore] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("highscore") || null);
    } catch {
      return null;
    }
  });

  const gameWon =
    dice.every((die) => die.isHeld) &&
    dice.every((die) => die.value === dice[0].value);

  useEffect(() => {
    if (gameWon) {
      stop();
      buttonRef.current.focus();

      if (!highScore || elapsedTime < highScore) {
        setHighScore(elapsedTime);
        localStorage.setItem("highscore", JSON.stringify(elapsedTime));
      }
    }

  }, [gameWon, highScore]);

  function generateAllNewDice() {
    const NUM_DICE = 10;
    const MAX_DIE_VALUE = 6;
    return new Array(NUM_DICE).fill(0).map(() => ({
      value: Math.ceil(Math.random() * MAX_DIE_VALUE),
      isHeld: false,
      id: nanoid(),
    }));
  }

  function rollDice() {
    if (!gameWon) {
      start();
      setDice((oldDice) =>
        oldDice.map((die) =>
          die.isHeld ? die : { ...die, value: Math.ceil(Math.random() * 6) }
        )
      );
    } else {
      setDice(generateAllNewDice());
      reset();
    }
  }

  function hold(id) {
    setDice((oldDice) =>
      oldDice.map((die) =>
        die.id === id ? { ...die, isHeld: !die.isHeld } : die
      )
    );
  }

  const diceElements = useMemo(() =>
    dice.map((dieObj) => (
      <Die
        key={dieObj.id}
        value={dieObj.value}
        isHeld={dieObj.isHeld}
        hold={() => hold(dieObj.id)}
      />
    ))
  );

  return (
    <main>
      {gameWon && <Confetti width={width} height={height} />}
      <div aria-live="polite" className="sr-only">
        {gameWon && (
          <p>Congratulations! You won! Press "New Game" to start again.</p>
        )}
      </div>
      <h1 className="title">Tenzies</h1>
      <HighScore
        Hscore={highScore !== null ? formatTime(highScore) : "N/A"}
        score={formatTime(elapsedTime)}
      />
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice-container">{diceElements}</div>
      <button
        ref={buttonRef}
        className="roll-dice"
        onClick={rollDice}
        aria-label={gameWon ? "Start a new game" : "Roll the dice"}
      >
        {gameWon ? "New Game" : "Roll"}
      </button>
    </main>
  );
}
