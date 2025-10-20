(function () {
  const title = document.querySelector("h1");
  const FILTER_SPORT = title ? title.getAttribute("name") : "";
  const RIVALRY_BODY_ID = "rivalry_body";

  function esc(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function createListItem(obj) {
    const li = document.createElement("li");

    const titleDiv = document.createElement("div");
    titleDiv.className = "rivalry-title";
    titleDiv.textContent = esc(obj.rivalry || "");
    li.appendChild(titleDiv);

    const metaList = document.createElement("ul");
    metaList.className = "rivalry-meta";

    const leaderLi = document.createElement("li");
    leaderLi.textContent = `Leader: ${esc(obj.leader || "")} (${esc(obj.overall_record || "")})`;
    metaList.appendChild(leaderLi);

    const foundedLi = document.createElement("li");
    foundedLi.textContent = `Founded: ${esc(obj.first_meeting || "")}`;
    metaList.appendChild(foundedLi);

    const totalLi = document.createElement("li");
    totalLi.textContent = `Total Meetings: ${esc(obj.total_meetings || "")}`;
    metaList.appendChild(totalLi);

    li.appendChild(metaList);
    return li;
  }

  function populateList(data = []) {
    const container = document.getElementById(RIVALRY_BODY_ID);
    if (!container) return;

    container.innerHTML = "";

    // Find the sport section that matches the h1 name
    const sportData = data.find(item => item.sport === FILTER_SPORT);

    if (!sportData || !sportData.rivalries || sportData.rivalries.length === 0) {
      const li = document.createElement("li");
      li.textContent = "No rivalries found for this sport.";
      container.appendChild(li);
      return;
    }

    for (const rivalry of sportData.rivalries) {
      container.appendChild(createListItem(rivalry));
    }
  }

  function init() {
    fetch("../data/rivalries.json")
      .then(resp => resp.json())
      .then(json => populateList(json))
      .catch(() => populateList([]));
  }

  document.addEventListener("DOMContentLoaded", init);
})();