function teachResize() {
    var totalHeight = $("html").height();

    var usedHeight = 0;
    usedHeight += $("#left .header").height();
    usedHeight += $("#left .headette").height();
    usedHeight += $("#left .footette").height();
    usedHeight += $("#left .footer").height();
    usedHeight += 42; //for div borders

    if (usedHeight >= totalHeight) {
        $("#left .activity").height(0);
        $("#left .reference").height(0);
        setTimeout(teachResize, 0);
        return;
    }

    var avalHeight = totalHeight - usedHeight;

    var activityHeight = avalHeight / 2;
    $("#left .activity").height(activityHeight);

    var referenceHeight = avalHeight - activityHeight;
    $("#left .reference").height(referenceHeight);

    setTimeout(teachResize, 0);
}
