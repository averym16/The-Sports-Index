/* Common elements + page wiring (fixed) */

// Map of display names
const SPORT_NAME = {
  rugby: { men_rugby: "Men's Rugby", women_rugby: "Women's Rugby", rugby: "Rugby" },
  soccer: { men_soccer: "Men's Soccer", women_soccer: "Women's Soccer", soccer: "Soccer" },
  football: { nfl: "NFL", college_football: "NCAA FBS 1 Football", football: "Football" },
  hockey: { nhl: "NHL", college_hockey: "NCAA D1 Men's Hockey", hockey: "Hockey" },
  home: { home: "Home" }
};

// Helpers
const qs = (sel) => document.querySelector(sel);
const qsa = (sel) => Array.from(document.querySelectorAll(sel));

function getParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    sport: params.get("sport") || "home",
    option: params.get("option") || (params.get("sport") || "home")
  };
}

function titleFor(sport, option) {
  const sportMap = SPORT_NAME[sport] || {};
  return sportMap[option] || sportMap[sport] || option || sport;
}

function isBaseSportPage({ sport, option }) {
  // sport.html should have option equal to sport (e.g., sport=rugby&option=rugby) or missing option
  return option === sport || ["home"].includes(sport);
}

function ensureHead({ sport, option }) {
  // <meta charset>
  if (!document.querySelector('meta[charset]')) {
    const meta = document.createElement("meta");
    meta.setAttribute("charset", "UTF-8");
    document.head.prepend(meta);
  }

  // <title>
  const pageTitle = `The Sports Index | ${titleFor(sport, option)}`;
  if (!document.querySelector("title")) {
    const t = document.createElement("title");
    t.textContent = pageTitle;
    document.head.appendChild(t);
  } else {
    document.title = pageTitle;
  }

  // styles
  const linkCommon = document.createElement("link");
  linkCommon.rel = "stylesheet";
  linkCommon.href = isBaseSportPage({ sport, option }) ? "styles/common.css" : "../styles/common.css";
  linkCommon.type = "text/css";
  linkCommon.media = "screen";
  linkCommon.id = "head_link1";

  const linkPage = document.createElement("link");
  linkPage.rel = "stylesheet";
  linkPage.href = isBaseSportPage({ sport, option })
    ? "styles/index.css"
    : "../styles/sports.css";
  linkPage.type = "text/css";
  linkPage.media = "screen";
  linkPage.id = "head_link2";

  // Replace or append
  const prev1 = document.getElementById("head_link1");
  const prev2 = document.getElementById("head_link2");
  if (prev1) prev1.remove();
  if (prev2) prev2.remove();
  document.head.append(linkCommon, linkPage);
}

function ensureFooter() {
  const footer = qs("#footer");
  if (!footer) return;
  footer.innerHTML = `
    <section id="contact_info">
      <h3>Contact Us</h3>
      <p>Email: <a href="mailto:averymorrison26@gmail.com" target="_blank">averymorrison26@gmail.com</a></p>
      <p>Github: <a href="https://github.com/averym16" target="_blank">averym16</a></p>
    </section>
    <section id="footer-misc">
      <p><a href="../CREDITS.txt">Sources</a></p>
      <p>Last Updated: 10/27/2025</p>
      <p>Licensed by <a href="../LICENSE.txt">MIT</a></p>
    </section>
  `;
}

function ensureNavbar(isBase) {
  const nav = qs("#navbar");
  if (!nav) return;
  nav.innerHTML = `
    <ul class="navbar_list">
      <li id="home"><a href="#navbar">Home</a></li>
      <li><a href="https://www.youtube.com/watch?v=b4Zp75xe6tE&t=11s" target="_blank">About</a></li>
      <li><a href="#footer">Contact</a></li>
      <li><a href="https://www.youtube.com/watch?v=V3R9y5v8GUY&t=0h0m11s" target="_blank">Donate</a></li>
    </ul>
  `;
  // Home link points back to index for option pages
  if (!isBase) {
    qs("#home a").setAttribute("href", "../index.html");
  }
}

