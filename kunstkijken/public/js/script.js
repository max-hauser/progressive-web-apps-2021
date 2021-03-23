if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

window.addEventListener("load", e=>{
  const t = document.querySelector("main");
  location.pathname.includes("/post/") ? t.className = "detail" : t.className = "overview"
}
)
