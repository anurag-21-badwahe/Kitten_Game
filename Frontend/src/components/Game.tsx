import { useDispatch, useSelector } from "react-redux";
import store, { RootState } from "../app/store";
import {
  drawCard,
  gameOver,
  getLeaderboard,
  restartGame,
  revealCard,
  updateScore,
  getScore,
  setUsername,
} from "../app/gameSlice";
import { cn } from "../utils/utils";
import SidebarComponent from "./SidebarComponent";
import { Modal } from "flowbite-react";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";

export default function Game() {
  const dispatch = useAppDispatch();
  const game = useAppSelector((state: RootState) => state.gameReducer);

  const revealCardLocal = (index: number) => {
    dispatch(revealCard({ index: index }));

    setTimeout(() => {
      dispatch(drawCard({ cardType: game.deck[index], index: index }));
    }, 800);

    if (game.gameOver) {
      dispatch(gameOver());
    }
  };

  useEffect(() => {
    if (game.gameWon) {
      const user = { username: game.username, score: game.score };
      store.dispatch(updateScore(user));
      store.dispatch(getLeaderboard());
    }
  }, [game.gameWon]);

  const handleRestartGame = () => {
    dispatch(restartGame());
  };

  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (game.username === "") {
      setOpenModal(true);
    } else {
      const user = { username: game.username, score: game.score };

      store.dispatch(getLeaderboard());
      store.dispatch(getScore(user));
    }
  }, [openModal]);

  function onCloseModal() {
    if (game.username !== "") {
      setOpenModal(false);
    }
  }

  const onChange = (text: string) => {
    dispatch(setUsername({ name: text }));
  };

  const [showHowTo, setShowHowTo] = useState(false);

  return (
    <div className="flex lg:flex-row flex-col h-screen w-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white">
      {/* Modal for username input */}
      <div className="flex flex-col items-center justify-center content-center">
        <Modal
          show={openModal}
          size="md"
          onClose={onCloseModal}
          popup
          className="backdrop-blur-lg bg-white bg-opacity-30 text-black rounded-xl shadow-lg"
        >
          <Modal.Body>
            <div className="flex flex-col items-center justify-center content-center gap-5 m-auto">
              <input
                className="lg:w-2/3 w-full p-4 text-lg rounded-full border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Enter your name"
                type="text"
                value={game.username}
                onChange={(event) => onChange(event.target.value)}
                required
              />
              <button
                className="py-3 px-6 bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold rounded-full shadow-lg hover:from-green-500 hover:to-green-700 transition"
                onClick={onCloseModal}
              >
                Start Game
              </button>
            </div>
          </Modal.Body>
        </Modal>
      </div>

      {/* Main Game Section */}
      <div className="lg:w-3/4 w-full h-full flex flex-col items-center justify-center gap-8 p-8">
        <h1 className="text-5xl font-extrabold mb-6 tracking-wide">
          Exploding Kittens Game
        </h1>

        <div className="flex flex-wrap justify-center gap-6">
          {game.deck &&
            game.deck.map((card, index) => (
              <div
                className={cn(
                  "group lg:h-40 lg:w-40 w-28 h-28 [perspective:1000px] rounded-lg",
                  game.gameOver || game.gameWon ? "pointer-events-none" : "pointer-events-auto"
                )}
                key={index}
              >
                <div
                  className={cn(
                    "relative h-full w-full shadow-2xl transition-all duration-500 rounded-lg [transform-style:preserve-3d]",
                    game.deckRevealed[index] ? "[transform:rotateY(180deg)]" : ""
                  )}
                >
                  <div
                    className="absolute inset-0 bg-gray-800 bg-opacity-60 rounded-lg flex items-center justify-center cursor-pointer"
                    onClick={() => revealCardLocal(index)}
                  ></div>
                  <div className="absolute inset-0 h-full w-full [transform:rotateY(180deg)] [backface-visibility:hidden] flex items-center justify-center bg-green-500 rounded-lg">
                    <p className="text-white text-6xl font-bold">
                      {game.deckRevealed[index] ? card : ""}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>

        <button
          className="py-3 px-6 bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold rounded-full shadow-xl hover:from-blue-500 hover:to-blue-700 transition"
          onClick={handleRestartGame}
        >
          {game.deck.length === 5 && !game.gameOver
            ? "Start clicking cards!"
            : "Restart Game"}
        </button>

        {game.diffuserDiscovered && (
          <p className="text-2xl font-bold text-green-300 mt-4">
            You found a bomb diffuser! 🙅‍♂️
          </p>
        )}

        {game.gameOver && (
          <p className="text-4xl font-bold text-red-600 mt-4">Game Over!</p>
        )}

        {game.gameWon && (
          <p className="text-4xl font-bold text-green-400 mt-4">You Won!</p>
        )}

<div className="flex content-center flex-col">
  <p
    className="text-center bg-green-700 rounded-lg p-3 select-none w-fit self-center drop-shadow-xl cursor-pointer"
    onClick={() => {
      setShowHowTo(!showHowTo);
    }}
  >
    How to Play!
  </p>
  <ul
    className={cn(
      "border p-4 rounded-lg m-4 max-w-full lg:max-w-lg overflow-y-auto", // added max-width and overflow
      showHowTo ? "visible" : "hidden"
    )}
    style={{ maxHeight: "200px" }} // Limit height and enable scroll
  >
    <li>Click on any of the cards and it will be revealed</li>
    <li>If the card is:</li>
    <li>😼 It will be removed from the deck</li>
    <li>💣 You lose, restart the game</li>
    <li>🙅‍♂️ If found before the bomb, you win</li>
    <li>🔀 Resets the game</li>
  </ul>
</div>

      </div>

      <SidebarComponent />
    </div>
  );
}
