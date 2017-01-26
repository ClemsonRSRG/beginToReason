/**
 * Created by Matthew Pfister on 2/1/2016.
 */
function teachResize() {
    var totalHeight = $("html").height();

    var usedHeight = 0;
    usedHeight += $("#left .header").height();
    usedHeight += $("#left .headette").height();
    usedHeight += $("#left .footette").height();
    usedHeight += $("#left .footer").height();
    usedHeight += 42; //for div borders

    if(usedHeight >= totalHeight) {
        $("#left .objective").height(0);
        $("#left .reference").height(0);
        setTimeout(teachResize, 0);
        return;
    }

    var avalHeight = totalHeight - usedHeight;

    var objectiveHeight = avalHeight / 2;
    $("#left .objective").height(objectiveHeight);

    var referenceHeight = avalHeight - objectiveHeight;
    $("#left .reference").height(referenceHeight);

    setTimeout(teachResize, 0);
}
