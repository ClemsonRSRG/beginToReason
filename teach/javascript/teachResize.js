/**
 * Created by Matthew Pfister on 2/1/2016.
 */
function teachResize() {
    var totalHeight = $("html").height();

    var usedHeight = 0;
    usedHeight += $("#header.teach").height();
    usedHeight += $("#headette.teach").height();
    usedHeight += $("#headette.teach").height();
    usedHeight += $("#footer.teach").height();
    usedHeight += 42; //for div borders

    if(usedHeight >= totalHeight) {
        $("#objective.teach").height(0);
        $("#problem.teach").height(0);
        setTimeout(teachResize, 0);
        return;
    }

    var avalHeight = totalHeight - usedHeight;

    var objectiveHeight = avalHeight / 2;
    $("#objective.teach").height(objectiveHeight);

    var problemHeight = avalHeight - objectiveHeight;
    $("#problem.teach").height(problemHeight);

    setTimeout(teachResize, 0);
}
