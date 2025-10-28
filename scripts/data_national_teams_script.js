// data_national_teams_script.js (fixed headers + filtering)
(function () {
  'use strict';

  const JSON_URL = '../data/teams.json';
  const TEAM_BODY_ID = 'team_body';
  const params = new URLSearchParams(window.location.search);
  const FILTER_SPORT = params.get('option'); // "nfl" or "nhl"

  // Parse W-L or W-L-T into a sortable score; returns number or null if invalid
  const parseRecordScore = (recordStr) => {
    if (!recordStr || typeof recordStr !== 'string') return null;
    const s = recordStr.trim();
    if (!s || s.toLowerCase() === 'unknown') return null;
    const m = s.match(/^(\d+)\s*-\s*(\d+)(?:\s*-\s*(\d+))?$/);
    if (!m) return null;
    const W = Number(m[1]);
    const L = Number(m[2]);
    const T = m[3] !== undefined ? Number(m[3]) : 0;
    if (!Number.isFinite(W) || !Number.isFinite(L) || !Number.isFinite(T)) return null;
    return W - L + 0.5 * T;
  };

  const flatten = (data) => {
    const out = [];
    const arr = Array.isArray(data) ? data : (data ? [data] : []);
    for (const block of arr) {
      const sport = String(block?.sport || "").trim().toLowerCase();
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

  const sortByScore = (teams) => {
    const withScore = teams.filter(t => t._score !== null && t._score !== undefined);
    const withoutScore = teams.filter(t => t._score === null || t._score === undefined);
    withScore.sort((a, b) => {
      if (b._score !== a._score) return b._score - a._score;
      return a.name.localeCompare(b.name);
    });
    return withScore.concat(withoutScore);
  };

  const createCell = (text) => {
    const td = document.createElement('td');
    td.textContent = text ?? '';
    return td;
  };

  const createRow = (team) => {
    const tr = document.createElement('tr');
    tr.appendChild(createCell(team.name));
    tr.appendChild(createCell(team.founded));
    tr.appendChild(createCell(team.championships));
    tr.appendChild(createCell(team.overall_record));
    tr.appendChild(createCell(team.record_10years));
    tr.appendChild(createCell(team.owner));
    tr.appendChild(createCell(team.general_manager));
    tr.appendChild(createCell(team.head_coach));
    return tr;
  };

  const ensureHeaderColumns = () => {
    const headRow = document.getElementById("team_headings");
    if (!headRow) return;
    // If only the default 5 columns exist, extend to 8 with staff columns
    if (headRow.children.length < 8) {
      ["Owner", "General Manager", "Head Coach"].forEach(text => {
        const th = document.createElement("th");
        th.textContent = text;
        headRow.appendChild(th);
      });
    }
  };

  const populateTable = (teams) => {
    ensureHeaderColumns();
    const tbody = document.getElementById(TEAM_BODY_ID);
    if (!tbody) return;
    tbody.innerHTML = '';
    if (!teams || teams.length === 0) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 8;
      td.textContent = `No ${FILTER_SPORT.toUpperCase()} teams found.`;
      tr.appendChild(td);
      tbody.appendChild(tr);
      return;
    }
    const sorted = sortByScore(teams);
    for (const t of sorted) tbody.appendChild(createRow(t));
  };

  const init = async () => {
    try {
      const resp = await fetch(JSON_URL);
      if (!resp.ok) throw new Error('teams.json not found');
      const json = await resp.json();
      const teams = flatten(json);
      populateTable(teams);
    } catch {
      if (Array.isArray(window.TEAMS_DATA)) {
        const teams = flatten(window.TEAMS_DATA);
        populateTable(teams);
      } else {
        populateTable([]);
      }
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
