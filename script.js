// variable to reference the <a-entity> element with the camera and cursor
let cameraGrp = document.getElementById("camera-grp");

// function that is called whenever the cursor is pointing at a waypoint
function gotoPoint() {
    
    // store selected waypoint position to a variable
    let target = event.target.getAttribute("position");
    
    // transition animation properties
    let anim = `property: position; dur: 700; to: ${target.x} ${target.y} ${target.z};`;
    
    // attach animation properties to the animation
    cameraGrp.setAttribute("animation", anim);    
} 