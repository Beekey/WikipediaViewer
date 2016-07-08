$(document).ready(function() {
  // prevent wikipedia viewer text from getting too large on wide screens by setting a fixed font size when screen is wider than 1000px
  if ($(window).width() > 1000) {
    $("#pageTitle").css("font-size", "77px");
  }
  // set initial values for variables that hold the visibility of search bar...
  var formClosed = false;
  // ...and the position of the non search result content
  var boxDown = true;
  // open a random page in new window when the user clicks on the random button (which is a text, not an actual button)
  $("#randomButton").on("click", function() {
    window.open("https://en.wikipedia.org/wiki/Special:Random");
  });
  // detect a search button click
  $("#searchButton").on("click", function() {
    //if search bar is not visible show it and animate it with animate.css fadeIn class
    if (formClosed) {
      $("#wrapper").show();
      $("#wrapper").removeClass("fadeOut");
      $("#wrapper").addClass("fadeIn");
      // update the visibility of search bar to visible
      formClosed = false;
      // switch the text of the search button to I'm done
      $("#searchButton").html("I'm done!");
    }
    // if search bar is visible remove it and animate the exit with animate.css fadeOut class
    else {
      $("#wrapper").removeClass("fadeIn");
      // delay fade our of search bar so the search results can slide out of the page first     
      setTimeout(function() {
        $("#wrapper").addClass("fadeOut")
      }, 500);
      // hide search bar for devices where fadeOut doesn't hide it after execution, do it with a delay so the fadeOut animation can play out first
      setTimeout(function() {
        $("#wrapper").hide();
      }, 1200);
      //  move the search results text down so it slides out of the page
      $("#results").css("padding-top", "28vh");
      // clear the search bar input field
      $("input").val("");
      // after the search results slide down out of the page remove them
      setTimeout(function() {
        $("#results").html("");
      }, 1000);
      // update the visibility of search bar to invisible  
      formClosed = true;
      // enlarge non search result content to initial state
      $("#box").css("margin-top", "5vh");
      $("img").css("height", "initial");
      $("img").css("width", "initial");
      $("#random p").css("font-size", "21px");
      $("#search p").css("font-size", "21px");
      $("#pageTitle").css("font-size", "7vw");
      $("#pageTitle").css("padding-bottom", "2vh");
      // update the position of non search results content
      boxDown = true;
      // switch the text of the search button to Search
      $("#searchButton").html("Search");
    };
  });
  // detect submit form event
  $("form").on("submit", function(e) {
    e.preventDefault();
    // if it's the first submit after clicking search button decrease the size of non search result content and move it up to the top of the page
    if (boxDown) {
      $("#box").css("margin-top", "0.5vh");
      $("img").css("height", "100px");
      $("img").css("width", "100px");
      $("#random p").css("font-size", "17px");
      $("#search p").css("font-size", "17px");
      $("#pageTitle").css("font-size", "19px");
      $("#pageTitle").css("padding-bottom", "0");
      // update the position of the non search result content
      boxDown = false;
    };
    // get the string that was submitted
    var searchString = document.getElementById("inputString").value;
    // make an API call for requested search string
    $.getJSON('https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=' + searchString + '&limit=15&callback=?', function(results) {
      // declare the search results code and set it to empty string
      var searchOutput = "";
      // determine the number of results
      var numberOfResults = results[1].length;
      // if there are no results inform user
      if (numberOfResults === 0) {
        searchOutput = "<br>We didn't find any results to match your search. Sorry! Search again or visit a random Wikipedia page.";
      }
      // if there are results create code to print them
      else {
        for (var i = 0; i < numberOfResults; i++) {
          // skip any undefined results
          if (results[2][i] !== undefined) {
            searchOutput += '<div class="result"><p class="title"><a href="' + results[3][i] + '" target="_blank">' + results[1][i] + '</a></p><div>' + results[2][i] + '</div></div>';
          }
        }
      }
      // show results  
      $("#results").html(searchOutput);
      // change the position of resulst  so they can slide up the page
      $("#results").css("padding-top", "1vh");
    });
  });

});