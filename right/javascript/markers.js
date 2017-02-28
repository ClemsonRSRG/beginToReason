var markers; // line-indexed array of markers
var succeed = true;
var approved = false;

// RESOLVE marker object: It is used to keep track 
// of the following things.
// 1. ACE Editor Marker object
// 2. CSS Style applied to object
// 3. Number of VCs on that line. 
function resolveMarkerObj(marker, style, vcCount) {
	this.aceEditorMarker = marker;
	this.cssStyle = style;
	this.numVCs = vcCount;
}

// Removes all VC markers from ACE Editor and sets 
// the markers array to empty.
function removeAllVCMarkers() {
    succeed = true;
    approved = false;

    $.each(markers, function(index, marker){
        if(typeof marker !== "undefined") createEditor.session.removeMarker(marker.aceEditorMarker);
    });

    markers = [];
}

// This adds a new VC marker. 
function addVCMarker(VC, style) {
    markers[VC.lineNum].aceEditorMarker = createEditor.session.addMarker(new Range(VC.lineNum-1, 0, VC.lineNum, 0), style, "", true);
}

function addVCMarkers() {
    removeAllVCMarkers();

    $.each(VCs, function(index, VC){
		// If we already have a RESOLVE VC Marker, 
		// increment the VC count on that line.
        if(typeof markers[VC.lineNum] !== "undefined") {
			return;
		}
        addVCMarker(VC, "vc_unverified");
    });
}

function updateMarker(result) {
    $.each(VCs, function(index, VC) {
        if(VC.vc == result.id) {
            createEditor.session.removeMarker(markers[VC.lineNum]);

            if(result.result.substring(0, "Proved".length) == "Proved") addVCMarker(VC, "vc_proved");
            else {
                addVCMarker(VC, "vc_failed");
                succeed = false;
            }
        }
    });
}
