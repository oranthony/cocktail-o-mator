










/*$(document).ready(function(){

   var getCocktail = function(){

        var drink = $('#term').val();

         if(drink == ''){

            $('#result').html("<h2 class='loading'>#boulé Please enter something.</h2>");

         } else {

            $('#result').html("<h2 class='loading'>Your cocktail is on its way!</h2>");

            $.getJSON("http://addb.absolutdrinks.com/quickSearch/drinks/" + drink + "/?apiKey=c6d792879d4b44119788eefc6748393a", function(json) {
               if (json != "Nothing found."){
                     $('#result').html('<h2 class="loading">Cocktail found </h2><p><b>Nom</b> : ' + JSON.stringify(json.result) + '</p>');
                  } else {
                     $.getJSON("http://addb.absolutdrinks.com/quickSearch/drinks/" + drink + "/?apiKey=c6d792879d4b44119788eefc6748393a", function(json) {
                        console.log(json);
                        $('#result').html('<h2 class="loading">Nothing found</h2>');
                      });
                  }
                });
            }


        return false;
   }

   $('#search').click(getCocktail);
   $('#term').keyup(function(event){
       if(event.keyCode == 13){
           getCocktail();
       }
   });

});*/

$(document).ready(function(){
    originalForm = $('.searchbar').html();
    $(".startbutton").click(function() {
      $(".middle").fadeOut();
      $( ".searchbar" ).fadeIn();
      $(".startbutton").fadeOut();
    });
    $(".searchbar").on('submit','form', OnSubmit); 

});

function OnSubmit(data){
    var drink = $(this).serialize(); 
    var drink = $('#term').val();
    $(this).find('input').prop('disable', true);
    $(this).fadeOut('fast');
    $('#result').html("<h2 class='loading'>Your cocktail is on its way!</h2>");
    $.ajax({
        type: 'GET',
        url: "http://addb.absolutdrinks.com/quickSearch/drinks/" + drink + "/?apiKey=c6d792879d4b44119788eefc6748393a",
        data: 'json',
        success: OnSuccess,
        error: function(xhr, error){
          alert(xhr.responseText + ' ' + error + ' ' + xhr.status);
        }        
    });
    return false;
}

function OnSuccess(json){
  $('#result').html('<h2 class="loading">Cocktail found </h2>');
  $('#name').html('<p><b>Name</b> : ' + JSON.stringify(json.result[0].name) + '</p>');    
  $('#description').html('<p><b>Description</b> : ' + JSON.stringify(json.result[0].descriptionPlain) + '</p>');
}

$( ".searchbar" ).hide();



//resize nav bar


$(window).scroll(function() {
if ($(this).scrollTop() > 1){  
    $('.navbar').addClass("sticky");
    $('body').addClass("sticky");
    $('.blurheader').addClass("sticky");
  }
  else{
    $('.navbar').removeClass("sticky");
    $('body').removeClass("sticky");
    $('.blurheader').removeClass("sticky");
  }
});


/*addb.init({
    appId: 2467

});
addb.configuration.defaultPageSize = 10;

addb.drinks().load('absolut-cosmopolitan', function(shake) { });*/







// blur effect

/*var pageContent = document.getElementById("notnav"),
  pagecopy = pageContent.cloneNode(true),
  blurryContent = document.getElementById("cleanheader");
  blurryContent.appendChild(pagecopy);
  window.onscroll = function() { blurryContent.scrollTop = window.pageYOffset; }
*/

/*$(function(){
      html2canvas($(".notnav"), { 
        onrendered: function(canvas) {
          $(".blurheader").append(canvas);
          $("canvas").attr("id","canvas");
          stackBlurCanvasRGB('canvas', 0, 0, $("canvas").width(), $("canvas").height(), 20);
        }
        
      
      });
      vv = setTimeout(function(){
        $(".cleanheader").show();
        clearTimeout(vv);
      },200)
})


$(window).scroll(function(){
  $("canvas").css("-webkit-transform", "translatey(-" + $(window).scrollTop() + "px)");
})

window.onresize = function(){
  $("canvas").width($(window).width());
}

$(document).bind('touchmove', function(){
  $("canvas").css("-webkit-transform", "translatey(-" + $(window).scrollTop() + "px)");
})

$(document).bind('touchend', function(){
  $("canvas").css("-webkit-transform", "translatey(-" + $(window).scrollTop() + "px)");
})*/

