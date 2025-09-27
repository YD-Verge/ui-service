import React, { useState } from "react";
import PlayerSelect from "./components/PlayerSelect";
import BattleSection from "./components/BattleSection"; // <-- import here
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [player, setPlayer] = useState(null);
  const [playerId, setPlayerId] = useState("");

  // ✅ Create Player
  const handleSelect = async (roleName) => {
    if (!playerId) {
      alert("Please enter a Player ID!");
      return;
    }

    try {
      const response = await axios.post(
        "http://192.168.0.101:8081/api/player/create",
        { id: playerId, playerRole: roleName }
      );
      console.log(response.data);
      setPlayer(response.data);
    } catch (err) {
      console.error(err);
      alert("Failed to create player. Is backend running?");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <AnimatePresence mode="wait">
        {!player ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center gap-6"
          >
            <div>
              <label className="text-lg mr-2">Enter Player ID:</label>
              <input
                type="text"
                value={playerId}
                onChange={(e) => setPlayerId(e.target.value)}
                className="px-2 py-1 text-black rounded"
                placeholder="e.g., hero123"
              />
            </div>
            <PlayerSelect onSelect={handleSelect} />
          </motion.div>
        ) : (
          <motion.div
            key="player"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold mb-4">
              Welcome, {playerId} the {player.playerRole.description}!
            </h1>
            <p className="text-lg">Level: {player.level}</p>
            <p className="text-lg">HP: {player.playerRole.stats.HP}</p>
            <p className="text-lg">Strength: {player.playerRole.stats.STR}</p>
            <p className="text-lg">Defense: {player.playerRole.stats.DEF}</p>
            <p className="text-lg">Intelligence: {player.playerRole.stats.INT}</p>
            <p className="text-lg">Gold: {player.gold}</p>

            {/* Render BattleSection and pass playerId */}
            <BattleSection playerId={playerId} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
