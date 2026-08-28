#!/usr/bin/env python3
"""Local-only dev server: serves the static site AND proxies /api/standings to
football-data.org, mirroring the Vercel serverless function. The API key is read
from the FOOTBALL_DATA_API_KEY environment variable and is never written to disk.

Usage:
    FOOTBALL_DATA_API_KEY=your_key python3 dev_server.py
then open http://localhost:8899
"""
import http.server, socketserver, json, os, urllib.request, datetime

PORT = int(os.environ.get("PORT", "8899"))
KEY = os.environ.get("FOOTBALL_DATA_API_KEY", "")


class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path.split("?")[0] == "/api/standings":
            return self.standings()
        return super().do_GET()

    def standings(self):
        if not KEY:
            return self._json(500, {"error": "FOOTBALL_DATA_API_KEY not set"})
        try:
            req = urllib.request.Request(
                "https://api.football-data.org/v4/competitions/PL/standings",
                headers={"X-Auth-Token": KEY},
            )
            with urllib.request.urlopen(req, timeout=15) as r:
                data = json.load(r)
        except Exception as e:
            return self._json(502, {"error": "upstream failed", "detail": str(e)[:200]})

        total = next((s for s in data.get("standings", []) if s.get("type") == "TOTAL"), None)
        table = [{
            "position": row["position"],
            "name": row["team"].get("name", ""),
            "shortName": row["team"].get("shortName", ""),
            "tla": row["team"].get("tla", ""),
            "crest": row["team"].get("crest", ""),
            "playedGames": row.get("playedGames"),
            "points": row.get("points"),
        } for row in (total.get("table", []) if total else [])]

        start = (data.get("season") or {}).get("startDate")
        season = ""
        if start:
            y = int(start[:4])
            season = f"{y}/{str(y + 1)[2:]}"
        self._json(200, {
            "competition": (data.get("competition") or {}).get("name", "Premier League"),
            "season": season,
            "matchday": (data.get("season") or {}).get("currentMatchday"),
            "updated": datetime.datetime.utcnow().isoformat() + "Z",
            "table": table,
        })

    def _json(self, code, obj):
        body = json.dumps(obj).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Serving on http://localhost:{PORT}")
        httpd.serve_forever()
