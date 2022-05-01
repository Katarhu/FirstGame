var startDragging = false;

var dragImage = document.querySelector('.container');

var elementX = 0;
var elementY = 0;

dragImage.addEventListener("mousedown", startDrag, false);
dragImage.addEventListener("mouseup", stopDrag, false);
dragImage.addEventListener("mousemove", drag, false);

function startDrag(e) {
  startDragging = true;
  elementX = e.clientX - dragImage.offsetLeft;
  elementY = e.clientY - dragImage.offsetTop;
}
function stopDrag(e) {
    startDragging = false;
    dragImage.style.left = 0;
    dragImage.style.top = 0;
}
function drag(e) {
  if (startDragging) {
    var xPos = (e.clientX - elementX) * 0.1;
    var yPos = (e.clientY - elementY) * 0.1;
    dragImage.style.left = xPos + "px";
    dragImage.style.top = yPos + "px";
  }
}