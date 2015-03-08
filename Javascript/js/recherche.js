










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
    /*$(".startbutton").click(function() {
      $(".middle").fadeOut();
      $( ".searchbar" ).fadeIn();
      $(".startbutton").fadeOut();
    });*/
    $(".searchbar").on('submit','form', SearchIngredient); 

});

//search for drink
function SearchDrinkbyName(data){
    var drink = $(this).serialize(); 
    var drink = $('#term').val();
    $(this).find('input').prop('disable', true);
    $(this).fadeOut('fast');
    $('#result').html("<h2 class='loading'>Your cocktail is on its way!</h2>");
    $.ajax({
        type: 'GET',
        url: "http://addb.absolutdrinks.com/quickSearch/drinks/" + drink + "/?apiKey=c6d792879d4b44119788eefc6748393a",
        data: 'json',
        success: OnSuccessName,
        error: function(xhr, error){
          alert(xhr.responseText + ' ' + error + ' ' + xhr.status);
        }        
    });
    return false;
}

function OnSuccessName(json){
  $('#result').html('<h2 class="loading">Cocktail found </h2>');
  $('#name').html('<p><b>Name</b> : ' + JSON.stringify(json.result[0].name) + '</p>');    
  $('#description').html('<p><b>Description</b> : ' + JSON.stringify(json.result[0].descriptionPlain) + '</p>');
}


//search by ingedrient
function SearchDrinkbyIngredient(data){
    var drink = $(this).serialize(); 
    var drink = $('#term').val();
    $(this).find('input').prop('disable', true);
    $(this).fadeOut('fast');
    $('#result').html("<h2 class='loading'>Your cocktail is on its way!</h2>");
    $.ajax({
        type: 'GET',
        url: "http://addb.absolutdrinks.com/drinks/with/" + drink + "/?apiKey=c6d792879d4b44119788eefc6748393a",
        data: 'json',
        success: OnSuccessDrinkbyIngredient,
        error: function(xhr, error){
          alert(xhr.responseText + ' ' + error + ' ' + xhr.status);
        }        
    });
    return false;
}

function OnSuccessDrinkbyIngredient(json){
  $('#result').html('<h2 class="loading">Cocktail found </h2>');
  $('#name').html('<p><b>Name</b> : ' + JSON.stringify(json.result[0].name) + '</p>');    
  $('#description').html('<p><b>Description</b> : ' + JSON.stringify(json.result[0].description) + '</p>')
}


//search Ingredient
function SearchIngredient(data){
    var drink = $(this).serialize(); 
    var drink = $('#term').val();
    $(this).find('input').prop('disable', true);
    $(this).fadeOut('fast');
    $('#result').html("<h2 class='loading'>Your cocktail is on its way!</h2>");
    $.ajax({
        type: 'GET',
        url: "http://addb.absolutdrinks.com/quickSearch/ingredients/"+  drink +"?apiKey=c6d792879d4b44119788eefc6748393a",
        data: 'json',
        success: OnSuccessIngredient,
        error: function(xhr, error){
          alert(xhr.responseText + ' ' + error + ' ' + xhr.status);
        }        
    });
    return false;
}

function OnSuccessIngredient(json){
  $('#result').html('<h2 class="loading">Cocktail found </h2>');
  $('#name').html('<p><b>Name</b> : ' + JSON.stringify(json.result[0].name) + '</p>');    
  $('#description').html('<p><b>Description</b> : ' + JSON.stringify(json.result[0].description) + '</p>')
}










$( ".searchbar" ).hide();


//animate

  //home page picture move to the left
  $(".startbutton").click(function(){
        $(".middle").animate({ 
          right: '5000px'
        }, 700 , function(){
            //search bar appear
            $( ".searchbar" ).show();
            $(".searchbar").animate({
              left: '1px'
              }, 200);
        });
  });

//inscription appear

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

//suggest
/*
$('#search').keyup(function() {

$.getJSON('../data.json', function(data) {
     var output = '<ul class= "searchresults">';
     $.each(data, function (key, val){ 
         output += '<li>';
         output += '<h2>' + val.name + '<h2>';
         output += '<img src="images/' + val.shortname + '+_tn.jpg" alt="' + val.name + '" />';
         output += '<p>' + val.bio + '</p>';
         output += '</li>';
     }) ;
    output += '</ul>';
    $('#update').html(output);
});//end of $.getJSON 

    });// End of $("search)
*/

$('#searchbar').on("input", function() {
  var dInput = this.value;
  if(dInput.length > 1){
    $.ajax({
        type: 'GET',
        url: "http://addb.absolutdrinks.com/quickSearch/ingredients/"+  dInput +"?apiKey=c6d792879d4b44119788eefc6748393a",
        data: 'json',
        success: OnSuccesstabIngredient,
        error: function(xhr, error){
          alert(xhr.responseText + ' ' + error + ' ' + xhr.status);
        }        
    });
  }//i
});

function OnSuccesstabIngredient(json){
  //$('#result').html('<h2 class="loading">Cocktail found </h2>');

  //base spirit
  $('#base-spirit-table').html('<thead><tr><th>Base spirit</th></tr></thead>');
  $.each(json, function (key, data) {
    $.each(data, function (index, data) {
      if(data.isBaseSpirit == true || data.type == 'spirits-other')
        $('#base-spirit-table').append('<tr><td>' + JSON.stringify(data.name) + '</td></tr>');
    })
  })

  //mixers"type":"mixers"
  $('#Mixers-table').html('<thead><tr><th>Mixers</th></tr></thead>');
  $.each(json, function (key, data) {
    $.each(data, function (index, data) {
      if(data.type == 'mixers')
        $('#Mixers-table').append('<tr><td>' + JSON.stringify(data.name) + '</td></tr>');
    })
  })

  //fruit
  $('#Fruit-table').html('<thead><tr><th>Fruits</th></tr></thead>');
  $.each(json, function (key, data) {
    $.each(data, function (index, data) {
      if(data.type == 'fruits')
        $('#Fruit-table').append('<tr><td>' + JSON.stringify(data.name) + '</td></tr>');
    })
  })

  //Ingredients
  $('#Ingredients-table').html('<thead><tr><th>Ingredients</th></tr></thead>');
  $.each(json, function (key, data) {
    $.each(data, function (index, data) {
      if(data.type == 'others')
        $('#Ingredients-table').append('<tr><td>' + JSON.stringify(data.name) + '</td></tr>');
    })
  })
  
}









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

