
//search the cocktails with the ingredients passed in data by ingedrient
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

//*******************name of table changed

//show the ingredient found in the tab of the type of the ingredient
function OnSuccesstabIngredient(json){

  //base spirit
  $('#base-spirit').empty();
  $.each(json, function (key, data) {
    $.each(data, function (index, data) {
      if(data.isBaseSpirit == true || data.type == 'spirits-other')
        $('#base-spirit').append('<li class="ui-li-static ui-body-inherit"><a style="color:#E8BC6F" text-decoration: none; href='+JSON.stringify(data.id)+'>' + JSON.stringify(data.name) + '</a></li>');
    })
  })
  //$('#base-spirit ul').listview().listview('refresh');

  //mixers"type":"mixers"
  $('#mixers').empty();
  $.each(json, function (key, data) {
    $.each(data, function (index, data) {
      if(data.type == 'mixers')
        $('#mixers').append('<li class="ui-li-static ui-body-inherit"><a style="color:#FF635E" text-decoration: none; href='+JSON.stringify(data.id)+'>' + JSON.stringify(data.name) + '</a></li>');
    })
  })
 // $('#mixers').

  //fruit
  $('#fruits').empty();
  $.each(json, function (key, data) {
    $.each(data, function (index, data) {
      if(data.type == 'fruits')
        $('#fruits').append('<li class="ui-li-static ui-body-inherit"><a style="color:#A8A0E8" text-decoration: none; href='+JSON.stringify(data.id)+'>' + JSON.stringify(data.name) + '</a></li>');
    })
  })

  //Ingredients
  $('#ingredients').empty();
  $.each(json, function (key, data) {
    $.each(data, function (index, data) {
      if(data.type == 'others')
        $('#ingredients').append('<li class="ui-li-static ui-body-inherit"><a style="color:#6EC6FF" text-decoration: none; href='+JSON.stringify(data.id)+'>' + JSON.stringify(data.name) + '</a></li>');
    })
  })
  //$('#base-spirit').
}//OnSuccesstabIngredient

//*******************name of table changed

/* When the user click on an ingredient on the table, this function generate the tag then call the function AjaxCall with the selected ingredient*/
$('body').on('click', '#base-spirit a, #mixers a, #fruit a, #ingredients a', function(event) {
  event.preventDefault();

    //name of the ingredient
    var Ingredient_Name = $(this).text();

    //ID of the ingredient
    var Ingredient_ID = $(this).attr('href');

    //get the type of the selected ingredient (base-spirit, fruits.....) to have the tag and the table with the same color
    var typofTag = $(this).closest('ul').attr('id');

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

  /* Start to search when there is almost 1 ingredient in the query, Here I'm sure the ajax is not called when all the ingredients of the query are deleted */
  if(ingredientQuery.length > 0){
    setTimeout(function() {
      // Call ajax after 0,8 seconds, time for the loading Gif to load at least once, more if the ajax call is longer
      $.ajax({
      type: 'GET',
      url: "http://addb.absolutdrinks.com/drinks/" + querry + "?apiKey=c5be6662554341cdac0fd78d1677193a",
      dataType: 'jsonp',  
      crossDomain: true,
      success: OnSuccessDrinkbyIngredient,
      error: function(xhr, error){
        alert(xhr.responseText + ' ' + error + ' ' + xhr.status);
      }});
     }, 800);   

     //show the loading gif
    $('#result').html('<img src="img/ajax-loader.gif" id="loading" alt="loading" loop=infinite class="img-responsive center-block">');  
  }//if    
}//AjaxCall


//show the picture of the drinks found and generate the popover
function OnSuccessDrinkbyIngredient(drinkfound){
  var url;
  $('#result').children().remove();
  $.each(drinkfound.result, function (i, item) {
    url = decodeURI('http://assets.absolutdrinks.com/drinks/transparent-background-white/180x180/'+drinkfound.result[i].id+'.png');
    var recette;
    GenerateRecipe(drinkfound.result[i].id).success(function (data){
      console.log(data);
      var step = ' ';
      for(i = 0; i < data.steps.length; ++i){
        //step[i] = drinkInfo.steps[i].textPlain;
        step += data.steps[i].textPlain + ' ';
      }
      recette = step;
      if(typeof drinkfound.result[i] !== undefined){
        $('#result').append(
          $('<div />').addClass('col-sm-2 text-center')
            .append('<img src="' + url +'" id="' + drinkfound.result[i].id  + '" alt="' + drinkfound.result[i].id + '" style="width:200px; height:200px;" data-toggle="popover" data-original-title="' + drinkfound.result[i].name + '" /><p>' + JSON.stringify(drinkfound.result[i].name) + '</p>')
        )//append
      }//if
      $('#result #' + drinkfound.result[i].id).popover({
        content: recette,
        placement: 'top'
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











