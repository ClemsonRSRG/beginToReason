var markers; // line-indexed array of markers
var succeed = true;
var approved = false;

function removeAllVCMarkers() {
    failed = true;
    approved = false;

    $.each(markers, function(index, marker){
        if(typeof marker !== "undefined") editor.session.removeMarker(marker);
    });

    markers = [];
}

function addVCMarker(VC, style) {
    alert("hi");
    markers[VC.lineNum] = editor.session.addMarker(new Range(VC.lineNum-1, 0, VC.lineNum, 0), style, "", false);
    alert("bye");
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
        if(VC.vc == result.id) {
            editor.session.removeMarker(markers[VC.lineNum]);

            if(result.result.substring(0, "Proved".length) == "Proved") addVCMarker(VC, "vc_proved");
            else {
                addVCMarker(VC, "vc_failed");
                succeed = false;
            }
        }
    });
}