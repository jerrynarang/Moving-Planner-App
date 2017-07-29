
function loadData() {

    /*
    The $ that shows up in variable names, like $body for example, is just a character like any other. In this case, it refers to the fact that the variable referenced by $body is a jQuery collection, not a DOM node.
    */
    // we are creating a few variables having dollar sign in front of them
    // $ is just a character that we use to identify the fact that this is a jQuery object ( in Lhs)
    // In Rhs , we are selecting a jQuery object by using $ sign and then we pass a string of element that we want in the parenthesis
    // # or pound sign represents an ID
    // for example, wikiElem represents a jQuery object of the wikipedia links element
    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + ', ' + cityStr;

    $greeting.text('So, you want to live at ' + address + '?');


    // load streetview
    var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '';
    $body.append('<img class="bgimg" src="' + streetviewUrl + '">');


    // YOUR NYTIMES AJAX REQUEST GOES HERE!
    // q is a Search query term. Search is performed on the article body, headline and byline
    // By default, search results are sorted by their relevance to the query term (q). Use the sort parameter to sort by pub_date."
    // Allowed values for sort are newest & oldest
    var nytimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + cityStr + '&sort=newest&api-key=563bcc9700b84b748b4ef602b9bc33a3';
    
    // Passing a url string and an anonymous function.This anonymous fn would run when the response returns from the server 
    $.getJSON(nytimesUrl, function(data){

        $nytHeaderElem.text('New York Times Articles About ' + cityStr); // setting text of the header element
        articles = data.response.docs; // actual response -- articles object is from data response and has docs inside of it
        // iterating through data object
        for (var i = 0; i < articles.length; i++) {
            var article = articles[i];
            $nytElem.append('<li class="article">'+
                '<a href="'+article.web_url+'">'+article.headline.main+'</a>'+
                '<p>' + article.snippet + '</p>'+
            '</li>');
        };

    }).error(function(e){             // Chaining --> It's when you attach a method to the end of another method
        $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
    });


    // load wikipedia data
    wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + '&format=json&callback=wikiCallback';
    // YOUR CODE GOES HERE!
    // setTimeout is used to stop the request if it runs for too long
    // In this we are automatically starting a timer that will end 8000 milliseconds later

    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("failed to get wikipedia resources");
    }, 8000);

    // url can either be created as a parameter and set to wikiUrl as shown 
    // or can be passed as shown in comments 
    $.ajax(/*wikiUrl, */{
        url: wikiUrl,
        dataType: "jsonp", // indicates that this is a jsonp request
        // jsonp: "callback",
        success: function( response ) {
            var articleList = response[1];  // articleList is set equal to the array of articles returned from wikipedia's response

            for (var i = 0; i < articleList.length; i++) {
                articleStr = articleList[i]; //Name of the article
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="' + url +'">' + articleStr + '</a></li>');
            };

            clearTimeout(wikiRequestTimeout); // This clearTimeout will clear or stop this timeout from happening
            // if this is not done,request will be cleared whatever happens after 8 seconds
        }
    })

    return false;
};

$('#form-container').submit(loadData);
