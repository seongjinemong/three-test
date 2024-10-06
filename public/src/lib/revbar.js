export function setRevBar(id, progress) {
  var elem = document.getElementById(id);

  elem.style.width = progress + "%";
}
