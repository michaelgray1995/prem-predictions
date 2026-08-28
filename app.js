import { TEAMS, PREDICTIONS, toTeamId } from "./data.js";

const REFRESH_MS = 60_000;
const $ = (sel) => document.querySelector(sel);

// FAKE placeholder table for the ?demo preview only. This is NOT a real table
// (past or present) — it just lets you see the layout without a key. The live
// site ignores this entirely and pulls the real current 2026/27 standings.
const DEMO_ORDER = [
  "hull","coventry","ipswich","sunderland","fulham","crystal-palace","leeds",
  "everton","bournemouth","brentford","brighton","forest","newcastle","aston-villa",
  "spurs","man-utd","chelsea","man-city","liverpool","arsenal",
];

function crestFor(id) {
  return "";
}

async function loadActual() {
  const params = new URLSearchParams(location.search);
  if (params.has("demo")) {
    return {
      season: "2026/27 (demo)",
      matchday: 3,
      updated: new Date().toISOString(),
      demo: true,
      table: DEMO_ORDER.map((id, i) => ({
        position: i + 1,
        name: TEAMS[id].name,
        id,
        crest: "",
        playedGames: 3,
        points: 20 - i,
      })),
    };
  }

  const res = await fetch("/api/standings", { cache: "no-store" });
  if (!res.ok) {
    let msg = `API error ${res.status}`;
    try { const j = await res.json(); if (j.error) msg = j.error; } catch {}
    throw new Error(msg);
  }
  const data = await res.json();
  data.table = data.table.map((row) => ({
    ...row,
    id: toTeamId(row.name) || toTeamId(row.shortName) || toTeamId(row.tla),
  }));
  return data;
}

// Map canonical id -> actual position (or null if the team isn't in the live table)
function actualPositionMap(actual) {
  const m = new Map();
  for (const row of actual.table) {
    if (row.id) m.set(row.id, row.position);
  }
  return m;
}

function scoreFor(order, posMap) {
  let pts = 0;
  const marks = order.map((id, i) => {
    const predictedPos = i + 1;
    const actualPos = posMap.get(id) ?? null;
    const correct = actualPos === predictedPos;
    if (correct) pts++;
    return { id, predictedPos, actualPos, correct };
  });
  return { pts, marks };
}

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

function renderActualBoard(actual, container) {
  const board = el("div", "board actual");
  const head = el("div", "board-head");
  head.append(el("div", "who", "🟦 Live Table"));
  const md = actual.matchday ? `MD ${actual.matchday}` : "";
  head.append(el("div", "pts", md));
  board.append(head);

  for (const row of actual.table) {
    const r = el("div", "row");
    r.append(el("div", "pos", row.position));
    const crest = el("img", "crest");
    if (row.crest) { crest.src = row.crest; crest.alt = ""; crest.loading = "lazy"; }
    r.append(crest);
    r.append(el("div", "tname", row.id ? TEAMS[row.id].name : row.name));
    r.append(el("div", "pts-val", row.points != null ? `${row.points} pts` : ""));
    board.append(r);
  }
  container.append(board);
}

function renderPredictionBoard(pred, score, actual, container) {
  const board = el("div", "board");
  const head = el("div", "board-head");
  head.append(el("div", "who", pred.name));
  const pts = el("div", "pts");
  pts.append(el("b", null, score.pts));
  pts.append(document.createTextNode(` / 20`));
  head.append(pts);
  board.append(head);

  for (const mark of score.marks) {
    const r = el("div", "row " + (mark.correct ? "correct" : "wrong"));
    r.append(el("div", "pos", mark.predictedPos));
    r.append(el("div", "crest"));
    r.append(el("div", "tname", TEAMS[mark.id].name));
    if (mark.correct) {
      r.append(el("div", "mark", "✓"));
    } else if (mark.actualPos == null) {
      r.append(el("div", "delta", "—"));
    } else {
          const diff = mark.actualPos - mark.predictedPos;
      const down = diff > 0;
      r.append(el("div", "delta " + (down ? "down" : "up"), (down ? "↓" : "↑") + Math.abs(diff)));
    }
    board.append(r);
  }
  container.append(board);
}

function renderLeaderboard(scored, container) {
  container.innerHTML = "";
  const sorted = [...scored].sort((a, b) => b.pts - a.pts || a.name.localeCompare(b.name));
  let lastPts = null, lastRank = 0;
  sorted.forEach((s, i) => {
    const rank = s.pts === lastPts ? lastRank : i + 1;
    lastPts = s.pts; lastRank = rank;
    const card = el("div", "lb-card" + (rank === 1 ? " rank-1" : ""));
    card.append(el("div", "lb-rank", rank === 1 ? "🏆" : rank));
    card.append(el("div", "lb-name", s.name));
    const sc = el("div", "lb-score");
    sc.append(el("b", null, s.pts));
    sc.append(el("span", null, "correct"));
    card.append(sc);
    container.append(card);
  });
}

function setStatus(state, text) {
  const dot = $("#status .dot");
  dot.className = "dot" + (state === "ok" ? "" : " " + state);
  $("#status-text").textContent = text;
}

async function tick() {
  try {
    const actual = await loadActual();
    const posMap = actualPositionMap(actual);

    const scored = PREDICTIONS.map((p) => {
      const { pts, marks } = scoreFor(p.order, posMap);
      return { name: p.name, pts, marks, pred: p };
    });

    renderLeaderboard(scored, $("#leaderboard"));

    const boards = $("#boards");
    boards.innerHTML = "";
    renderActualBoard(actual, boards);
    for (const s of scored) renderPredictionBoard(s.pred, s, actual, boards);

    $("#season").textContent = actual.season || "";
    const t = new Date(actual.updated || Date.now());
    setStatus(actual.demo ? "stale" : "ok",
      `${actual.demo ? "FAKE SAMPLE DATA (not a real table) · " : "Live 2026/27 · "}updated ${t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`);
    $("#error").hidden = true;
  } catch (err) {
    setStatus("err", "Update failed — retrying");
    const e = $("#error");
    e.hidden = false;
    e.textContent = `Couldn't load the live table: ${err.message}. Retrying every 60s. (Add ?demo to the URL to preview with sample data.)`;
  }
}

tick();
setInterval(tick, REFRESH_MS);
