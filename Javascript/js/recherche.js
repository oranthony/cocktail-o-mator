//******************************************
//Redirect to mobile site
//******************************************

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
  window.location = "http://cocktail.anthonyloroscio.fr/mobile.html"
}

//******************************************
//Not allow to press the key enter
//******************************************

$('#searchbar').on("keyup keypress", function(e) {
  var code = e.keyCode || e.which; 
  if (code  == 13) {               
    e.preventDefault();
    return false;
  }
});

//******************************************
//ANIMATION PART
//******************************************

//This var will stock the height of the picture in the home page, in order to push the searchbar at the right place
var pictureHeight = 0;

$(window).load( function(){
  pictureHeight = $(".middle").height();

})
//animate
//searchbar hidden
$( ".searchbar" ).hide();
//height of the div in the home page (picture)
//remove the height of the picture in the main page to the searchbar in order to be on the top

//home page picture move to the left
$(".startbutton").click(function(){
  $(".middle").animate({ 
    right: '5000px'
  }, 800 , function(){
    //search bar appear
    $( ".searchbar" ).animate({
      bottom : pictureHeight
      }, 0, function(){
        $( ".searchbar" ).show().animate({
          left: '1px',
        },200)
      });
  });
});



//resize nav bar
$(window).scroll(function() {
if ($(this).scrollTop() > 1){  
    $('.navbar').addClass("sticky");
    $('body').addClass("sticky");
  }
  else{
    $('.navbar').removeClass("sticky");
    $('body').removeClass("sticky");
  }
});




//******************************************
//SEARCH PART
//******************************************

TypeOfSearch = "Ingredient"; 
//search the cocktails with the ingredients passed in data by ingedrient
$('#searchbar').on("input", function() {
  if(TypeOfSearch =='Ingredient') {
    var dInput = this.value;
    if(dInput.length > 0){
      $.ajax({
          type: 'GET',
          url: "http://addb.absolutdrinks.com/quickSearch/ingredients/"+  dInput +
          "?apiKey=c5be6662554341cdac0fd78d1677193a",
          dataType: 'jsonp',  
          crossDomain: true,
          success: OnSuccesstabIngredient,
          error: function(xhr, error){
            alert(xhr.responseText + ' ' + error + ' ' + xhr.status);
          }//error        
      });//ajax
    }//if
  }//if
  if(TypeOfSearch =='Cocktail'){

    //clear tags
    $("#myTags").children().fadeOut();
    AjaxCall(null, 'delete_all');

    //clear tables
    $('#base-spirit-table').children().fadeOut();
    $('#Mixers-table').children().fadeOut();
    $('#Fruit-table').children().fadeOut();
    $('#Ingredients-table').children().fadeOut();

    //search for dirnks
    var dInput = this.value;
    if(dInput.length > 0){
      $('#result').html('<img src="img/ajax-loader.gif" id="loading" alt="loading"' +
       'loop=infinite class="img-responsive center-block">');
      $.ajax({
        type: 'GET',
        url: "http://addb.absolutdrinks.com/quickSearch/drinks/" + dInput + 
        "/?apiKey=c6d792879d4b44119788eefc6748393a",
        dataType : 'jsonp',
        crossDomain: true,
        success: OnSuccessDrinkbyIngredient,
        error: function(xhr, error){
        alert(xhr.responseText + ' ' + error + ' ' + xhr.status);
        }}).always(function(){
          $('#loading').remove();
      });//ajax     
    }//if
  }//if
});//.on()
  

//show the ingredient found in the tab of the type of the ingredient
function OnSuccesstabIngredient(json){

  //base spirit
  $('#base-spirit-table').html('<thead><tr><th>Base spirit</th></tr></thead>');
  $.each(json.result, function (key, data) {
    if(data.isBaseSpirit == true || data.type == 'spirits-other')
      $('#base-spirit-table').append('<tr><td><a href='+JSON.stringify(data.id)+'>' 
        + JSON.stringify(data.name) + '</a></td></tr>');
  })
 
  //mixers"type":"mixers"
  $('#Mixers-table').html('<thead><tr><th>Mixers</th></tr></thead>');
  $.each(json.result, function (key, data) {
    if(data.type == 'mixers')
      $('#Mixers-table').append('<tr><td><a href='+JSON.stringify(data.id)+'>' 
        + JSON.stringify(data.name) + '</a></td></tr>');
  })

  //fruit
  $('#Fruit-table').html('<thead><tr><th>Fruits</th></tr></thead>');
  $.each(json.result, function (key, data) {
    if(data.type == 'fruits')
      $('#Fruit-table').append('<tr><td><a href='+JSON.stringify(data.id)+'>' 
        + JSON.stringify(data.name) + '</a></td></tr>');
  })

  //Ingredients
  $('#Ingredients-table').html('<thead><tr><th>Ingredients</th></tr></thead>');
  $.each(json.result, function (key, data) {
    if(data.type == 'others')
      $('#Ingredients-table').append('<tr><td><a href='+JSON.stringify(data.id)+'>' 
        + JSON.stringify(data.name) + '</a></td></tr>');
  })
}//OnSuccesstabIngredient

