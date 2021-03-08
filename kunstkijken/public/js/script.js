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
}, false)