if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

// function next() {
//   const e = document.querySelectorAll(".card");
//   if (e.length >= 1) {
//       const t = Array.prototype.slice.call(e);
//       t[0].remove(),
//       1 == t.length && (main.innerHTML = "<p>That's all folks!</p>")
//   }
// }
window.addEventListener("load", e=>{
  const t = document.querySelector("main");
  location.pathname.includes("/post/") ? t.className = "detail" : t.className = "overview"
}
)
// document.addEventListener("click", function(e) {
//   e.target && "next" == e.target.id && next()
// });
