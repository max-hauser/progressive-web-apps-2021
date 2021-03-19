if('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('../../serviceworker.js')
      .then(reg => console.log('serviceWorker: registered'))
      .catch(err => console.log(`serviceWorker: Error: ${err}`));
  })
}

window.addEventListener("load", (event)=>{

  const main = document.querySelector("main");

  if(location.pathname.includes('/post/')){
    main.className = "detail";
  }else{
    main.className = "overview";
  }
});

function next(){
  const cards = document.querySelectorAll('.card');
  if(cards.length >= 1){
    const allCards = Array.prototype.slice.call(cards);
    allCards[0].remove();
    if(allCards.length == 1){
      main.innerHTML = `<p>That's all folks!</p>`;
    }
  }
}

(function(){
  document.addEventListener('click',function(e){
    if(e.target && e.target.id== 'next'){
      next();
     }
 });  
})();