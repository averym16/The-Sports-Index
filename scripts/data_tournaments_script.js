/* As uploaded — no functional changes needed */
(function () {
  const params = new URLSearchParams(window.location.search);
  const FILTER_TOURNAMENT = params.get('option');
  const TOURNAMENT_BODY_ID = "tournament_body";

  function createRow(obj) {
    const tr = document.createElement("tr");

    const tdTournament = document.createElement("td");
    const a = document.createElement("a");
    a.textContent = obj.tournament || "";
    if (obj.link) {
      a.href = obj.link;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
    tdTournament.appendChild(a);
    tr.appendChild(tdTournament);

    const tdDesc = document.createElement("td");
    tdDesc.textContent = obj.description || "";
    tr.appendChild(tdDesc);

    const tdWhen = document.createElement("td");
    tdWhen.textContent = obj.when || "";
    tr.appendChild(tdWhen);

    const tdWatch = document.createElement("td");
    tdWatch.textContent = obj.watch || "";
    tr.appendChild(tdWatch);

    return tr;
  }

  function populateTable(data = []) {
    const body = document.getElementById(TOURNAMENT_BODY_ID);
    if (!body) return;

    body.innerHTML = "";
    const filtered = data.filter(item => item.sport === FILTER_TOURNAMENT);
    if (filtered.length === 0) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 4;
      td.textContent = "No tournaments found for filter.";
      tr.appendChild(td);
      body.appendChild(tr);
      return;
    }
    for (const obj of filtered) body.appendChild(createRow(obj));
  }

  function init() {
    fetch("../data/tournaments.json")
      .then(resp => {
        if (!resp.ok) throw new Error("tournaments.json not found");
        return resp.json();
      })
      .then(json => populateTable(Array.isArray(json) ? json : []))
      .catch(() => {
        if (window.TOURNAMENT_DATA && Array.isArray(window.TOURNAMENT_DATA)) {
          populateTable(window.TOURNAMENT_DATA);
        } else {
          populateTable([]);
        }
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
