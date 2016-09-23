function showNextBar() {
    $("#nextBar").css("visibility", "visible");
    $("#nextBar").animate({bottom:'51px', height:'60px'});
}

function hideNextBar() {
    $("#nextBar").animate({bottom:'0px', height:'51px'}, function() {
        $("#nextBar").css("visibility", "hidden");
    });
}