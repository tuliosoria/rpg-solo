"use client";
import React, { useEffect, useMemo, useState } from "react";

type Story = {
  title: string;
  startNode: string;
  nodes: Record<string, any>;
};

export default function Editor({ onExitToMenuAction }: { onExitToMenuAction: () => void }) {
  const [chapter, setChapter] = useState<number>(() => {
    const last = typeof window !== "undefined" ? localStorage.getItem("rpgsolo_editor_lastChapter") : null;
    return last ? parseInt(last, 10) : 1;
  });
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string>("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    loadChapter(chapter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapter]);

  async function loadChapter(n: number) {
    setLoading(true);
    try {
      let data: Story | null = null;
      try {
        const res = await fetch(`/api/story/${n}?ts=${Date.now()}`, { cache: "no-store" });
        if (res.ok) data = (await res.json()) as Story;
      } catch {}
      if (!data) {
        const res2 = await fetch(`/chapter${n}.json?ts=${Date.now()}`, { cache: "no-store" });
        data = (await res2.json()) as Story;
      }
      if (!data) throw new Error("Capítulo não encontrado");
      setStory(data);
      const firstId = (data.startNode as string) || Object.keys(data.nodes || {})[0] || "";
      setSelectedNodeId(firstId);
      localStorage.setItem("rpgsolo_editor_lastChapter", String(n));
    } catch (e) {
      console.error(e);
      alert("Falha ao carregar capítulo.");
    } finally {
      setLoading(false);
    }
  }

  function updateNodeField(nodeId: string, field: string, value: any) {
    if (!story) return;
    setStory({ ...story, nodes: { ...story.nodes, [nodeId]: { ...story.nodes[nodeId], [field]: value } } });
  }

  function updateChoice(nodeId: string, idx: number, field: string, value: any) {
    if (!story) return;
    const node = story.nodes[nodeId] || {};
    const choices = Array.isArray(node.choices) ? [...node.choices] : [];
    choices[idx] = { ...(choices[idx] || {}), [field]: value };
    setStory({ ...story, nodes: { ...story.nodes, [nodeId]: { ...node, choices } } });
  }

  function addChoice(nodeId: string) {
    if (!story) return;
    const node = story.nodes[nodeId] || {};
    const choices = Array.isArray(node.choices) ? [...node.choices] : [];
    choices.push({ id: `choice_${Date.now()}`, text: "Nova escolha", nextNode: "" });
    setStory({ ...story, nodes: { ...story.nodes, [nodeId]: { ...node, choices } } });
  }

  function addNode() {
    if (!story) return;
    const newId = prompt("ID do novo node (ex: chapter" + chapter + "_novo)");
    if (!newId) return;
    if (story.nodes[newId]) {
      alert("ID já existe");
      return;
    }
    const newNode = { id: newId, chapter, title: "Novo Título", text: "", choices: [] };
    setStory({ ...story, nodes: { ...story.nodes, [newId]: newNode } });
    setSelectedNodeId(newId);
  }

  function deleteNode(nodeId: string) {
    if (!story) return;
    if (!confirm("Excluir node?")) return;
    const nodes = { ...story.nodes };
    delete nodes[nodeId];
    setStory({ ...story, nodes });
    const next = (story.startNode && nodes[story.startNode]) ? story.startNode : Object.keys(nodes)[0] || "";
    setSelectedNodeId(next);
  }

  async function saveToFile() {
    if (!story) return;
    try {
      const res = await fetch(`/api/story/${chapter}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(story, null, 2),
      });
      if (!res.ok) throw new Error(await res.text());
      alert(`Salvo no arquivo (public/chapter${chapter}.json)`);
    } catch (e) {
      console.error(e);
      alert("Falha ao salvar no arquivo. Você pode baixar o JSON.");
    }
  }

  function downloadJSON() {
    if (!story) return;
    const blob = new Blob([JSON.stringify(story, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chapter${chapter}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function saveToLocal() {
    if (!story) return;
    localStorage.setItem(`rpgsolo_editor_chapter${chapter}`, JSON.stringify(story));
    alert("Salvo no navegador.");
  }

  function loadFromLocal() {
    const raw = localStorage.getItem(`rpgsolo_editor_chapter${chapter}`);
    if (raw) setStory(JSON.parse(raw));
    else alert("Nada salvo no navegador para este capítulo.");
  }

  const nodesList = useMemo(() => {
    if (!story) return [] as [string, any][];
    const entries = Object.entries(story.nodes) as [string, any][];
    const f = filter.trim().toLowerCase();
    return entries.filter(([id, n]) => !f || id.toLowerCase().includes(f) || (n.title || "").toLowerCase().includes(f) || (n.text || "").toLowerCase().includes(f));
  }, [story, filter]);

  const node = story && selectedNodeId ? story.nodes[selectedNodeId] : null;

  return (
    <div style={{ minHeight: "100vh", background: "#0b0b0b", color: "#dfffdc", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: "1px solid #145214", background: "#001800" }}>
        <button onClick={onExitToMenuAction} style={{ background: "#0d2", border: "1px solid #0f5", color: "#032", padding: "8px 12px", borderRadius: 6, fontWeight: 700, cursor: "pointer" }}>⬅ Menu</button>
        <div style={{ fontWeight: 800, letterSpacing: 1 }}>Editor da História</div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <select value={chapter} onChange={(e) => setChapter(parseInt(e.target.value, 10))} style={{ background: "#0d2", color: "#021", border: "1px solid #1f6", borderRadius: 6, padding: "6px 8px" }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                Capítulo {n}
              </option>
            ))}
          </select>
          <button onClick={() => loadChapter(chapter)} style={btnStyle}>Recarregar</button>
          <button onClick={saveToFile} style={btnStyle}>Salvar no arquivo</button>
          <button onClick={downloadJSON} style={btnStyle}>Baixar JSON</button>
          <button onClick={saveToLocal} style={btnStyle}>Salvar no navegador</button>
          <button onClick={loadFromLocal} style={btnStyle}>Carregar do navegador</button>
        </div>
      </div>

      <div style={{ padding: 12, borderBottom: "1px dashed #145214", background: "#001200" }}>
        {story && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 12 }}>
            <div>
              <label>Título do Capítulo</label>
              <input value={story.title || ""} onChange={(e) => setStory({ ...(story as Story), title: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label>startNode</label>
              <input value={story.startNode || ""} onChange={(e) => setStory({ ...(story as Story), startNode: e.target.value })} style={inputStyle} />
            </div>
          </div>
        )}
      </div>

      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "320px 1fr", gap: 12, padding: 12 }}>
        <div style={{ borderRight: "1px dashed #145214", paddingRight: 12 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input
              placeholder="Buscar node..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ flex: 1, padding: "8px 10px", borderRadius: 6, border: "1px solid #1f6", background: "#001800", color: "#dfffdc" }}
            />
            <button onClick={addNode} style={btnStyle}>+ Node</button>
          </div>
          <div style={{ maxHeight: "calc(100vh - 260px)", overflow: "auto" }}>
            {loading && <div>Carregando...</div>}
            {!loading && nodesList.map(([id, n]) => (
              <div key={id} onClick={() => setSelectedNodeId(id)} style={{ padding: "8px 6px", borderRadius: 6, cursor: "pointer", background: selectedNodeId === id ? "rgba(0,255,128,0.15)" : "transparent" }}>
                <div style={{ fontFamily: "monospace", fontSize: 12, color: "#8f8" }}>{id}</div>
                <div style={{ fontWeight: 600 }}>{n.title || "(sem título)"}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ paddingLeft: 8 }}>
          {!node && <div>Selecione um node…</div>}
          {node && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 12 }}>
                <div>
                  <label>Título</label>
                  <input value={node.title || ""} onChange={(e) => updateNodeField(node.id, "title", e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label>Imagem (arquivo em /public)</label>
                  <input value={node.image || ""} onChange={(e) => updateNodeField(node.id, "image", e.target.value)} style={inputStyle} />
                </div>
              </div>

              <div>
                <label>Texto</label>
                <textarea value={node.text || ""} onChange={(e) => updateNodeField(node.id, "text", e.target.value)} style={{ ...inputStyle, minHeight: 220, fontFamily: "inherit", whiteSpace: "pre-wrap" }} />
              </div>

              <div>
                <label>Choices</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {(node.choices || []).map((c: any, i: number) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 160px", gap: 8, alignItems: "center" }}>
                      <input placeholder="id" value={c.id || ""} onChange={(e) => updateChoice(node.id, i, "id", e.target.value)} style={inputStyle} />
                      <input placeholder="texto" value={c.text || ""} onChange={(e) => updateChoice(node.id, i, "text", e.target.value)} style={inputStyle} />
                      <input placeholder="nextNode" value={c.nextNode || ""} onChange={(e) => updateChoice(node.id, i, "nextNode", e.target.value)} style={inputStyle} />
                    </div>
                  ))}
                </div>
                <button onClick={() => addChoice(node.id)} style={btnStyle}>+ Choice</button>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => updateNodeField(node.id, "choices", [])} style={btnStyle}>Zerar Choices</button>
                <button onClick={() => deleteNode(node.id)} style={{ ...btnStyle, borderColor: "#f66", color: "#fbb", background: "rgba(255,64,64,0.1)" }}>Excluir Node</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, rgba(0,255,0,0.10), rgba(0,255,128,0.18))",
  border: "1px solid #1f6",
  color: "#e6ffe6",
  padding: "8px 12px",
  borderRadius: 6,
  cursor: "pointer",
  fontFamily: "inherit",
};

const inputStyle: React.CSSProperties = {
  background: "#001800",
  color: "#dfffdc",
  border: "1px solid #1f6",
  padding: "8px 10px",
  borderRadius: 6,
  width: "100%",
};
