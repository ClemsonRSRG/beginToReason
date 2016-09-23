function showOutline() {
    $("#shades").click(hideOutline);

    $("#outline").animate({left:'0px'});
    $("#shades").css("visibility", "visible");
    $("#shades").animate({opacity: '0.7'}, "fast");
    $("#lessonButton").attr("onclick","hideOutline()");
}

function hideOutline() {
    $("#shades").unbind("click");

    $("#outline").animate({left:'-360px'});
    $("#shades").animate({opacity: '0.0'}, "fast", function() {
        $("#shades").css("visibility", "hidden");
    });
    $("#lessonButton").attr("onclick","showOutline()");

    $("#shades").click(hideOutline);
}

function appendPackageName(name) {
    var htmlString = "<div class=\"packageName\">" + name + "</div>";
    $("#outline").append(htmlString);
}

function appendModuleName(name) {
    var htmlString = "<div class=\"moduleName\">" + name + "</div>";
    $("#outline").append(htmlString);
}

function appendLessons(lessons) {
    $.each(lessons, function(index, value) {
        appendLessonName(value);
    });
    appendModuleBuffer();
}

function appendLessonName(name) {
    var htmlString = "<div class=\"lessonName\">" + name + "</div>";
    $("#outline").append(htmlString);
}

function appendModuleBuffer() {
    var htmlString ="<div class=\"moduleBuffer\"></div>";
    $("#outline").append(htmlString);
}