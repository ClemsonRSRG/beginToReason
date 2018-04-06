var markers = [];

function addMarker(lineNum, status) {
    if (status == 'success') {
        markers.push(createEditor.session.addMarker(new Range(lineNum-1, 0, lineNum, 0), 'vc_proved'));
    } else {
        markers.push(createEditor.session.addMarker(new Range(lineNum-1, 0, lineNum, 0), 'vc_failed'));
    }
}

function addLines(lines) {
    removeMarkers();
    for (line of lines) {
        addMarker(line.lineNum, line.status);
    }
}

function removeMarkers() {
    for (marker of markers) {
        createEditor.session.removeMarker(marker);
    }

    markers = [];
}
