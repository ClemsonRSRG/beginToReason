var markers; // line-indexed array of markers
var succeed = true;
var approved = false;

function removeAllVCMarkers() {
    succeed = true;
    approved = false;

    $.each(markers, function(index, marker){
        if(typeof marker !== "undefined") createEditor.session.removeMarker(marker);
    });

    markers = [];
}

function addVCMarker(VC, style) {
    markers[VC.lineNum] = createEditor.session.addMarker(new Range(VC.lineNum-1, 0, VC.lineNum, 0), style, "", true);
}

function addVCMarkers() {
    removeAllVCMarkers();

    $.each(VCs, function(index, VC){
        if(typeof markers[VC.lineNum] !== "undefined") return;
        addVCMarker(VC, "vc_unverified");
    });
}

function updateMarker(result) {
    $.each(VCs, function(index, VC) {
        console.log(2);
        console.log(JSON.stringify(VC));
        if(VC.vc == result.id) {
            console.log(3);
            createEditor.session.removeMarker(markers[VC.lineNum]);

        //console.log(JSON.stringify(result.result))
            if(result.result.substring(0, "Proved".length) == "Proved") addVCMarker(VC, "vc_proved");
            else {
                addVCMarker(VC, "vc_failed");
                succeed = false;
            }
        }
    });
}
