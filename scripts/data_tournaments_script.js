(function () {
title = document.querySelector("h1");
const FILTER_TOURNAMENT = title.getAttribute('name');
const TOURNAMENT_BODY_ID = "tournament_body";

function esc(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function createRow(obj) {
  const tr = document.createElement("tr");

  //Tournament
  const tdTournament = document.createElement("td");
  const a = document.createElement("a");
  a.textContent = obj.tournament || "";
  tdTournament.appendChild(a);
  tr.appendChild(tdTournament);

  // Description
  const tdDesc = document.createElement("td");
  tdDesc.textContent = obj.description || "";
  tr.appendChild(tdDesc);

  //When
  const tdWhen = document.createElement("td");
  tdWhen.textContent = obj.when || "";
  tr.appendChild(tdWhen);

  // Watch
  const tdWatch = document.createElement("td");
  tdWatch.textContent = obj.watch || "";
  tr.appendChild(tdWatch);

  return tr;
}


function populateTable(data = []) {
  const body = document.getElementById(TOURNAMENT_BODY_ID);
  if (!body) return;

  body.innerHTML = ""; // clear
  
  const filtered = data.filter(
    (item) => item.sport === FILTER_TOURNAMENT );

  if (filtered.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 4;
    td.textContent = "No tournaments found for filter.";
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
  fetch("../data/tournaments.json")
    .then((resp) => {
      if (!resp.ok) throw new Error("tournaments.json not found");
      return resp.json();
    })
    .then((json) => populateTable(Array.isArray(json) ? json : []))
    .catch(() => {
      if (window.TOURNAMENT_DATA && Array.isArray(window.TOURNAMENT_DATA)) {
        populateTable(window.TOURNAMENT_DATA);
      } else {
        populateTable([]);
      }
    });
}

// Run after DOM ready
document.addEventListener("DOMContentLoaded", init);
})();
