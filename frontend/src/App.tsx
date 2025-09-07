import React, { useState, useEffect, useMemo } from "react";
import "./App.css";
import { GameState } from "./types";
import BoardAndDisplay from "./components/BoardAndDisplay/BoardAndDisplay";
import { io, Socket } from "socket.io-client";

function App() {
  const [respondFormServer, setRespondFormServer] = useState<GameState>();
  const [error, setError] = useState<string>("");

  const socket: Socket = useMemo(() => {
    return io("http://localhost:3000", { transports: ["websocket"] });
  }, []);

  useEffect(() => {
    socket.on("state", (game: GameState) => {
      setRespondFormServer(game);
    });

    return () => {
      socket.off("state", () => {
        console.log("disconnected");
      });
    };
  }, [socket]);

  const handleCellClick = async (rowIndex: number, colIndex: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/multisession/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ row: rowIndex, col: colIndex }),
      });
      const data = await response.json();
      setRespondFormServer(data.game);
    } catch (err) {
      setError(err as string);
    }
  };

  const handleGameOver = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/multisession ", {
        method: "POST",
      });
      const data = await response.json();
      setRespondFormServer(data.game);
    } catch (err) {
      setError(err as string);
    }
  };

  useEffect(() => {
    const fetchHelloWorld = async () => {
      try {
        const ifGameExists = await fetch(
          "http://localhost:3000/api/multisession ",
          { method: "GET" }
        );
        if (ifGameExists.status === 200) {
          const data = await ifGameExists.json();
          setRespondFormServer(data?.game);
        } else {
          const response = await fetch(
            "http://localhost:3000/api/multisession ",
            { method: "POST" }
          );
          const data = await response.json();
          setRespondFormServer(data.game);
        }
      } catch (err) {
        setError(
          "Could not connect to server. Make sure the backend is running on port 3000."
        );
      }
    };

    fetchHelloWorld();
  }, []);

  return (
    <div className="App">
      {error ? (
        <h1>{error}</h1>
      ) : (
        <>
          <header className="App-header">
            <h1>Welcome to Multisession Game</h1>
          </header>
          <main className="App-main">
            <BoardAndDisplay
              board={respondFormServer?.board ?? []}
              score={respondFormServer?.score ?? 0}
              gameOver={respondFormServer?.gameOver ?? false}
              handleCellClick={handleCellClick}
              handleGameOver={handleGameOver}
            />
          </main>
        </>
      )}
    </div>
  );
}

export default App;
