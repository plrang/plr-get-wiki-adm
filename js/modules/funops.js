
// CHECK why it doesn't work
// window.onload = function () {

console.log('FUNOPS module loaded');

// 
// ADDITIONAL FUNCTIONS - modularized version derived from the :plrang: js\imgScroll.js
// 
// sample: export function loadImage(url) { ...

const plr_debug = true;

// HIDE & SHOW HEADER MENU while on mobile or just because

var iconMenuHideToggle = 0;

//const iconDown = '<svg class="svg-icon" viewBox="0 0 20 20"><path d="M13.962,8.885l-3.736,3.739c-0.086,0.086-0.201,0.13-0.314,0.13S9.686,12.71,9.6,12.624l-3.562-3.56C5.863,8.892,5.863,8.611,6.036,8.438c0.175-0.173,0.454-0.173,0.626,0l3.25,3.247l3.426-3.424c0.173-0.172,0.451-0.172,0.624,0C14.137,8.434,14.137,8.712,13.962,8.885 M18.406,10c0,4.644-3.763,8.406-8.406,8.406S1.594,14.644,1.594,10S5.356,1.594,10,1.594S18.406,5.356,18.406,10 M17.521,10c0-4.148-3.373-7.521-7.521-7.521c-4.148,0-7.521,3.374-7.521,7.521c0,4.147,3.374,7.521,7.521,7.521C14.148,17.521,17.521,14.147,17.521,10"></path></svg>';
const iconDown = `<svg class="svg-icon" viewBox="0 0 20 20">
<path d="M3.314,4.8h13.372c0.41,0,0.743-0.333,0.743-0.743c0-0.41-0.333-0.743-0.743-0.743H3.314
  c-0.41,0-0.743,0.333-0.743,0.743C2.571,4.467,2.904,4.8,3.314,4.8z M16.686,15.2H3.314c-0.41,0-0.743,0.333-0.743,0.743
  s0.333,0.743,0.743,0.743h13.372c0.41,0,0.743-0.333,0.743-0.743S17.096,15.2,16.686,15.2z M16.686,9.257H3.314
  c-0.41,0-0.743,0.333-0.743,0.743s0.333,0.743,0.743,0.743h13.372c0.41,0,0.743-0.333,0.743-0.743S17.096,9.257,16.686,9.257z"></path>
</svg>`;

const iconUp   = '<svg class="svg-icon" viewBox="0 0 20 20"><path d="M13.889,11.611c-0.17,0.17-0.443,0.17-0.612,0l-3.189-3.187l-3.363,3.36c-0.171,0.171-0.441,0.171-0.612,0c-0.172-0.169-0.172-0.443,0-0.611l3.667-3.669c0.17-0.17,0.445-0.172,0.614,0l3.496,3.493C14.058,11.167,14.061,11.443,13.889,11.611 M18.25,10c0,4.558-3.693,8.25-8.25,8.25c-4.557,0-8.25-3.692-8.25-8.25c0-4.557,3.693-8.25,8.25-8.25C14.557,1.75,18.25,5.443,18.25,10 M17.383,10c0-4.07-3.312-7.382-7.383-7.382S2.618,5.93,2.618,10S5.93,17.381,10,17.381S17.383,14.07,17.383,10"></path></svg>';

// find the menu selector targets

let atSelector = document.querySelector("#menu-hide-btn");    // UI action button
let atSelector1 = document.querySelector("#plrWiki-snippet"); // UI element to hide
//atSelector2 = document.querySelector(".header-image");

// click to hide and change the icon to DOWN / toggle



/* TEST TOGGLE */

const iconMenuToggle = (cmd) => {

  if (plr_debug)
    {
    console.log('');
    console.log('TOGGLE F');
    }

  let localState = localStorage.getItem('iconMenuHideToggle');

  

  if ( (cmd === undefined)  ) // no argument set - do the auto toggle - otherwise set toggle to cmd value
  {
    
    if (plr_debug)
      console.log('cmd === undefined, auto mode');  

    if (localState === null) {
      iconMenuHideToggle = 1 - iconMenuHideToggle;
      if (plr_debug)
        console.log('localState = ' + localState + ' toggle to ' + iconMenuHideToggle);
    }
    else {
      iconMenuHideToggle = localState; // at the first run it's set always to 0, so it can be used in checking the initial screen width < 640 below
      iconMenuHideToggle = 1 - iconMenuHideToggle;
      if (plr_debug)
        console.log('setItem(iconMenuHideToggle auto = ' + iconMenuHideToggle);
    }
    localStorage.setItem('iconMenuHideToggle', iconMenuHideToggle);
        

  }
  else 
    { 
      if (cmd='refresh')
      {
       
        iconMenuHideToggle = localState;  
        if (plr_debug)
          console.log('state refresh / cmd = ' + cmd + ' >> ' +localState);
      }
      else { // 0, 1
        iconMenuHideToggle = cmd; 
        if (plr_debug) 
          console.log('cmd = ' + cmd + ' >> ' + iconMenuHideToggle);  
      }

    }



 

 if (iconMenuHideToggle==1) {
    if (plr_debug)
      console.log('iconDown ' + iconMenuHideToggle);      
    
    atSelector1.style.display ='none'; 
    // atSelector2.style.display ='none'; 
    atSelector.innerHTML= iconDown;
    
    }
    else
    {
    if (plr_debug)  
      console.log('iconUp ' + iconMenuHideToggle);      
   
    atSelector1.style.display ='block'; 
    // atSelector2.style.display ='block'; 
    atSelector.innerHTML= iconUp;
    
    }
}




atSelector.addEventListener('click', ()=> { 

  iconMenuToggle();
  if (plr_debug)
    console.log('event click iconMenuToggle()');    
  
});



if ( (window.innerWidth<640) && (localStorage.getItem('iconMenuHideToggle') === null))
  {
    if (plr_debug)
      {console.log('start -> window.innerWidth < 640');
      console.log('localStorage.getItem(iconMenuHideToggle) = ' + localStorage.getItem('iconMenuHideToggle'));}

    iconMenuToggle(1);
    
  } else
    iconMenuToggle('refresh');

  

