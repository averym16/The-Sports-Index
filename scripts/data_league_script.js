// data_league_script.js (unchanged logic, small safety tweaks)
(function () {
  const params = new URLSearchParams(window.location.search);
  const FILTER_LEAGUE = params.get('option');
  const LEAGUE_BODY_ID = "league_body";

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
    if (obj.league_link) {
      a.href = obj.league_link;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
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

    // Special splits
    if (obj.league === "Sun Belt Conference (SBC)") {
      const eastTeams = [];
      const westTeams = [];
      let currentDivision = null;

      (Array.isArray(obj.teams) ? obj.teams : []).forEach(team => {
        const low = String(team).toLowerCase();
        if (low === "east") currentDivision = "east";
        else if (low === "west") currentDivision = "west";
        else if (currentDivision === "east") eastTeams.push(team);
        else if (currentDivision === "west") westTeams.push(team);
      });

      const eastHeader = document.createElement("strong");
      eastHeader.textContent = "Sun Belt East:";
      const westHeader = document.createElement("strong");
      westHeader.textContent = "Sun Belt West:";

      tdTeams.appendChild(eastHeader);
      tdTeams.appendChild(buildTeamList(eastTeams));
      tdTeams.appendChild(document.createElement("br"));
      tdTeams.appendChild(westHeader);
      tdTeams.appendChild(buildTeamList(westTeams));
    } else if (obj.league === "Eastern Conference") {
      const atl = [];
      const metro = [];
      let currentDivision = null;
      (Array.isArray(obj.teams) ? obj.teams : []).forEach(team => {
        const low = String(team).toLowerCase();
        if (low === "atlantic") currentDivision = "atlantic";
        else if (low === "metropolitan") currentDivision = "metropolitan";
        else if (currentDivision === "atlantic") atl.push(team);
        else if (currentDivision === "metropolitan") metro.push(team);
      });

      const aH = document.createElement("strong");
      aH.textContent = "Atlantic Division:";
      const mH = document.createElement("strong");
      mH.textContent = "Metropolitan Division:";

      tdTeams.appendChild(aH);
      tdTeams.appendChild(buildTeamList(atl));
      tdTeams.appendChild(document.createElement("br"));
      tdTeams.appendChild(mH);
      tdTeams.appendChild(buildTeamList(metro));
    } else if (obj.league === "Western Conference") {
      const central = [];
      const pacific = [];
      let currentDivision = null;
      (Array.isArray(obj.teams) ? obj.teams : []).forEach(team => {
        const low = String(team).toLowerCase();
        if (low === "central") currentDivision = "central";
        else if (low === "pacific") currentDivision = "pacific";
        else if (currentDivision === "central") central.push(team);
        else if (currentDivision === "pacific") pacific.push(team);
      });

      const cH = document.createElement("strong");
      cH.textContent = "Central Division:";
      const pH = document.createElement("strong");
      pH.textContent = "Pacific Division:";

      tdTeams.appendChild(cH);
      tdTeams.appendChild(buildTeamList(central));
      tdTeams.appendChild(document.createElement("br"));
      tdTeams.appendChild(pH);
      tdTeams.appendChild(buildTeamList(pacific));
    } else {
      tdTeams.appendChild(buildTeamList(Array.isArray(obj.teams) ? obj.teams : []));
    }

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
    body.innerHTML = "";

    const filtered = data.filter((item) => item.sport === FILTER_LEAGUE);
    if (filtered.length === 0) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 6;
      td.textContent = "No leagues found for filter.";
      tr.appendChild(td);
      body.appendChild(tr);
      return;
    }

    for (const obj of filtered) body.appendChild(createRow(obj));
  }

  function init() {
    fetch("../data/leagues.json")
      .then(resp => {
        if (!resp.ok) throw new Error("leagues.json not found");
        return resp.json();
      })
      .then(json => populateTable(Array.isArray(json) ? json : []))
      .catch(() => {
        if (window.LEAGUES_DATA && Array.isArray(window.LEAGUES_DATA)) {
          populateTable(window.LEAGUES_DATA);
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
