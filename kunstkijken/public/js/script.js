window.addEventListener("load", (event)=>{

  const main = document.querySelector("main");

  if(location.pathname === '/'){
    main.className = "overview";
  }else{
    main.className = "detail";
  }
});

window.addEventListener("hashchange", (e)=>{
  console.log(e);
}, false);

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
  // document.querySelector('#search').addEventListener('click', initSearch, false);
  document.addEventListener('click',function(e){
    if(e.target && e.target.id== 'next'){
          next();
     }
 });  
})();