/* Page bootstrap for sport.html & sport_option.html (fixed timing) */

const SPORT_NAMES = {
  rugby: { men_rugby: "Men's Rugby", women_rugby: "Women's Rugby", rugby: "Rugby" },
  soccer: { men_soccer: "Men's Soccer", women_soccer: "Women's Soccer", soccer: "Soccer" },
  football: { nfl: "NFL", college_football: "NCAA FBS 1 Football", football: "Football" },
  hockey: { nhl: "NHL", college_hockey: "NCAA D1 Men's Hockey", hockey: "Hockey" },
  home: { home: "Home" }
};

$(document).ready(function () {
  const params = new URLSearchParams(window.location.search);
  const sport = params.get("sport") || "home";
  const option = params.get("option") || sport;

  // Set the <h1> id/name and label
  const $h1 = $("h1");
  $h1.attr("id", sport);
  $h1.attr("name", option);
  const label = (SPORT_NAMES[sport] && (SPORT_NAMES[sport][option] || SPORT_NAMES[sport][sport])) || option;
  $h1.text(label);

  // If we're on sport_option page, repurpose the second section as needed
  if (option !== "football" && option !== "rugby" && option !== "soccer" && option !== "hockey") {
    if (option === "nfl" || option === "nhl") {
      $("#tournaments").remove();
      $('#rivalries').remove();
    } else if (option === "college_hockey" || option === "college_football") {
       $("#tournaments").remove();
      $("#teams").remove();
    } else if (sport === "rugby" || sport==='soccer') {
      $("#rivalries").remove();
      if (sport === 'soccer') $("#teams").remove();
    }
  }
});
