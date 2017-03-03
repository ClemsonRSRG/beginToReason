var time = Math.floor(Date.now());

function resetTime() {
    time = Math.floor(Date.now());
}

function getTime() {
    return Math.floor(Date.now()) - time;
}
