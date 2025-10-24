(function () {
  'use strict';

  const JSON_URL = '../data/teams.json'; // adjust if your path differs
  const TEAM_HEAD_ID = 'team_head';
  const TEAM_BODY_ID = 'team_body';
  const title = document.querySelector("h1");
  const FILTER_SPORT = title?.getAttribute("name");
  
  // Build the requested header
  const ensureHeaders = () => {
    const thead = document.getElementById(TEAM_HEAD_ID);
    if (!thead) return;
    thead.innerHTML = '';
    const tr = document.createElement('tr');
    const headers = [];

    if (thead === "nfl"){
      headers = [
        'Team',
        'Founded',
        'Super Bowls',
        'Overall Record',
        'Record Last 10 Years',
        'Owner',
        'General Manager',
        'Head Coach'
      ];
    }
    else if (thead === "nhl"){
      headers = [
        'Team',
        'Founded',
        'Stanley Cups',
        'Overall Record',
        'Record Last 10 Years',
        'Owner',
        'General Manager',
        'Head Coach'
      ];
    }
    for (const h of headers) {
      const th = document.createElement('th');
      th.textContent = h;
      tr.appendChild(th);
    }
    thead.appendChild(tr);
  };

  // Parse W-L or W-L-T into a sortable score; returns number or null if invalid
  // Score rule: W - L + 0.5*T
  const parseRecordScore = (recordStr) => {
    if (!recordStr || typeof recordStr !== 'string') return null;
    const s = recordStr.trim();
    if (!s || s.toLowerCase() === 'unknown') return null;

    // Accept "W-L" or "W-L-T"
    const m = s.match(/^(\d+)\s*-\s*(\d+)(?:\s*-\s*(\d+))?$/);
    if (!m) return null;
    const W = Number(m[1]);
    const L = Number(m[2]);
    const T = m[3] !== undefined ? Number(m[3]) : 0;

    if (!Number.isFinite(W) || !Number.isFinite(L) || !Number.isFinite(T)) return null;
    return W - L + 0.5 * T;
  };

  // Extract NFL teams from the JSON
  const flattenNFL = (data) => {
    const out = [];
    const arr = Array.isArray(data) ? data : (data ? [data] : []);
    for (const block of arr) {
      const sport = (block?.sport || '').toString().trim().toLowerCase();
      if (sport !== FILTER_SPORT) continue;
      if (!Array.isArray(block.teams)) continue;

      for (const t of block.teams) {
        const overall_record = t.overall_record ?? '';
        out.push({
          name: t.name || '',
          founded: t.founded || '',
          championships: t.championships || '',
          overall_record,
          record_10years: t.record_10years ?? '',
          owner: t.owner || '',
          general_manager: t.general_manager || '',
          head_coach: t.head_coach || '',
          _score: parseRecordScore(overall_record)
        });
      }
    }
    return out;
  };

  // Sort: valid scores first (descending), then invalid scores preserving original order
  const sortByOverallRecordScore = (teams) => {
    const withScore = [];
    const withoutScore = [];
    teams.forEach((t, i) => {
      if (t._score === null || t._score === undefined) withoutScore.push({ t, i });
      else withScore.push(t);
    });

    withScore.sort((a, b) => {
      if (b._score !== a._score) return b._score - a._score;
      // Tie-break by team name ascending for determinism
      return a.name.localeCompare(b.name);
    });

    // Keep teams without score in their original relative order, appended after those with scores
    return withScore.concat(withoutScore.map(x => x.t));
  };

  const createCell = (text) => {
    const td = document.createElement('td');
    td.textContent = text ?? '';
    return td;
  };

  const createRow = (team) => {
    const tr = document.createElement('tr');
    tr.appendChild(createCell(team.name || ''));
    tr.appendChild(createCell(team.founded || ''));
    tr.appendChild(createCell(team.championships || ''));
    tr.appendChild(createCell(team.overall_record || ''));
    tr.appendChild(createCell(team.record_10years || ''));
    tr.appendChild(createCell(team.owner || ''));
    tr.appendChild(createCell(team.general_manager || ''));
    tr.appendChild(createCell(team.head_coach || ''));
    return tr;
  };

  const populateTable = (teams) => {
    const tbody = document.getElementById(TEAM_BODY_ID);
    if (!tbody) return;

    tbody.innerHTML = '';

    if (!teams || teams.length === 0) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 8;
      td.textContent = 'No NFL teams found.';
      tr.appendChild(td);
      tbody.appendChild(tr);
      return;
    }

    const sorted = sortByOverallRecordScore(teams);
    for (const t of sorted) {
      tbody.appendChild(createRow(t));
    }
  };

  const init = async () => {
    ensureHeaders();
    try {
      const resp = await fetch(JSON_URL);
      if (!resp.ok) throw new Error('teams.json not found');
      const json = await resp.json();
      const nflTeams = flattenNFL(json);
      populateTable(nflTeams);
    } catch (e) {
      // Optional fallback if data is embedded on the page
      if (Array.isArray(window.team_DATA)) {
        const nflTeams = flattenNFL(window.team_DATA);
        populateTable(nflTeams);
      } else {
        populateTable([]);
      }
    }
  };

  if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
  } else {
    init(); // DOM already loaded
  }
})();