/* When the user click on an ingredient on the table, this function generate the tag then call the function AjaxCall 
with the selected ingredient*/
$('body').on('click', '#base-spirit-table a, #Mixers-table a, #Fruit-table a, #Ingredients-table a', function(event) {
  event.preventDefault();

    //name of the ingredient
    var Ingredient_Name = $(this).text();

    //ID of the ingredient
    var Ingredient_ID = $(this).attr('href');

    /*get the type of the selected ingredient (base-spirit, fruits.....) to have the tag and the table 
    with the same color*/
    var typofTag = $(this).closest('.table').attr('id');

    //create the tag
    typofTag += "-tag";

    //show the tag
    $("#myTags").append('<span id='+ typofTag +' class=' + Ingredient_ID +'>' + Ingredient_Name 
      + '<span class="glyphicon glyphicon-record tag-close"></span></span>')

    //call the function AjaxCall to generate the result with the new Ingredient
    AjaxCall(Ingredient_ID, 'add');
});


/* This function generate the cocktails : send to the api all of the ID of the ingredients you want to check, answer by 
*by the cocktail found
*Ingredient_ID : ID of the ingredient you want to add or remove
*action : add or delete
*         "add" adds the id of the ingredient to the query then do the ajax call
*         "delete" delete the id of the ingredient to the query then do the ajax call if there at least one
           ingredient in the query
*         "delete_all" delete the whole query       
*/

//ingredientQuery is a tab which contains the selected ingredients, generated accross time      
var ingredientQuery =[];

/*This variable will be used to generate the query passed to the api : the api wants an url with this form 
"with/lemonade" in order to send the list of the cocktail that we can make with those ingredients*/
var querry = null;

function AjaxCall(Ingredient_ID, action) {

  /* if we want to add new ingredients to the query we go in this boucle */
  if(action == 'add') {      
    ingredientQuery.push(Ingredient_ID);
    
    /* construct the string which will be send to the API's server */
    if(querry == null){
      querry = 'with/' + Ingredient_ID + '/';
    }else {
        querry += Ingredient_ID + '/';
    }//if(query)
  }//if(action)

  /* if we want to delete ingredients (when a tag is deleted) to the query we go in this boucle */
  else if(action == 'delete'){
    //search for the pos of the ID in the tab
    var IDPos = $.inArray( Ingredient_ID, ingredientQuery );

    //delete the ID
    ingredientQuery.splice(IDPos, 1)

    /* recreate the query with the element which have not been removed */
    querry = '';
    for(i = 0; i < ingredientQuery.length; ++i){
      querry += 'with/' + ingredientQuery[i] + '/';
    }//for
    if(ingredientQuery.length == 0){
      querry = null;
      ClearDrinkShow();
    }//if
  }//else if

  else if(action == 'delete_all'){
    querry = null;
    ClearDrinkShow();
  }//else if

  /* Start to search when there is almost 1 ingredient in the query, Here I'm sure the ajax is not called when 
  all the ingredients of the query are deleted */
  if(ingredientQuery){

    //always show the loading gif
    $('#result').html('<img src="img/ajax-loader.gif" id="loading" alt="loading"' +
     'loop=infinite class="img-responsive center-block">');

      /* Call ajax, remove the loading gif when the call is complete, and then calls the function to show the drinks 
      found*/
      $.ajax({
      type: 'GET',
      url: "http://addb.absolutdrinks.com/drinks/" + querry + "?apiKey=c5be6662554341cdac0fd78d1677193a",
      dataType: 'jsonp',  
      crossDomain: true,
      success: OnSuccessDrinkbyIngredient,
      error: function(xhr, error){
        alert(xhr.responseText + ' ' + error + ' ' + xhr.status);
      }}).always(function(){
        $('#loading').remove();
      });
  }//if    
}//AjaxCall


