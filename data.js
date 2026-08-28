// ---------------------------------------------------------------------------
// Canonical team list for the 2026/27 prediction game.
// Every predictor's list and the live API feed are normalised to these ids.
// ---------------------------------------------------------------------------
export const TEAMS = {
  "arsenal":        { name: "Arsenal" },
  "man-city":       { name: "Manchester City" },
  "chelsea":        { name: "Chelsea" },
  "man-utd":        { name: "Manchester United" },
  "liverpool":      { name: "Liverpool" },
  "aston-villa":    { name: "Aston Villa" },
  "spurs":          { name: "Tottenham Hotspur" },
  "newcastle":      { name: "Newcastle United" },
  "brighton":       { name: "Brighton" },
  "brentford":      { name: "Brentford" },
  "crystal-palace": { name: "Crystal Palace" },
  "everton":        { name: "Everton" },
  "bournemouth":    { name: "Bournemouth" },
  "forest":         { name: "Nottingham Forest" },
  "leeds":          { name: "Leeds United" },
  "fulham":         { name: "Fulham" },
  "sunderland":     { name: "Sunderland" },
  "ipswich":        { name: "Ipswich Town" },
  "coventry":       { name: "Coventry City" },
  "hull":           { name: "Hull City" },
};

// Alias -> canonical id. Keys are compared lower-cased and trimmed.
// Covers every spelling used across the WhatsApp / Notes screenshots AND the
// full names the football-data.org API returns (e.g. "Arsenal FC").
export const ALIASES = {
  "arsenal": "arsenal", "arsenal fc": "arsenal",
  "manchester city": "man-city", "man city": "man-city", "city": "man-city", "manchester city fc": "man-city", "man city fc": "man-city",
  "chelsea": "chelsea", "chelsea fc": "chelsea",
  "manchester united": "man-utd", "man united": "man-utd", "man utd": "man-utd", "united": "man-utd", "manchester united fc": "man-utd",
  "liverpool": "liverpool", "liverpool fc": "liverpool",
  "aston villa": "aston-villa", "villa": "aston-villa", "aston villa fc": "aston-villa",
  "tottenham hotspur": "spurs", "tottenham": "spurs", "spurs": "spurs", "tottenham hotspur fc": "spurs",
  "newcastle united": "newcastle", "newcastle": "newcastle", "newcastle united fc": "newcastle",
  "brighton": "brighton", "brighton & hove albion": "brighton", "brighton & hove albion fc": "brighton", "brighton and hove albion": "brighton",
  "brentford": "brentford", "brentford fc": "brentford",
  "crystal palace": "crystal-palace", "palace": "crystal-palace", "crystal palace fc": "crystal-palace",
  "everton": "everton", "everton fc": "everton",
  "bournemouth": "bournemouth", "afc bournemouth": "bournemouth",
  "nottingham forest": "forest", "nottingham forrest": "forest", "nottingham": "forest", "forest": "forest", "forrest": "forest", "nottingham forest fc": "forest",
  "leeds united": "leeds", "leeds": "leeds", "leeds united fc": "leeds",
  "fulham": "fulham", "fulham fc": "fulham",
  "sunderland": "sunderland", "sunderland afc": "sunderland",
  "ipswich town": "ipswich", "ipswich": "ipswich", "ipswich town fc": "ipswich",
  "coventry city": "coventry", "coventry": "coventry", "coventry city fc": "coventry",
  "hull city": "hull", "hull": "hull", "hull city afc": "hull",
};

export function toTeamId(raw) {
  if (!raw) return null;
  const key = String(raw).trim().toLowerCase();
  return ALIASES[key] || null;
}

// ---------------------------------------------------------------------------
// Predictions. Each is an ordered array of 20 canonical ids (position 1..20).
// Normalised from the submitted screenshots.
// Ben Gull's list was corrected per instruction: the duplicate "Hull" at #14
// was dropped, leaving Hull 19th and Ipswich 20th.
// ---------------------------------------------------------------------------
export const PREDICTIONS = [
  {
    name: "Gareth",
    order: ["arsenal","man-city","chelsea","man-utd","liverpool","aston-villa","spurs","newcastle","brighton","brentford","crystal-palace","everton","bournemouth","forest","leeds","fulham","sunderland","ipswich","coventry","hull"],
  },
  {
    name: "Hallan Surger",
    order: ["arsenal","man-city","liverpool","chelsea","man-utd","brighton","newcastle","aston-villa","spurs","everton","brentford","forest","crystal-palace","bournemouth","leeds","sunderland","fulham","ipswich","hull","coventry"],
  },
  {
    name: "Ell",
    order: ["arsenal","chelsea","liverpool","man-city","man-utd","spurs","everton","aston-villa","leeds","forest","brentford","brighton","crystal-palace","bournemouth","newcastle","fulham","coventry","sunderland","ipswich","hull"],
  },
  {
    name: "Ben Gull",
    order: ["arsenal","man-city","chelsea","man-utd","liverpool","brentford","newcastle","everton","brighton","bournemouth","leeds","aston-villa","sunderland","spurs","forest","coventry","crystal-palace","fulham","hull","ipswich"],
  },
  {
    name: "Kyle",
    order: ["arsenal","man-city","chelsea","liverpool","newcastle","man-utd","brentford","spurs","brighton","everton","leeds","bournemouth","aston-villa","forest","crystal-palace","fulham","ipswich","sunderland","coventry","hull"],
  },
  {
    name: "Jimmy Adventures",
    order: ["arsenal","chelsea","man-city","man-utd","liverpool","brentford","brighton","everton","spurs","bournemouth","leeds","aston-villa","sunderland","newcastle","hull","ipswich","crystal-palace","fulham","forest","coventry"],
  },
  {
    name: "Mike",
    order: ["arsenal","man-city","chelsea","liverpool","man-utd","brentford","brighton","leeds","everton","spurs","bournemouth","aston-villa","newcastle","sunderland","forest","fulham","crystal-palace","ipswich","hull","coventry"],
  },
];