function ensureScaffolding() {
  // leagues table
  const leagues = qs("#leagues");
  if (leagues && !qs("#league_table")) {
    leagues.insertAdjacentHTML(
      "beforeend",
      `<h2>Leagues</h2><p>Top 10 club leagues in the world, along with the Champions League.</p>
       <table id="league_table">
         <thead><tr id="league_headings">
           <th id="header1">Leagues</th><th>Description</th><th>Season</th><th>Teams</th><th>Schedule</th><th>Watch</th>
         </tr></thead>
         <tbody id="league_body"></tbody>
       </table>`
    );
  }
  // tournaments table (may be repurposed to teams/rivalries by load_sport_option.js)
  const tournaments = qs("#tournaments");
  if (tournaments && !qs("#tournament_table")) {
    tournaments.insertAdjacentHTML(
      "beforeend",
      `<h2>Tournaments</h2>
       <table id="tournament_table">
         <thead><tr id="tournament_headings">
           <th>Tournament</th><th>Description</th><th>When</th><th>Watch</th>
         </tr></thead>
         <tbody id="tournament_body"></tbody>
       </table>`
    );
  }
  // teams table container (only create if section exists)
  const teams = qs("#teams");
  if (teams && !qs("#team_table")) {
    teams.insertAdjacentHTML(
      "beforeend",
      `<h2>Teams</h2><p>Stats on every T1 and T2 teams.</p>
       <table id="team_table">
         <thead><tr id="team_headings">
           <th>Team</th><th>Founded</th><th id="header4">Championships</th><th id="header5">Rank</th><th>Rank Change (Last 10 Years)</th>
         </tr></thead>
         <tbody id="team_body"></tbody>
       </table>`
    );
  }
  // rivalries ordered list
  const rival = qs("#rivalries");
  if (rival && !qs("#rivalry_body")) {
    rival.insertAdjacentHTML("beforeend", `<h2>Top 50 Rivalries in FBS 1</h2><ol id="rivalry_body"></ol>`);
  }
}

function ensureBreadcrumb({ sport, option }) {
  const bc = qs("#breadcrumb");
  if (!bc) return;

  const sportText = titleFor(sport, sport);
  const optionText = titleFor(sport, option);

  // reset then build
  bc.innerHTML = "";
  bc.insertAdjacentHTML("beforeend",
    `<li id="bread_home"><a href="../index.html">Home</a></li>`);
  bc.insertAdjacentHTML("beforeend",
    `<li id="bread_sport"><a href="sport.html?sport=${encodeURIComponent(sport)}&option=${encodeURIComponent(sport)}">${sportText}</a></li>`);

  if (!isBaseSportPage({ sport, option })) {
    bc.insertAdjacentHTML("beforeend",
      `<li><a href="#${option}">${optionText}</a></li>`);
  }
}

function ensureOptionTabs({ sport, option }) {
  const opt = qs("#option");
  if (!opt) return;

  const sportText = titleFor(sport, sport);
  const optionText = titleFor(sport, option);

  opt.innerHTML = `
    <ul id="option_list">
      <li id="option1"><a href="${isBaseSportPage({sport, option})
        ? `sport_option.html?sport=${encodeURIComponent(sport)}&option=${encodeURIComponent(option)}`
        : "#leagues"
      }">${optionText}</a></li>
      <li id="option2"><a href="${isBaseSportPage({sport, option})
        ? `sport_option.html?sport=${encodeURIComponent(sport)}&option=${encodeURIComponent(sport)}`
        : "#tournaments"
      }">${sportText}</a></li>
    </ul>
  `;

  if (isBaseSportPage({ sport, option })) {
    const options = SPORT_NAMES[sport];
    if (options) {
      const list = qs("#option_list");
      if (list) {
        list.innerHTML = "";
        Object.entries(options).forEach(([key, name]) => {
          if (key !== sport) {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.href = `sport_option.html?sport=${sport}&option=${key}`;
            a.textContent = name;
            li.appendChild(a);
            list.appendChild(li);
          }
        });
      }
    }
  }
}

function loadDataScripts({ sport, option }) {
  // Only load data on sport_option pages (option is specific, not base sport/home)
  const isOptionPage = !isBaseSportPage({ sport, option }) &&
                       !["home"].includes(sport);
  if (!isOptionPage) return;

  const scripts = [
    "../scripts/data_league_script.js",
    "../scripts/data_rival_script.js",
    "../scripts/data_tournaments_script.js",
  ];

  if (option === "nfl" || option === "nhl") {
    scripts.push("../scripts/data_national_teams_script.js");
  } else {
    scripts.push("../scripts/data_team_script.js");
  }

  for (const src of scripts) {
    const s = document.createElement("script");
    s.src = src;
    s.defer = true;
    document.body.appendChild(s);
  }
}

