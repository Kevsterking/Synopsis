/*
  read json file and construct diagram, add json file to filebuilder
*/

/*
  let user download file as json
*/

/*
  Let user place and drag entities
*/

let followingObj = null, isFollowingCursor = false;
function setFollowCursor(obj) {
  followingObj = obj;
  isFollowingCursor = true;
}
function unsetFollowCursor() {
  followingObj = null;
  isFollowingCursor = false;
}

function enableProcessBox() {
  let box = document.createElement("div");
  box.style.position = "absolute";
  box.style.width = "200px";
  box.style.height = "45px";
  box.style.border = "2px solid black";
  document.getElementById('canvas').appendChild(box);

  setFollowCursor(box);
}

$(window).on('load', function() {
  $("button#processBox").on('click', function() {
    enableProcessBox();
  });

  $("div#canvas").on('mousemove', function(e) {
    canvasAnimation(e);
  });

});

function canvasAnimation(e) {
  if (followingObj === null) return;

  let obj = $(followingObj);
  obj.css({
    "left": e.clientX - obj.width() / 2 + "px",
    "top": e.clientY + "px",
  });

}
