var markers; // line-indexed array of markers
var succeed = true;
var approved = false;

/* 
  RESOLVE marker object: It is used to keep track 
  of the following things.
  1. ACE Editor Marker object
  2. CSS Style applied to object
  3. Number of VCs yet to be processed on that line.
*/
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

// This adds a new RESOLVE VC marker with a VC count of 1. 
function addVCMarker(VC, style) {
	markers[VC.lineNum] = new resolveMarkerObj(createEditor.session.addMarker(new Range(VC.lineNum-1, 0, VC.lineNum, 0), style, "", true), style, 1);
}

// This adds a "vc_unverified" marker to lines that have VCs to be verified.
function addVCMarkers() {
    removeAllVCMarkers();

    $.each(VCs, function(index, VC){
		// If we already have a RESOLVE VC Marker, 
		// increment the VC count on that line.
        if(typeof markers[VC.lineNum] !== "undefined") {
			markers[VC.lineNum].numVCs++;
			return;
		}
        addVCMarker(VC, "vc_unverified");
    });
}

// This updates the RESOLVE VC marker object with a new ACE Editor marker 
// and stores the style for future use.
function updateVCMarker(VC, style) {
	markers[VC.lineNum].aceEditorMarker = createEditor.session.addMarker(new Range(VC.lineNum-1, 0, VC.lineNum, 0), style, "", true);
	markers[VC.lineNum].cssStyle = style;
}

/* 
  Depending on the prover results, a VC could either be "proved" or 
  "unable to prove using the givens and/or theories". Since there could be 
  multiple VCs per line, we don't want to have the flipping effect where 
  we switch from the "proved" style to "failed" style. Below is the update 
  conditions we consider:
  1. When we encounter a "unproved" VC, switch the style to "vc_failed". 
     It will remain that way until we call "removeAllVCMarkers".
  2. When we encounter a "proved" VC, but there are more VCs to be processed
     on that line, we do nothing and keep the style that it already has.
  3. When we encounter a "proved" VC and it is the last one to be processed 
     on that line, switch the style to "vc_proved". It will remain that way until 
     we call "removeAllVCMarkers".
*/
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