function applyPerSportTweaks({ sport, option }) {
  const isBase = isBaseSportPage({ sport, option });

  // Fix home link + stylesheet path on option pages
  if (isBase) {
    // Styles already set to /styles/*.css in ensureHead
  } else {
    // Replace sports.css with sport_option.css for the specific option pages
    const link2 = document.getElementById("head_link2");
    if (link2) link2.href = "../styles/sport_option.css";
  }

  if (!isBase) {
    // Navbar extras
    const nav = qs(".navbar_list");
    if (nav) {
      nav.insertAdjacentHTML("beforeend", `<li id="option1"><a href="${(sport === "football" || sport === "hockey") ? "#conferences" : "#leagues"}">${(sport === "football" || sport === "hockey") ? "Conferences" : "Leagues"}</a></li>`);
      nav.insertAdjacentHTML("beforeend", `<li id="option2"><a href="${(option === "nfl" || option === "nhl") ? "#teams" : (option === "college_hockey" || option === "college_football") ? "#rivalries" : "#tournaments"}">${(option === "nfl" || option === "nhl") ? "Teams" : (option === "college_hockey" || option === "college_football") ? "Rivalries" : "Tournaments"}</a></li>`);
      if (sport === "rugby") {
        nav.insertAdjacentHTML("beforeend", `<li id="option3"><a href="#teams">Teams</a></li>`);
      }
    }

    // Football/Hockey headings adjustments
    if (sport === "football" || sport === "hockey") {
      const leaguesH2 = qs("#leagues h2");
      if (leaguesH2) leaguesH2.textContent = "Conferences";
      const header1 = qs("#league_headings #header1");
      if (header1) header1.textContent = sport === "football" ? "Division/Conference" : "Conference";

      const h4 = qs("#team_headings #header4");
      const h5 = qs("#team_headings #header5");
      if (h4) h4.textContent = "Overall Record";
      if (h5) h5.textContent = "Record Last 10 Years";

      // Expand team header with staff columns for NFL/NHL pages
      if (option === "nfl" || option === "nhl") {
        const headRow = qs("#team_headings");
        if (headRow && headRow.children.length < 8) {
          ["Owner", "General Manager", "Head Coach"].forEach(text => {
            const th = document.createElement("th");
            th.textContent = text;
            headRow.appendChild(th);
          });
        }
      }
    }

    // Page-specific copy
    if (sport === "rugby") {
      const leaguesP = qs("#leagues p");
      if (leaguesP) leaguesP.textContent = "Table includes all T1 Leagues along with Major League Rugby.";
      const leagues = qs("#leagues");
      if (leagues) leagues.insertAdjacentHTML("beforeend", `<details>The best-of-the-best players from these leagues get selected by their national teams.</details>`);
      if (option === "men_rugby") {
        const teams = qs("#teams");
        if (teams) teams.insertAdjacentHTML("beforeend", `<h4>British &amp; Lions</h4><p>Rugby union team selected from England, Ireland, Scotland, and Wales. Tours every 4 years.</p><p>Next Tour: 2029</p>`);
      }
    } else if (sport === "football" || sport === "hockey") {
      const leaguesP = qs("#leagues p");
      const teamsP = qs("#teams p");
      if (option === "nfl") {
        if (leaguesP) leaguesP.textContent = "The NFL has 2 conferences (AFC and NFC), each with 4 divisions. Division standings drive playoff seeding and draft order.";
        if (teamsP) teamsP.textContent = "Stats on every team currently active in the NFL.";
      } else if (option === "nhl") {
        if (leaguesP) leaguesP.textContent = "All NHL Conferences";
        if (teamsP) teamsP.textContent = "Overall Record is defined as Wins – Losses – Overtime Losses.";
      } else if (option === "college_hockey") {
        if (leaguesP) leaguesP.textContent = "All NCAA Division I Men's hockey conferences.";
        const rivalH2 = qs("#rivalries h2"); if (rivalH2) rivalH2.textContent = "Top 10 NCAA Men's Hockey Rivalries";
      } else if (option === "college_football") {
        if (leaguesP) leaguesP.textContent = "All NCAA Division I FBS football conferences.";
      }
      // Legal details
      const bc = qs("#breadcrumb");
      if (bc) bc.insertAdjacentHTML("afterend", `<details>Use legitimate sources to stream; follow your local laws.</details>`);
    }
  }
}

function initCommon() {
  const ctx = getParams();
  ensureHead(ctx);
  ensureFooter();
  ensureNavbar(isBaseSportPage(ctx));
  ensureScaffolding();
  ensureBreadcrumb(ctx);
  ensureOptionTabs(ctx);
  loadDataScripts(ctx);
  applyPerSportTweaks(ctx);
}

// Run once on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCommon);
} else {
  initCommon();
}

// Also run small tweaks once window fully loaded (safe no-ops due to idempotence)
window.addEventListener("load", () => {
  const ctx = getParams();
  // If we are on base page, ensure styles are base
  if (isBaseSportPage(ctx)) {
    const link1 = document.getElementById("head_link1");
    const link2 = document.getElementById("head_link2");
    if (link1) link1.href = "styles/common.css";
    if (link2) link2.href = "styles/index.css";
  }
});
