const sport_names = {"men_rugby": "Men's Rugby", "women_rugby": "Women's Rugby", "men_soccer": "Men's Soccer", "women_soccer": "Women's Soccer",
    "nfl": "NFL", "nhl": "NHL", "college_hockey": "NCAA D1 Men's Hockey", "college_football": "NCAA FBS 1 Football", "hockey": "Hockey", "rugby": "Rugby",
    "soccer": "Soccer", "football": "Football", "home": "Home"};

$(document).ready(function (){ 
    const params = new URLSearchParams(window.location.search);
    const sport = params.get('sport');
    const option = params.get('option');

    if (sport && option)
    {
        $('h1').attr('id',sport);
        $('h1').attr('name', option);
        $('h1').text(`${sport_names[option]}`);

        if(option === 'nfl' || option === 'nhl'){
            $('#tournaments').attr('id', 'teams');
        }
        else if ( option === 'college_hockey' || option === 'college_football'){
            $('#tournaments').attr('id', 'rivalries');
        }
        else if (sport === 'rugby')
        {
        
            if (!$('#teams').length) {
                $('#tournaments').after('<section id="teams"></section>');
            }
        }
        $.getScript("../scripts/commen_elements.js");
    }
});