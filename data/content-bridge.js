/* globals unsafeWindow, cloneInto */

"use strict";

unsafeWindow.navigator.loci_addon = true;

window.addEventListener("content-to-addon", function(event) {
  self.port.emit("content-to-addon", JSON.parse(event.detail));
}, false);

self.port.on("addon-to-content", function(data) {
  const clonedData = cloneInto(data, document.defaultView);
  window.dispatchEvent(
    new CustomEvent("addon-to-content", {detail: clonedData})
  );
});

window.addEventListener("pagehide", function() {
  self.port.emit("content-to-addon", {type: "pagehide"});
}, false);
