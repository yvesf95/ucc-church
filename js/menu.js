$(document).ready(function(){

    $("#burger-nav").on("click", function(event){

        event.preventDefault();
        $(".sub-nav ul").toggleClass("open");
        
    });

});