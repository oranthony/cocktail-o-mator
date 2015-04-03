

//******************************************
//ANIMATION PART
//******************************************

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
            $( ".searchbar" ).show().animate({
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




//******************************************
//SEARCH PART
//******************************************
  
  
    TypeOfSearch = "Ingredient"; 
    //search the cocktails with the ingredients passed in data by ingedrient
    $('#searchbar').on("input", function() {
      if(TypeOfSearch =='Ingredient') {
        console.log("ingred");
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
        }
      }//i
     if(TypeOfSearch =='Cocktail'){
        //clear tags
        $("#myTags").children().fadeOut();
        AjaxCall(null, 'delete_all');
        //search for dirnks
        var dInput = this.value;
        if(dInput.length > 1){
          $('#result').html('<img src="img/ajax-loader.gif" id="loading" alt="loading" loop=infinite class="img-responsive center-block">');
          $.ajax({
            type: 'GET',
            url: "http://addb.absolutdrinks.com/quickSearch/drinks/" + dInput + "/?apiKey=c6d792879d4b44119788eefc6748393a",
            dataType : 'jsonp',
            crossDomain: true,
            success: OnSuccessDrinkbyIngredient,
            error: function(xhr, error){
            alert(xhr.responseText + ' ' + error + ' ' + xhr.status);
            }}).always(function(){
              $('#loading').remove();
          });     
        }
      }
    });
  

//show the ingredient found in the tab of the type of the ingredient
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
}//OnSuccesstabIngredient

/* When the user click on an ingredient on the table, this function generate the tag then call the function AjaxCall with the selected ingredient*/
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


/* This function generate the recipe of the cocktails
*Ingredient_ID : ID of the ingredient you want to add or remove
*ingredientQuery (not a parameter): contains the id of the cocktails, generated accross time
*action : add or delete
*         "add" adds the id of the ingredient to the query then do the ajax call
*         "delete" delete the id of the ingredient to the query then do the ajax call if there at least one ingredient in the query
*/
function AjaxCall(Ingredient_ID, action) {
  if(!Ingredient_ID) {
            console.log("no ingredient passed");
        }
  //ingredientQuery is a tab which contains the selected ingredients      
  var ingredientQuery =[];

  /*This variable will be used to generate the query passed to the api : the api wants an url with this form 
  "with/lemonade" in order to send the list of the cocktail that we can make with those ingredients*/
  var querry = '';
  
  /* if we want to add new ingredients to the query we go in this boucle */
  if(action == 'add') {      
    ingredientQuery.push(Ingredient_ID);
    
    /* construct the string which will be send to the API's server */
    for(i = 0; i < ingredientQuery.length; ++i){
      querry += 'with/' + ingredientQuery[i] + '/';
    }//for
  }//if

  /* if we want to delete ingredients (when a tag is deleted) to the query we go in this boucle */
  else if(action == 'delete'){
    var IDPos = $.inArray( Ingredient_ID, ingredientQuery );
    ingredientQuery.splice(IDPos, 1)

    /* recreate the query with the element which have not been removed */
    querry = '';
    for(i = 0; i < ingredientQuery.length; ++i){
      querry += 'with/' + ingredientQuery[i] + '/';
    }//for
    if(ingredientQuery.length == 0){
      ClearDrinkShow();
    }//if
  }//else

  else if(action == 'delete_all'){
    querry ='';
    ClearDrinkShow();

  }

  /* Start to search when there is almost 1 ingredient in the query, Here I'm sure the ajax is not called when all the ingredients of the query are deleted */
  if(ingredientQuery.length >= 1){
    $('#result').html('<img src="img/ajax-loader.gif" id="loading" alt="loading" loop=infinite class="img-responsive center-block">');

      // Call ajax after 0,8 seconds, time for the loading Gif to load at least once, more if the ajax call is longer
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
       

     //show the loading gif
      
  }//if    
}//AjaxCall


//show the picture of the drinks found and generate the popover
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
      $('#result').append(
        $('<div />').addClass('col-md-2 col-sm-2 col-lg-2 text-center')
          .append('<img src="' + url +'" id="' + drinkfound.result[i].id  + '" alt="' + drinkfound.result[i].id + '" style="width:200px; height:200px;" data-toggle="popover" data-original-title="' + drinkfound.result[i].name + '" /><p>' + JSON.stringify(drinkfound.result[i].name) + '</p>')
      )//append
      $('#result #' + drinkfound.result[i].id).popover({
        content: recette
      });
    })//GenerateRecipe
  });//each
}//OnSuccessDrinkbyIngredient

//activate the popover
$(function (){ 
  $("#example").popover({trigger: 'focus'});  
});



function ClearDrinkShow(){
  $('#result').children().remove();
}

  
//delete tag
$("#myTags").on('click', '.tag-close', function() {
  $(this).parent().fadeOut();
  var deleted_tag = $(this).parent().attr('class');
  console.log("deleted tag");
  console.log(deleted_tag);
  AjaxCall(deleted_tag, 'delete');

})

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


   $( document.body ).on( 'click', '.dropdown-menu li', function( event ) {

      var $target = $( event.currentTarget );

      $target.closest( '.input-group-btn' )
         .find( '[data-bind="label"]' ).text( $target.text() )
            .end()
         .children( '.dropdown-toggle' ).dropdown( 'toggle' );
         TypeOfSearch = $target.text();
         console.log(TypeOfSearch);
      return false;

   });








