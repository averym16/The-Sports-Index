const now = new Date();
const sport_name = {"men_rugby": "Men's Rugby", "women_rugby": "Women's Rugby", "men_soccer": "Men's Soccer", "women_soccer": "Women's Soccer",
    "nfl": "NFL", "nhl": "NHL", "college_hockey": "NCAA D1 Men's Hockey", "college_football": "NCAA FBS 1 Football", "hockey": "Hockey", "rugby": "Rugby",
    "soccer": "Soccer", "football": "Football", "home": "Home"};

function buildTeamsSection() {
  if (!$('#teams').length) return;
  $('#teams').append("<h2>Teams</h2><p>Stats on every T1 and T2 teams.</p>");
  $('#teams').append(
    '<table id="team_table">' +
      '<tr id="team_headings">' +
      '<th>Team</th><th>Founded</th><th id="championships">Championships</th>' +
      '<th id="header4">Rank</th><th id="header5">Rank Change (Last 10 Years)</th>' +
      '</tr><tbody id="team_body"></tbody></table>'
  );
}


$(document).ready(function() {
    const params = new URLSearchParams(window.location.search);
    const FILTER_SPORT = params.get('sport');
    const FILTER_SPORT_OPTION = params.get('option');

    //Create Footer Element
        $("#footer").html('<section id="contact_info"><h3>Contact Us</h3><p>Email: <a href="https://www.youtube.com/watch?v=xeSpzHqQT2w&t=0h0m46s" target="_blank">averymorrison26@gmail.com</a></p><p>Github:<a href="https://github.com/averym16" target="_blank">averym16</a></p></section>');
        $("#footer").append('<section id="footer-misc"><p><a href="../CREDITS.txt">Sources</a></p><p>Last Updated: 10/21/2025 18:20:00</p><p>Licensed by <a href="../LICENSE.txt">MIT</a></p></section>');

    //Create Navbar
        $("#navbar").html('<ul class="navbar_list"><li id="home"><a href="#navbar">Home</a></li><li><a href="https://www.youtube.com/watch?v=b4Zp75xe6tE&t=11s" target="_blank">About</a></li><li><a href="#footer">Contact</a></li><li><a href="https://www.youtube.com/watch?v=V3R9y5v8GUY&t=0h0m11s" target="_blank">Donate</a></li></ul>');

    //Create leagues table
        $('#leagues').append("<h2>Leagues</h2><p>Top 10 club leagues in the world, along with the Champions League.</p>");
        $('#leagues').append('<table id = "league_table"><tr id = "league_headings"><th id="header1">Leagues</th><th>Description</th><th>Season</th><th>Teams</th><th>Schedule</th><th>Watch</th></tr><tbody id="league_body"></tbody></table>');
    
    //Create tournament table
        $('#tournaments').append("<h2>Tournaments</h2>");
        $('#tournaments').append('<table id = "tournament_table"><tr id = "tournament_headings"><th>Tournament</th><th>Description</th><th>When</th><th>Watch</th></tr><tbody id="tournament_body"></tbody></table>');
    
    //Create teams table
        $('#teams').append("<h2>Teams</h2><p>Stats on every T1 and T2 teams.</p>");
        $('#teams').append('<table id = "team_table"><tr id = "team_headings"><th>Team</th><th>Founded</th><th id="championships">Championships</th><th id="header4">Rank</th><th id="header5">Rank Change (Last 10 Years)</th></tr><tbody id="team_body"></tbody></table>');

    //Create rivalry list
        $('#rivalries').append('<h2>Top 50 Rivalries in FBS 1</h2><ol id="rivalry_body"></ol>');
    
    //Create breadcrumb
        $('#breadcrumb').append(`<li id="bread_home"><a href="../index.html">Home</a></li><li id="bread_sport"><a href="#${FILTER_SPORT}">${sport_name[FILTER_SPORT]}</a></li>`);

    //Create head
    
        if (!document.querySelector('meta[charset]')) {
            const meta = document.createElement('meta');
            meta.setAttribute('charset', 'UTF-8');
            document.head.prepend(meta); // put it right at the start
        }
    
        // Add title if missing
        if (!document.querySelector('title')) {
            const titleEl = document.createElement('title');
            titleEl.textContent = `The Sports Index | ${sport_name[FILTER_SPORT_OPTION] || ''}`;
            document.head.appendChild(titleEl);
        } else {
        document.title = `The Sports Index | ${sport_name[FILTER_SPORT_OPTION] || ''}`;
        }
        // Styles
        const link1 = document.createElement('link');
        link1.rel = 'stylesheet';
        link1.href = 'styles/common.css';
        link1.type = 'text/css';
        link1.media = 'screen';
        link1.id = 'head_link1';

        const link2 = document.createElement('link');
        link2.rel = 'stylesheet';
        link2.href = 'styles/index.css';
        link2.type = 'text/css';
        link2.media = 'screen';
        link2.id = 'head_link2';

        document.head.append(link1, link2);
        //Add Scripts for data
        if ( FILTER_SPORT != 'home' && FILTER_SPORT_OPTION != 'soccer' && FILTER_SPORT_OPTION != 'rugby' && FILTER_SPORT_OPTION != 'football' 
            && FILTER_SPORT_OPTION != 'hockey') {
            scripts = [
                "../scripts/data_league_script.js",
                "../scripts/data_rival_script.js",
                "../scripts/data_tournaments_script.js",
            ];

            if(FILTER_SPORT_OPTION === 'nfl' || FILTER_SPORT_OPTION === 'nhl' ) scripts.push("../scripts/data_national_teams_script.js");
            else scripts.push( "../scripts/data_team_script.js" );

            scripts.forEach((src) => {
            const s = document.createElement("script");
            s.src = src;
            s.defer = true;
            document.body.appendChild(s); 
            });
        }
    
});

