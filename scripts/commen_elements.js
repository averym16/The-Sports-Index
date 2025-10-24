$(document).ready(function() {
    const now = new Date();
    const title = document.querySelector("h1");
    const FILTER_SPORT_OPTION = title?.getAttribute("name");
    const FILTER_SPORT = title?.getAttribute("id");
    
    
    //Create Footer Element
    $("#footer").html('<section id="contact_info"><h3>Contact Us</h3><p>Email: <a href="https://www.youtube.com/watch?v=xeSpzHqQT2w&t=0h0m46s" target="_blank">averymorrison26@gmail.com</a></p><p>Github:<a href="https://github.com/averym16" target="_blank">averym16</a></p></section>');
    $("#footer").append('<section id="footer-misc"><p><a href="../CREDITS.txt">Sources</a></p><p>Last Updated: 10/21/2025 18:20:00</p><p>Licensed by <a href="../LICENSE.txt">MIT</a></p></section>');

    //Create Navbar
    $("#navbar").html('<ul class="navbar_list"><li id="home"><a href="#navbar">Home</a></li><li><a href="https://www.youtube.com/watch?v=b4Zp75xe6tE&t=11s" target="_blank">About</a></li><li><a href="#footer">Contact</a></li><li><a href="https://www.youtube.com/watch?v=V3R9y5v8GUY&t=0h0m11s" target="_blank">Donate</a></li></ul>');

});

$(window).on("load", function(){ 
    console.log("navbar_list exists:", $('.navbar_list').length);
    const now = new Date();
    const title = document.querySelector("h1");
    const FILTER_SPORT_OPTION = title?.getAttribute("name");
    const FILTER_SPORT = title?.getAttribute("id");
        //Add Elements to Navbar Based on Page
    if ( FILTER_SPORT === 'home' ){
        $('#home').html('<a href="#navbar">Home</a>');
    }
    else{

        $('#home').html('<a href="../index.html">Home</a>');
    
        if ( FILTER_SPORT_OPTION != 'soccer' && FILTER_SPORT_OPTION != 'rugby' 
            && FILTER_SPORT_OPTION != 'football' && FILTER_SPORT_OPTION != 'hockey') {
         
            $('.navbar_list').append('<li id="option1"><a href="#leagues">Leagues</a></li>');
            $('.navbar_list').append('<li id="option2"><a href="#tournaments">Tournaments</a></li>');
            
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