(function () {
  'use strict';
    
  const TEAM_BODY_ID = 'team_body';
  const JSON_URL = '../data/teams.json';

  const normalizeSport = (s) =>
    (s || '').toString().trim().toLowerCase().replace(/\s+/g, '_');

  const getFilterSport = () => {
    const h1 = document.querySelector('h1');
    const nameAttr = h1 ? h1.getAttribute('name') : '';
    return normalizeSport(nameAttr || '');
  };

  const toArray = (v) => (Array.isArray(v) ? v : (v ? [v] : []));

  // Flatten all teams for the selected sport from the JSON sections
  const flattenTeams = (data, wantedSport) => {
    const out = [];
    const arr = toArray(data);
    for (const block of arr) {
      const sport = normalizeSport(block?.sport);
      if (!sport || (wantedSport && sport !== wantedSport)) continue;

      if (Array.isArray(block.teams)) {
        for (const t of block.teams) {
          out.push({
            sport,
            rank_group: block.rank || '',
            name: t.name || '',
            founded: t.founded || '',
            championships: t.championships || '',
            current_rank: t.current_rank || '',
            rank_change_last_10_years: t.rank_change_last_10_years || '',
            owner: t.owner || '',
            general_manager: t.general_manager || '',
            head_coach: t.head_coach || ''
          });
        }
      } else if (block.name) {
        // Handle single-entry sections like British & Lions
        out.push({
          sport,
          rank_group: block.rank || '',
          name: block.name || '',
          founded: block.founded || '',
          championships: block.championships || '',
          current_rank: block.current_rank || '',
          rank_change_last_10_years: block.rank_change_last_10_years || ''
        });
      }
    }
    return out;
  };

  const createCell = (text) => {
    const td = document.createElement('td');
    td.textContent = text ?? '';
    return td;
  };

  // Row = [Name, Founded, Championships, Current Rank]
  const createRow = (team) => {
    const tr = document.createElement('tr');
    tr.appendChild(createCell(team.name || ''));
    tr.appendChild(createCell(team.founded || ''));
    tr.appendChild(createCell(team.championships || ''));
    tr.appendChild(createCell(team.current_rank || ''));
    return tr;
  };

  const populateTable = (teams) => {
    const body = document.getElementById(TEAM_BODY_ID);
    if (!body) return;

    body.innerHTML = '';

    if (!teams || teams.length === 0) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 4; // matches 4 columns created above
      td.textContent = 'No teams found for filter.';
      tr.appendChild(td);
      body.appendChild(tr);
      return;
    }

    for (const team of teams) {
      body.appendChild(createRow(team));
    }
  };

  const init = async () => {
    const filterSport = getFilterSport(); // expects values like "men_rugby" or "women_rugby"
    try {
      const resp = await fetch(JSON_URL);
      if (!resp.ok) throw new Error('teams.json not found');
      const json = await resp.json();
      const teams = flattenTeams(json, filterSport);
      populateTable(teams);
    } catch (e) {
      if (Array.isArray(window.team_DATA)) {
        const teams = flattenTeams(window.team_DATA, filterSport);
        populateTable(teams);
      } else {
        populateTable([]);
      }
    }
  };

  document.addEventListener('DOMContentLoaded', init);
})();