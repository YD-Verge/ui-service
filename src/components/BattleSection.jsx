import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function BattleSection({ playerId }) {
  const [battleResult, setBattleResult] = useState(null);
  const [battleLogs, setBattleLogs] = useState([]);
  const [showBattleLogs, setShowBattleLogs] = useState(false);
  const [allBattles, setAllBattles] = useState([]);
  const [showAllBattles, setShowAllBattles] = useState(false);
  const [totalGold, setTotalGold] = useState(null);

  // Start a battle
  const handleBattle = async () => {
    try {
      const response = await axios.post(
        "http://GuardianBoot:8083/api/battle/start",
        null,
        { params: { playerId } }
      );
      setBattleResult(response.data);
      fetchTotalGold();  // <-- refresh total gold after battle
    } catch (error) {
      console.error(error);
      alert("Failed to start battle!");
    }
  };

  // Fetch player's battle logs
  const handleFetchBattleLogs = async () => {
    try {
      const response = await axios.get(
        `http://GuardianBoot:8083/api/battles/player/${playerId}`
      );
      setBattleLogs(response.data);
      setShowBattleLogs(true);
      fetchTotalGold();  // <-- refresh total gold when viewing logs
    } catch (error) {
      console.error(error);
      alert("Failed to fetch battle logs.");
    }
  };

  // Fetch all battles (any player)
  const handleFetchAllBattles = async () => {
    try {
      const response = await axios.get(
        `http://GuardianBoot:8083/api/battles`
      );
      setAllBattles(response.data);
      setShowAllBattles(true);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch all battles.");
    }
  };

  // Fetch player's total gold
  const fetchTotalGold = async () => {
    try {
      const response = await axios.get(
        `http://GuardianBoot:8083/api/battles/player/gold/${playerId}`
      );
      setTotalGold(response.data);
    } catch (error) {
      console.error("Failed to fetch total gold:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      {/* Start Battle */}
      <button
        onClick={handleBattle}
        className="mt-4 px-4 py-2 bg-red-600 rounded hover:bg-red-800"
      >
        Start Battle
      </button>

      {/* Toggle Player Battle Logs */}
      <button
        onClick={() => {
          if (!showBattleLogs) handleFetchBattleLogs();
          else setShowBattleLogs(false);
        }}
        className="mt-2 px-4 py-2 bg-blue-600 rounded hover:bg-blue-800 ml-2"
      >
        {showBattleLogs ? "Hide Battle History" : "View Battle History"}
      </button>

      {/* Toggle All Battles */}
      <button
        onClick={() => {
          if (!showAllBattles) handleFetchAllBattles();
          else setShowAllBattles(false);
        }}
        className="mt-2 px-4 py-2 bg-green-600 rounded hover:bg-green-800 ml-2"
      >
        {showAllBattles ? "Hide All Battles" : "View All Battles"}
      </button>

      {/* Battle Result */}
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

      {/* Player Battle Logs */}
      {showBattleLogs && (
        <div className="mt-6 p-4 bg-gray-700 rounded max-h-64 overflow-y-auto">
          <h2 className="text-xl font-bold mb-2">Battle History (This Player)</h2>
          {battleLogs.length === 0 ? (
            <p>No battles found for this player.</p>
          ) : (
            <ul className="text-left list-disc list-inside">
              {battleLogs.map((log, index) => (
                <li key={index} className="mb-2">
                  <strong>Result:</strong> {log.result} |{" "}
                  <strong>Gold:</strong> {log.gold}{" "}
                  {log.lootItem && (
                    <>
                      | <strong>Loot:</strong> {log.lootItem} × {log.lootQty}
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Total Gold Display */}
      {totalGold !== null && (
        <div className="mt-4 p-3 bg-yellow-700 rounded text-center">
          <h3 className="text-lg font-semibold">
            Total Gold Earned by Player: {totalGold}
          </h3>
        </div>
      )}

      {/* All Battles */}
      {showAllBattles && (
        <div className="mt-6 p-4 bg-gray-700 rounded max-h-64 overflow-y-auto">
          <h2 className="text-xl font-bold mb-2">All Battles</h2>
          {allBattles.length === 0 ? (
            <p>No battles found.</p>
          ) : (
            <ul className="text-left list-disc list-inside">
              {allBattles.map((log, index) => (
                <li key={index} className="mb-2">
                  <strong>Player:</strong> {log.playerId} |{" "}
                  <strong>Result:</strong> {log.result} |{" "}
                  <strong>Gold:</strong> {log.gold}{" "}
                  {log.lootItem && (
                    <>
                      | <strong>Loot:</strong> {log.lootItem} × {log.lootQty}
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default BattleSection;
