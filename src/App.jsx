import React, { useState } from "react";
import PlayerSelect from "./components/PlayerSelect";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [player, setPlayer] = useState(null);
  const [playerId, setPlayerId] = useState("");
  const [battleResult, setBattleResult] = useState(null);

  // ✅ Create Player
  const handleSelect = async (roleName) => {
    if (!playerId) {
      alert("Please enter a Player ID!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/player/create",
        { id: playerId, playerRole: roleName }  
      );
      console.log(response.data);
      
      setPlayer(response.data);
    } catch (err) {
      console.error(err);
      alert("Failed to create player. Is backend running?");
    }
  };

  // Battle trigger
  const handleBattle = async (enemyId) => {
    try {
      const response = await axios.post(
        "http://localhost:8083/api/battle/start",
        { params: { playerId: playerId } }
      );
      setBattleResult(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to start battle!");
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
            <PlayerSelect onSelect={handleSelect} />  {/* ✅ Passing roleName */}
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
              Welcome, {player.name} the {player.playerRole.description}!
            </h1>
            <p className="text-lg">Level: {player.level}</p>
            <p className="text-lg">HP: {player.playerRole.stats.HP}</p>
            <p className="text-lg">Strength: {player.playerRole.stats.STR}</p>
            <p className="text-lg">Defense: {player.playerRole.stats.DEF}</p>
            <p className="text-lg">Intelligence: {player.playerRole.stats.INT}</p>
            <p className="text-lg">Gold: {player.gold}</p>

            <button
              onClick={() => handleBattle("goblin01")}
              className="mt-4 px-4 py-2 bg-red-600 rounded hover:bg-red-800"
            >
              Start Battle
            </button>

            {battleResult && (
              <div className="mt-6 p-4 bg-gray-800 rounded">
                <h2 className="text-xl font-bold">{battleResult.result}</h2>
                <p>Gold Earned: {battleResult.gold}</p>
                {battleResult.lootItem && (
                  <p>
                    Loot: {battleResult.lootItem} × {battleResult.lootQty}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
