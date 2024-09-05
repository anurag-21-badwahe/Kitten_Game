import { RootState } from "../app/store";
import { useAppSelector } from "../app/hooks";

export default function SidebarComponent() {
  const game = useAppSelector((state: RootState) => state.gameReducer);

  return (
    <div className="lg:w-1/4 w-full h-full flex flex-col items-center justify-center gap-5 p-4 bg-gray-100 shadow-lg rounded-xl">
      {/* Player Stats */}
      <div className="flex flex-col w-full p-6 text-center items-center gap-4 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg shadow-xl">
        <div className="text-4xl font-extrabold">{game.username}'s Stats</div>
        <div className="text-2xl">Games Won: <span className="font-semibold">{game.score}</span></div>
        <div className="text-2xl">Games Lost: <span className="font-semibold">{game.gamesLost}</span></div>
      </div>

      {/* Leaderboard */}
      <div className="flex flex-col w-full p-6 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg shadow-xl">
        <p className="text-3xl font-bold pb-4">Leaderboard</p>
        {game.leaderboard.map((user, index) => (
          <div
            className="flex justify-between items-center p-4 my-2 bg-blue-100 rounded-md text-blue-900 font-medium shadow-inner"
            key={index}
          >
            <p>{index + 1}. {user.username}</p>
            <p>{user.score}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
