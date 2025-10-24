(function () {
  const title = document.querySelector("h1");
  const FILTER_SPORT = title?.getAttribute("name");
  const RIVALRY_BODY_ID = "rivalry_body";

  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function createListItem(obj) {
    const li = document.createElement("li");

    const titleDiv = document.createElement("div");
    titleDiv.className = "rivalry-title";
    titleDiv.textContent = obj.rivalry || "";
    li.appendChild(titleDiv);

    const metaList = document.createElement("ul");
    metaList.className = "rivalry-meta";

    const leaderLi = document.createElement("li");
    leaderLi.textContent = `Leader: ${esc(obj.leader || "")} (${esc(obj.overall_record || "")})`;
    metaList.appendChild(leaderLi);

    const foundedLi = document.createElement("li");
    foundedLi.textContent = `First Meeting: ${esc(obj.first_meeting || "")}`;
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

    const sport = data.find(item => item.sport === FILTER_SPORT);
    if (!sport || !Array.isArray(sport.rivalries) || sport.rivalries.length === 0) {
      const li = document.createElement("li");
      li.textContent = "No rivalries found for this sport.";
      container.appendChild(li);
      return;
    }

    for (const rivalry of sport.rivalries) {
      container.appendChild(createListItem(rivalry));
    }
  }

  function init() {
    fetch("../data/rivalries.json")
      .then(resp => {
        if (!resp.ok) throw new Error("rivalries.json not found");
        return resp.json();
      })
      .then(json => populateList(Array.isArray(json) ? json : []))
      .catch(() => {
        if (window.RIVALRIES_DATA && Array.isArray(window.RIVALRIES_DATA)) {
          populateList(window.RIVALRIES_DATA);
        } else {
          populateList([]);
        }
      });
  }

  if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init(); // DOM already loaded
}
})();
