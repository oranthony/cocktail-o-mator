

$(document).ready(function(){
    originalForm = $('.searchbar').html();
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
        url: "http://addb.absolutdrinks.com/quickSearch/drinks/" + drink + "/?apiKey=c5be6662554341cdac0fd78d1677193a",
        dataType: 'jsonp',
        crossDomain: true,
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
    $.ajax({
        type: 'GET',
        url: "http://addb.absolutdrinks.com/drinks/with/apple-liqueur/lemonade/?apiKey=c5be6662554341cdac0fd78d1677193a",
        dataType: 'jsonp',
        crossDomain: true,
        success: OnSuccessDrinkbyIngredient,
        error: function(xhr, error){
          alert(xhr.responseText + ' ' + error + ' ' + xhr.status);
        }        
    });
    return false;
}


//******************

function ClearDrinkShow(){
  $('#result').children().remove();
}

//show the picture of the drinks found
function OnSuccessDrinkbyIngredient(drinkfound){
  var url;
  $('#result').children().remove();
  $('#result').append(
    $('<div />').addClass('row')
  )
  
  //contient la recette
  //console.log(drinkfound);
  $.each(drinkfound.result, function (i, item) {
    //console.log(drinkfound.result[i].id);
    url = decodeURI('http://assets.absolutdrinks.com/drinks/transparent-background-white/180x180/'+drinkfound.result[i].id+'.png');
    var recette;
    //console.log(GenerateRecipe(drinkfound.result[i].id));
    GenerateRecipe(drinkfound.result[i].id).success(function (data){
      console.log(data);
      var step = ' ';
      for(i = 0; i < data.steps.length; ++i){
        //step[i] = drinkInfo.steps[i].textPlain;
        step += data.steps[i].textPlain + ' ';
      }
      recette = step;
      console.log('voici la recette :');
        console.log(recette);
        $('#result').append(
          $('<div />').addClass('col-sm-2 text-center')
            .append('<img src="' + url +'" id="' + drinkfound.result[i].id  + '" alt="' + drinkfound.result[i].id + '" style="width:200px; height:200px;" data-toggle="popover" data-original-title="' + drinkfound.result[i].name + '" /><p>' + JSON.stringify(drinkfound.result[i].name) + '</p>')
            //.append('<a href="#" id="example" class="btn btn-success" rel="popover" data-content="recette" data-original-title="Twitter Bootstrap Popover">hover for popover</a> ')
        )
        $('#result #' + drinkfound.result[i].id).popover({
          content: recette
        });
      })//GenerateRecipe
  });
  
}
//*******************

$(function ()  
{ $("#example").popover({trigger: 'focus'});  
});  

//search Ingredient
function SearchIngredient(data){
    var drink = $(this).serialize(); 
    var drink = $('#term').val();
    $(this).find('input').prop('disable', true);
    $(this).fadeOut('fast');
    $('#result').html("<h2 class='loading'>Your cocktail is on its way!</h2>");
    $.ajax({
        type: 'GET',
        url: "http://addb.absolutdrinks.com/quickSearch/ingredients/"+  drink +"?apiKey=c5be6662554341cdac0fd78d1677193a",
        dataType: 'jsonp',  //use jsonp data type in order to perform cross domain ajax
        crossDomain: true,
        success: OnSuccessIngredient,
        error: function(xhr, error){
          alert(xhr.responseText + ' ' + error + ' ' + xhr.status);
        }        
    });
    return false;
}



//animate
  //searchbar hidden
  $( ".searchbar" ).hide();
  //height of the div in the home page (picture)
  var pictureHeight = $(".middle").height();
  //remove the height of the picture in the main page to the searchbar in order to be on the top
  $(".searchbar").css( "top", "-" + pictureHeight + "px" );
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


$('#searchbar').on("input", function() {
  var dInput = this.value;
  if(dInput.length > 1){
    $.ajax({
        type: 'GET',
        url: "http://addb.absolutdrinks.com/quickSearch/ingredients/"+  dInput +"?apiKey=c5be6662554341cdac0fd78d1677193a",
        dataType: 'jsonp',  
        crossDomain: true,
        success: OnSuccesstabIngredient,
        error: function(xhr, error){
          alert(xhr.responseText + ' ' + error + ' ' + xhr.status);
        }        
    });
  }//i
});

function OnSuccesstabIngredient(json){

  //base spirit
  $('#base-spirit-table').html('<thead><tr><th>Base spirit</th></tr></thead>');
  $.each(json, function (key, data) {
    $.each(data, function (index, data) {
      if(data.isBaseSpirit == true || data.type == 'spirits-other')
        $('#base-spirit-table').append('<tr><td><a href='+JSON.stringify(data.id)+'>' + JSON.stringify(data.name) + '</a></td></tr>');
    })
  })
 


  //mixers"type":"mixers"
  $('#Mixers-table').html('<thead><tr><th>Mixers</th></tr></thead>');
  $.each(json, function (key, data) {
    $.each(data, function (index, data) {
      if(data.type == 'mixers')
        $('#Mixers-table').append('<tr><td><a href='+JSON.stringify(data.id)+'>' + JSON.stringify(data.name) + '</a></td></tr>');
    })
  })

  //fruit
  $('#Fruit-table').html('<thead><tr><th>Fruits</th></tr></thead>');
  $.each(json, function (key, data) {

    $.each(data, function (index, data) {
      if(data.type == 'fruits')
        $('#Fruit-table').append('<tr><td><a href='+JSON.stringify(data.id)+'>' + JSON.stringify(data.name) + '</a></td></tr>');
    })
  })

  //Ingredients
  $('#Ingredients-table').html('<thead><tr><th>Ingredients</th></tr></thead>');
  $.each(json, function (key, data) {
    $.each(data, function (index, data) {
      if(data.type == 'others')
        $('#Ingredients-table').append('<tr><td><a href='+JSON.stringify(data.id)+'>' + JSON.stringify(data.name) + '</a></td></tr>');
    })
  })
  
}

//delete tag
$("#myTags").on('click', '.tag-close', function() {
  $(this).parent().fadeOut();
  var deleted_tag = $(this).parent().attr('class');
  console.log("deleted tag");
  console.log(deleted_tag);
  AjaxCall(deleted_tag, 'delete');

})





//get the id of the clicked row in table
var ingredientQuery =[];
$('body').on('click', '#base-spirit-table a, #Mixers-table a, #Fruit-table a, #Ingredients-table a', function(event) {
  event.preventDefault();

        //name of the ingredient
        var Ingredient_Name = $(this).text();

        //ID of the ingredient
        var Ingredient_ID = $(this).attr('href');

        //get the type of the selected ingredient (base-spirit, fruits.....) to have the tag and the table with the same color
        var typofTag = $(this).closest('.table').attr('id');
        //create the tag
        typofTag += "-tag";
        //show the tag
        $("#myTags").append('<span id='+ typofTag +' class=' + Ingredient_ID +'>' + Ingredient_Name + '<span class="glyphicon glyphicon-record tag-close"></span></span>')

        AjaxCall(Ingredient_ID, 'add');

        
    });

var savequery;
function AjaxCall(Ingredient_ID, action) {
  if(!Ingredient_ID) {
            console.log("no ingredient passed");
        }

  var querry = '';
  if(action == 'add') {      
    ingredientQuery.push(Ingredient_ID);
    
    for(i = 0; i < ingredientQuery.length; ++i){
      querry += 'with/' + ingredientQuery[i] + '/';
    }
    console.log("query when added");
    console.log(querry);
  }
  else if(action == 'delete'){
    var IDPos = $.inArray( Ingredient_ID, ingredientQuery );
    console.log("IDPos");
    console.log(IDPos);
    ingredientQuery.splice(IDPos, 1)
    console.log("ingredientQuery whithout id");
    console.log(ingredientQuery);
    querry = '';
    for(i = 0; i < ingredientQuery.length; ++i){
      querry += 'with/' + ingredientQuery[i] + '/';
    }
    if(ingredientQuery.length == 0){
      ClearDrinkShow();
    }
  }
  if(ingredientQuery.length >= 1){

    
    setTimeout(function() {
      // Do something after 3 seconds
      // This can be direct code, or call to some other function
      $.ajax({
      type: 'GET',
      url: "http://addb.absolutdrinks.com/drinks/" + querry + "?apiKey=c5be6662554341cdac0fd78d1677193a",
      dataType: 'jsonp',  
      crossDomain: true,
      success: OnSuccessDrinkbyIngredient,
      error: function(xhr, error){
        alert(xhr.responseText + ' ' + error + ' ' + xhr.status);
      }        
    });
     }, 800);    

    $('#result').html('<img src="img/ajax-loader.gif" id="loading" alt="loading" loop=infinite class="img-responsive center-block">');
    
     
  }
   console.log(querry);     
  
}

function GenerateRecipe(DrinkFound){
  //console.log("appel depuis la fonct");
  //console.log(DrinkId);

  return $.ajax({
    type: 'GET',
    url: "http://addb.absolutdrinks.com/drinks/" + DrinkFound + "/howtomix/?apiKey=c5be6662554341cdac0fd78d1677193a",
    dataType: 'jsonp',  //use jsonp data type in order to perform cross domain ajax
    crossDomain: true,
    error: function(xhr, error){
      alert(xhr.responseText + ' ' + error + ' ' + xhr.status);
    }        
  });

}
