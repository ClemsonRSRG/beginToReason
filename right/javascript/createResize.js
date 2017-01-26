/**
 * Created by Matthew Pfister on 2/1/2016.
 */
function createResize() {
    var totalHeight = $("html").height();

    var usedHeight = 0;
    usedHeight += $("#right .header").height();
    usedHeight += $("#right .headette").height();
    usedHeight += $("#right .footette").height();
    usedHeight += $("#right .footer").height();
    usedHeight += $("#right .footetteDisabled").height();
    usedHeight += 36; //for div borders

    if(usedHeight >= totalHeight) {
        $("#editor").height(0);
        setTimeout(createResize, 0);
        return;
    }

    var avalHeight = totalHeight - usedHeight;
    $("#editor").height(avalHeight);

    setTimeout(createResize, 0);
}
