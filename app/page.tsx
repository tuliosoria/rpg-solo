"use client";
import React, { useEffect, useState } from "react";
import RpgSolo from "./RpgSolo";

type SavedGame = {
  version: number;
  timestamp: number;
  chapter: number;
  current: string;
  gameState: any;
  gameStats: any;
  isGameOver?: boolean;
  gameOverReason?: string;
  title?: string;
};

export default function Home() {
  const [view, setView] = useState<"menu" | "game">("menu");
  const [save, setSave] = useState<SavedGame | null>(null);
  const [activeInitialLoad, setActiveInitialLoad] = useState<SavedGame | undefined>(undefined);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("rpgsolo_save_v1");
      if (raw) setSave(JSON.parse(raw));
      else setSave(null);
    } catch {
      setSave(null);
    }
  }, [view]);

  if (view === "menu") {
    return (
      <main>
        <div
          style={{
            minHeight: "100vh",
            background: "#000000",
            color: "#00ff00",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Courier New, Monaco, monospace",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* scanlines */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.04) 2px, rgba(0,255,0,0.04) 4px)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              border: "1px solid #00ff00",
              borderRadius: 8,
              padding: "40px 30px",
              width: "95%",
              maxWidth: 520,
              textAlign: "center",
              background: "rgba(0, 20, 0, 0.6)",
              boxShadow: "0 0 25px rgba(0,255,0,0.15)",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div style={{ fontSize: 28, fontWeight: "bold", marginBottom: 10 }}>
              ▮ RPG SOLO TERMINAL
            </div>
            <div style={{ color: "#9f9", fontSize: 14, marginBottom: 30 }}>
              {save?.title || "Capítulo 1 — O Sinal"}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <button
                onClick={() => {
                  setActiveInitialLoad(undefined); // new game
                  setView("game");
                }}
                style={{
                  background: "linear-gradient(135deg, rgba(0,255,0,0.15), rgba(0,255,128,0.25))",
                  border: "1px solid #00ff88",
                  color: "#e6ffe6",
                  padding: "14px 26px",
                  borderRadius: 8,
                  fontSize: 18,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,255,136,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                ▶ Play
              </button>

              <button
                disabled={!save}
                onClick={() => {
                  if (!save) return;
                  setActiveInitialLoad(save);
                  setView("game");
                }}
                style={{
                  background: save
                    ? "linear-gradient(135deg, rgba(0,255,0,0.08), rgba(0,255,128,0.18))"
                    : "rgba(255,255,255,0.05)",
                  border: save ? "1px solid #00ff88" : "1px solid #333",
                  color: save ? "#e6ffe6" : "#777",
                  padding: "12px 22px",
                  borderRadius: 8,
                  fontSize: 16,
                  cursor: save ? "pointer" : "not-allowed",
                  fontFamily: "inherit",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  if (!save) return;
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,255,136,0.12)";
                }}
                onMouseLeave={(e) => {
                  if (!save) return;
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                💾 Load
              </button>

              {save && (
                <div style={{ color: "#8f8", fontSize: 12, marginTop: 4 }}>
                  Saved on {new Date(save.timestamp).toLocaleString()} — Chapter {save.chapter}
                </div>
              )}
            </div>

            <div style={{ marginTop: 25, color: "#7f7", fontSize: 12 }}>
              Use o botão Menu dentro do jogo para salvar e voltar.
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <RpgSolo
        onExitToMenu={() => setView("menu")}
        initialLoad={activeInitialLoad}
      />
    </main>
  );
}