//show the picture of the drinks found and generate the popover
function OnSuccessDrinkbyIngredient(drinkfound){

  //This var will contain the url of the image of the selected cocktail
  var url;

  //If we the ajax call return nothing(drinkfound is empty), then we delete the cocktails in the page 
  if(drinkfound.totalResult == 0){
    ClearDrinkShow();
  }

  //Create the button next only if there is more cocktails to load
  if(drinkfound.next) {
    $('.searchbar').append(
      $('<div />').addClass('more'))
      $('.more').append(
      $('<div />').addClass('row'),
      $('<div />').addClass('row')
      .append('<button id="morebutton" class="btn btn-default col-xs-4 col-xs-offset-4 col-sm-4 col-sm-offset-4' +  
        'col-md-4 col-md-offset-4"  alt="' + drinkfound.next + '" type="submit">More</button>'))
  };

  $('#result').append($('<div />').addClass('row'));

  $.each(drinkfound.result, function (i, item) {
    url = decodeURI('http://assets.absolutdrinks.com/drinks/transparent-background-white/180x180/'
      +drinkfound.result[i].id+'.png');
    
    //This var will contain the recipe of the cocktails
    var recipe;

    GenerateRecipe(drinkfound.result[i].id).success(function (data){
      
      //This variable will contain the several steps of the cocktail's creation
      var step = ' ';

      //Creation of the recipe
      for(i = 0; i < data.steps.length; ++i){
        //step[i] = drinkInfo.steps[i].textPlain;
        step += data.steps[i].textPlain + ' ';
      }

      recipe = step;
      if (drinkfound.result[i] == undefined){
        return;
      }

      $('#result').children().append(
        $('<div />').addClass('col-md-auto col-md-3 text-center')
          .append('<img src="' + url +'" id="' + drinkfound.result[i].id  + '" alt="' + drinkfound.result[i].id 
            + '" style="width:200px; height:200px;" data-toggle="popover" data-original-title="' 
            + drinkfound.result[i].name + '" /><p>' + JSON.stringify(drinkfound.result[i].name) + '</p>')
      )//append

      $('#result #' + drinkfound.result[i].id).popover({
        content: recipe
      });
    })//GenerateRecipe
  });//each
}//OnSuccessDrinkbyIngredient


function ClearDrinkShow(){
  $('#result').children().fadeOut();
  $('.more').fadeOut();

}

  
//delete tag
$("#myTags").on('click', '.tag-close', function() {
  $(this).parent().fadeOut();
  var deleted_tag = $(this).parent().attr('class');
  AjaxCall(deleted_tag, 'delete');
})

//This function get the cocktail from the more button
$(document.body).on('click', '#morebutton', function() {
  var more = $(this).attr("alt");
  console.log(more);
  $.ajax({
    type: 'GET',
    url: more,
    dataType: 'jsonp',  //use jsonp data type in order to perform cross domain ajax
    crossDomain: true,
    success : OnSuccessDrinkbyIngredient,
    error: function(xhr, error){
      alert(xhr.responseText + ' ' + error + ' ' + xhr.status);
    }        
  });//ajax
  $('.more').fadeOut();
})//.on()

//This function get the recipe from the API
function GenerateRecipe(DrinkFound){
  return $.ajax({
    type: 'GET',
    url: "http://addb.absolutdrinks.com/drinks/" + DrinkFound + "/howtomix/?apiKey=c5be6662554341cdac0fd78d1677193a",
    dataType: 'jsonp',  //use jsonp data type in order to perform cross domain ajax
    crossDomain: true,
    error: function(xhr, error){
      alert(xhr.responseText + ' ' + error + ' ' + xhr.status);
    }        
  });//ajax()
}//GenerateRecipe

//Adapt the type of search according the selected type on the search bar
$( document.body ).on( 'click', '.dropdown-menu li', function( event ) {

  var $target = $( event.currentTarget );

  $target.closest( '.input-group-btn' )
     .find( '[data-bind="label"]' ).text( $target.text() )
        .end()
     .children( '.dropdown-toggle' ).dropdown( 'toggle' );
     TypeOfSearch = $target.text();
  return false;
});

