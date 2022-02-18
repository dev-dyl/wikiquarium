$(document).ready(function(){
    $("nav").hide();
    $("#navigation").hide();
    
    $(".playground").animate({
        top: "0",
        height: "100vh"
    }, 2500, function(){
        $("nav").slideDown();
    });
    
    
    $("#menu-button").click(function(){
        $("#navigation").slideToggle();
    });
})