//Add elements after page has fully loaded
$(window).on("load", function(){ 
    const params = new URLSearchParams(window.location.search);
    const FILTER_SPORT = params.get('sport');
    const FILTER_SPORT_OPTION = params.get('option');
    
    //Add Specific Elements Based on Page

        //Update Home
        if ( FILTER_SPORT === 'home' ){
            //Update Navbar
                $('#home').html('<a href="#navbar">Home</a>');

            //Update head
                $('#head_link2 href').attr("href", "styles/index.css");
                $('#head_link1 href').attr("href", "styles/common.css");
            
        }
        else{
            //Update Navbar
                $('#home').html('<a href="../index.html">Home</a>');
        
            //Update Path for styles/common.css
                $('#head_link1').attr("href", "../styles/common.css");
                $('#head_link2').attr("href", "../styles/sports.css");

            //Update all sport_option pages
            if ( FILTER_SPORT_OPTION != 'soccer' && FILTER_SPORT_OPTION != 'rugby' 
                && FILTER_SPORT_OPTION != 'football' && FILTER_SPORT_OPTION != 'hockey') {
                
                //Update breadbox
                $('#breadcrumb').append(`<li><a href="#${FILTER_SPORT_OPTION}">${sport_name[FILTER_SPORT_OPTION]}</a></li>`);
                $('#breadcrumb #bread_sport a').attr("href", `sport.html?sport=${FILTER_SPORT}&option=${FILTER_SPORT}`);
                
                //Add Legal Details
                $('#breadcrumb').after("<details>The Sports Index isn't liable for any legal issues involved with streaming. Additonally, using a vpn is illegal.</details>");

                if(FILTER_SPORT === 'rugby'){
                    $('#leagues p').html("Table includes all T1 Leagues along with Major League Rugby.");
                    $('#leagues').append('<details>The best-of-the-best players from these leagues, get selected by their national teams to play.</details>');
                    if(FILTER_SPORT_OPTION === 'men_rugby'){
                        $('#teams').append('<h4>British & Lions</h4><p>Rugby union team selected from players eligible for the national teams of England, Ireland, Scotland, and Wales. Tour the Southern Hemisphere every 4 years.</p><p>Next Tour: 2029</p>');
                    }
                }
                else if (FILTER_SPORT === 'football' || FILTER_SPORT === 'hockey'){
                    $('#leagues h2').html("Conferences");
                    $('#league_headings #header1').html('Conference');
                    $('#team_headings header4').html('Overall Record');
                    $('#team_headings header5').html('Record Last 10 Years');
                    $('#team_headings').append("<th>Owner</th><th>General Manager</th><th>Head Coach</th>");

                    if(FILTER_SPORT_OPTION ==='nfl'){
                        $('#league_headings #header1').html('Division');
                        $('#leagues p').html("The NFL is split into 2 conferences the American Football League (AFC) and the National Football League (NFC). Being in one conference doesn't mean teams in the other conference don't play each other, just not as much based on a rotating schedule. Also location isn't based on conference at all. Teams play teams within their division the most and standings within a division help determine draft position and playoff position. Each conferences is split into 4 divisions and has playoffs for conference champion. The two conference champions face each other in the Super Bowl every year.");
                        $('#teams p').html('Stats on every team currently active in the NFL.');
                    }
                    else if (FILTER_SPORT_OPTION  === 'nhl'){
                        $('#leagues p').html("All NHL Conferences");
                        $('#teams p').html('Stats about each team in the NHL. Overall Record is defined as Win - Loss- Overtime Losses.');
                    }
                    else if ( FILTER_SPORT_OPTION === 'college_hockey'){
                        $('#leagues p').html("All National College Athletic Association (NCAA) Division 1 (D1) Men's hockey conferences.");
                        $('#rivalries h2').html("Top 10 NCAA Men's Hockey Rivalries");
                    }
                    else if ( FILTER_SPORT_OPTION === 'college_football'){
                        $('#leagues p').html("All National College Athletic Association (NCAA) Division 1 (D1) Men's football conferences.");
                    }
                }
                
                //Update Navbar
                    $('.navbar_list').append('<li id="option1"><a href="#leagues">Leagues</a></li>');
                    $('.navbar_list').append('<li id="option2"><a href="#tournaments">Tournaments</a></li>');
                    
                //Update head
                    $('#head_link2').attr("href", "../styles/sport_option.css");

                    if ( FILTER_SPORT === 'football' || FILTER_SPORT === 'hockey' ){
                        $('#option1').html('<a href="#conferences">Conferences</a>');
                    }

                    if ( FILTER_SPORT_OPTION === 'nfl' || FILTER_SPORT_OPTION === 'nhl'){
                        $('#option2').html('<a href="#teams">Teams</a>');
                    }
                    else if ( FILTER_SPORT_OPTION === 'college_hockey' || FILTER_SPORT_OPTION === 'college_football'){
                        $('#option2').html('<a href="#rivalries">Rivalries</a>');
                    }
                    else if( FILTER_SPORT === 'rugby'){
                        $('.navbar_list').append('<li id="option3"><a href="#teams">Teams</a></li>');
                    }
            }
        }
});
