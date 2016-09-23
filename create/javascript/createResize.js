/**
 * Created by Matthew Pfister on 2/1/2016.
 */
function createResize() {
    var totalHeight = $("html").height();

    var usedHeight = 0;
    usedHeight += $("#header.create").height();
    usedHeight += $("#headette.create").height();
    usedHeight += $("#headette.create").height();
    usedHeight += $("#footer.create").height();
    usedHeight += 36; //for div borders

    if(usedHeight >= totalHeight) {
        $("#editor.create").height(0);
        setTimeout(createResize, 0);
        return;
    }

    var avalHeight = totalHeight - usedHeight;
    $("#editor.create").height(avalHeight);

    setTimeout(createResize, 0);
}
