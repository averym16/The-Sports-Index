// script.js

// CONFIG: filter criteria
(function () {
title = document.querySelector("h1");
const FILTER_LEAGUE = title.getAttribute('name');
const LEAGUE_BODY_ID = "league_body";

function esc(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildTeamList(teams = []) {
  const ul = document.createElement("ul");
  ul.className = "teamlist";
  for (const t of teams) {
    const li = document.createElement("li");
    li.textContent = t;
    ul.appendChild(li);
  }
  return ul;
}

function createRow(obj) {
  const tr = document.createElement("tr");

  // League
  const tdLeague = document.createElement("td");
  const a = document.createElement("a");
  a.textContent = obj.league || "";
  tdLeague.appendChild(a);
  tr.appendChild(tdLeague);

  // Description
  const tdDesc = document.createElement("td");
  tdDesc.textContent = obj.description || "";
  tr.appendChild(tdDesc);

  // Season
  const tdSeason = document.createElement("td");
  tdSeason.textContent = obj.season || "";
  tr.appendChild(tdSeason);

  // Teams
  const tdTeams = document.createElement("td");
  tdTeams.appendChild(buildTeamList(Array.isArray(obj.teams) ? obj.teams : []));
  tr.appendChild(tdTeams);

  // Schedule
  const tdSched = document.createElement("td");
  if (obj.schedule_link) {
    const schedA = document.createElement("a");
    schedA.href = obj.schedule_link;
    schedA.target = "_blank";
    schedA.rel = "noopener noreferrer";
    schedA.textContent = obj.schedule_name || obj.schedule_link;
    tdSched.appendChild(schedA);
  } else {
    tdSched.textContent = obj.schedule_name || "";
  }
  tr.appendChild(tdSched);

  // Watch
  const tdWatch = document.createElement("td");
  tdWatch.textContent = obj.watch || "";
  tr.appendChild(tdWatch);

  return tr;
}


function populateTable(data = []) {
  const body = document.getElementById(LEAGUE_BODY_ID);
  if (!body) return;

  body.innerHTML = ""; // clear
  
  const filtered = data.filter(
    (item) => item.sport === FILTER_LEAGUE);

  if (filtered.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 6;
    td.textContent = "No leagues found for filter.";
    tr.appendChild(td);
    body.appendChild(tr);
    return;
  }

  for (const obj of filtered) {
    body.appendChild(createRow(obj));
  }
}

// Load JSON from file, fall back to inline data
function init() {
  fetch("../data/leagues.json")
    .then((resp) => {
      if (!resp.ok) throw new Error("leagues.json not found");
      return resp.json();
    })
    .then((json) => populateTable(Array.isArray(json) ? json : []))
    .catch(() => {
      if (window.LEAGUES_DATA && Array.isArray(window.LEAGUES_DATA)) {
        populateTable(window.LEAGUES_DATA);
      } else {
        populateTable([]);
      }
    });
}

// Run after DOM ready
document.addEventListener("DOMContentLoaded", init);
})();
