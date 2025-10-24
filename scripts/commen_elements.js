const now = new Date();
const sport_names = {"men_rugby": "Men's Rugby", "women_rugby": "Women's Rugby", "men_soccer": "Men's Soccer", "women_soccer": "Women's Soccer",
    "nfl": "NFL", "nhl": "NHL", "college_hockey": "NCAA D1 Men's Hockey", "college_football": "NCAA FBS 1 Football", "hockey": "Hockey", "rugby": "Rugby",
    "soccer": "Soccer", "football": "Football", "home": "Home"};

$(document).ready(function() {
    const title = document.querySelector("h1");
    const FILTER_SPORT_OPTION = title?.getAttribute("name");
    const FILTER_SPORT = title?.getAttribute("id");

    //Create Footer Element
    $("#footer").html('<section id="contact_info"><h3>Contact Us</h3><p>Email: <a href="https://www.youtube.com/watch?v=xeSpzHqQT2w&t=0h0m46s" target="_blank">averymorrison26@gmail.com</a></p><p>Github:<a href="https://github.com/averym16" target="_blank">averym16</a></p></section>');
    $("#footer").append('<section id="footer-misc"><p><a href="../CREDITS.txt">Sources</a></p><p>Last Updated: 10/21/2025 18:20:00</p><p>Licensed by <a href="../LICENSE.txt">MIT</a></p></section>');

    //Create Navbar
    $("#navbar").html('<ul class="navbar_list"><li id="home"><a href="#navbar">Home</a></li><li><a href="https://www.youtube.com/watch?v=b4Zp75xe6tE&t=11s" target="_blank">About</a></li><li><a href="#footer">Contact</a></li><li><a href="https://www.youtube.com/watch?v=V3R9y5v8GUY&t=0h0m11s" target="_blank">Donate</a></li></ul>');

    //Create head
    
    if (!document.querySelector('meta[charset]')) {
        const meta = document.createElement('meta');
        meta.setAttribute('charset', 'UTF-8');
        document.head.prepend(meta); // put it right at the start
    }
 
    // Add title if missing
    if (!document.querySelector('title')) {
        const titleEl = document.createElement('title');
        titleEl.textContent = `The Sports Index | ${sport_names[FILTER_SPORT_OPTION] || ''}`;
        document.head.appendChild(titleEl);
    } else {
     document.title = `The Sports Index | ${sport_names[FILTER_SPORT_OPTION] || ''}`;
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
        const scripts = [
            "../scripts/data_national_teams_script.js",
            "../scripts/data_team_script.js",
            "../scripts/data_league_script.js",
            "../scripts/data_rival_script.js",
            "../scripts/data_tournaments_script.js",
        ];

        scripts.forEach((src) => {
        const s = document.createElement("script");
        s.src = src;
        s.defer = true;
        document.body.appendChild(s); 
        });
    }
});

$(window).on("load", function(){ 
    const title = document.querySelector("h1");
    const FILTER_SPORT_OPTION = title?.getAttribute("name");
    const FILTER_SPORT = title?.getAttribute("id");
    
    //Add Specific Elements Based on Page
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

        if ( FILTER_SPORT_OPTION != 'soccer' && FILTER_SPORT_OPTION != 'rugby' 
            && FILTER_SPORT_OPTION != 'football' && FILTER_SPORT_OPTION != 'hockey') {
         
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