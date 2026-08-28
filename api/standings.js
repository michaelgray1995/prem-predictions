 // Vercel serverless function: fetches the live Premier League table from
// football-data.org and returns a slim, normalised payload.
export default async function handler(req, res) {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Server missing FOOTBALL_DATA_API_KEY env var." });
    return;
  }

  try {
    const r = await fetch("https://api.football-data.org/v4/competitions/PL/standings", {
      headers: { "X-Auth-Token": apiKey },
    });

    if (!r.ok) {
      const text = await r.text();
      res.status(r.status).json({ error: `Upstream error ${r.status}`, detail: text.slice(0, 300) });
      return;
    }

    const data = await r.json();
    const total = (data.standings || []).find((s) => s.type === "TOTAL") || (data.standings || [])[0];
    const table = (total?.table || []).map((row) => ({
      position: row.position,
      name: row.team?.name ?? "",
      shortName: row.team?.shortName ?? "",
      tla: row.team?.tla ?? "",
      crest: row.team?.crest ?? "",
      playedGames: row.playedGames,
      points: row.points,
    }));

    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=120");
    res.status(200).json({
      competition: data.competition?.name ?? "Premier League",
      season: data.season?.startDate ? `${new Date(data.season.startDate).getFullYear()}/${String((new Date(data.season.startDate).getFullYear() + 1)).slice(2)}` : "",
      matchday: data.season?.currentMatchday ?? null,
      updated: new Date().toISOString(),
      table,
    });
  } catch (err) {
    res.status(502).json({ error: "Failed to reach football-data.org", detail: String(err).slice(0, 300) });
  }
}
