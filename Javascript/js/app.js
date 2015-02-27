$(document).ready(function(){
    originalForm = $('.container').html();
    $(".container").on('submit','form', OnSubmit); 
});

function OnSubmit(data){
    var donnees = $(this).serialize(); 
    $(this).find('input').prop('disable', true);
    $(this).fadeOut('fast');

    $.ajax({
        type: $(this).attr("method"),
        url: $(this).attr("action"),
        data: donnees,
        success: OnSuccess
    });

    return false;
}

function OnSuccess(result){
    $('form.form-signin').hide();  
    console.log(originalForm);
    if(result.success !== undefined){
        if (result.success && result.logout === undefined) {
            $('.container form h2').append().text(result.message);	 

            $('form.form-signin :input').each(function(){ 
                $('input').remove()
            });

            $('form.form-signin').append('<input type="hidden" name="logout" value="true"/>'); 
            $('form button').toggleClass('btn-danger').text('Logout');
       
        }else if (result.logout === true) {
            $('.container').hide(); 
            $('.container').html(originalForm).fadeIn();
        }
    
    }else {
        $('#result').text('Aucun message :(');
    }	

     $('form').fadeIn('slow');
}
