
// Fetch the data from WIKIPEDIA (API) to fill the list of SUMMARIES
// Click the summary title to fill the snippet input fields
// 
// Snippet is gonna be added to the end of the post content
// 
// Depending on the language the URL supplied by Wikipedia may use a weird encoding
// @FIXIT: At the moment there is an user input required in that case


window.onload = function () {

    const plr_debug = false;

    //    #plrWiki-summary-loader
    //    .plrWiki-payload

    // @TODO: recheck CORS calls
    // CORS resolving cross domain issue https://stackoverflow.com/questions/23952045/wikipedia-api-cross-origin-requests
    // &origin=* to wikipedia

    // WIKI API ENTRY

    wiki_api_base = "https://en.wikipedia.org/w/api.php?origin=*&format=json&action=query&generator=search&prop=info|extracts&inprop=url&exintro&explaintext&exsentences=2&gsrsearch=";
    
    
    // Main configuration object

    let configVal = { 
        lang: 'en', 
        webservice:'wikipedia.org',
        queryURL: 'w/api.php?origin=*&format=json&action=query&generator=search&prop=info|extracts&inprop=url&exintro&explaintext&exsentences=2&gsrsearch='
        ,configUpdate:
            () => {

            let lng = configVal.lang + '.';
            let websrv = configVal.webservice; 
    
            // Some WIKIPEDIA services have www. - then they not use en.
            if ((websrv.includes('www',0)===true) || (websrv.includes('commons',0)===true))
                lng = '';
    
            // BUILD the API URL
            wiki_api_base = `https://${lng}${configVal.webservice}/${configVal.queryURL}`;
    
            // console.log(wiki_api_base);
        
        }

    };

  


    configVal.configUpdate();


    let payload = document.querySelector('#plrWiki-summary-loader .plrWiki-payload');
    let queryTerm = document.querySelector('#plrWiki-query-term').value;


    payload.innerText = "Ready...\nResults displayed: 10";  // 10 is the default API... - can't remember right now, need to check

    let btnFetch = document.querySelector('#plrWiki-fetch-summary');
    let btnLangSelect = document.querySelector('#plrWiki-lang-select');


    // let wikiJSON;

    // 0 - query 
    // 1 - fount titles
    // 2 - summaries
    // 3 - links

    let dataItems = [];



    // FILL PAYLOAD for WIKI API 2

    const fillPayloadArea = (wikiJSON_2) => {

        
        //console.log('JSON');
        //console.log(wikiJSON);

        //payload.innerText = wikiJSON[1];

        // while(dataItems.pop()); // clear - may not work if an element is like false?


        JSONitemsCount = Object.keys( wikiJSON_2 ).length ;
        
        if (plr_debug)
        console.log(JSONitemsCount);

        if (JSONitemsCount <= 1) {
            payload.innerText = "Nothing found";    
            return false;
        }

        let wikiJSON = {};
        wikiJSON = wikiJSON_2.query.pages;


        // DISPLAY loaded JSON /test    
        // console.log(wikiJSON);


        dataItems.length = 0;
     
        let textFormed = "";

        JSONitemsCount = Object.keys( wikiJSON ).length ;

        //itemsCount = wikiJSON.length;
        
        if (plr_debug)
        console.log( JSONitemsCount);
        itemsCount = JSONitemsCount;


        if (itemsCount == 0) {
            
            el_span = document.createElement('span');
            el_span.innerText = "Can't find a thing, try a different phrase";
            el_span.className = "plrWiki-err";

            fragment.appendChild(el_span);
            payload.appendChild(fragment);
            return false;
        }
    

        for (var pageId in wikiJSON) {
            // string1 += object1[property1];
                 
            // display titles test
            // console.log(pageId + " " + wikiJSON[pageId].title);

            dataSet = new Object();
            // dataSet = { title:wikiJSON[j][0].title, summary:wikiJSON[j][0].extract, url:wikiJSON[j][0].pageid }
            dataSet = { title:wikiJSON[pageId].title, summary:wikiJSON[pageId].extract, url:wikiJSON[pageId].fullurl }
            dataItems.push(dataSet);

            }
                        

        let dataItems2 = dataItems.reverse();
        dataItems = dataItems2;

        // display object test
        // console.log(dataItems);        

        let el_span;
        let fragment;

        fragment = document.createDocumentFragment();
        payload.innerText = "";    

        
        //console.log(dataItems);
        
        let el_ul = document.createElement('ul');

        for (var i = 0; i < dataItems.length; i++) {

            let el_li = document.createElement('li');
            
            
            let el_disp_title = document.createElement('div');
            let el_disp_summary = document.createElement('span');
            let el_disp_url = document.createElement('a');

            
            el_disp_title.className = "plrwiki-item-title" + " plr-sum-num-" + i;
            el_disp_summary.className = "plrwiki-item-summary";
            el_disp_url.className = "plrwiki-item-url";


            el_disp_title.innerText = dataItems[i].title;

            // clean up data strings from the unnecessary parts
            // like: (; Polish pronunciation: [ˈwɔmʐa], Yiddish: Lomzhe) 
            
            dataItems[i].summary = dataItems[i].summary.replace(/\(.*pronunciation:.*?\)/i, ""); // remove pronunciation
            dataItems[i].summary = dataItems[i].summary.replace(/\(.*:.*?\)/i, "");  // remove original name spelling
            dataItems[i].summary = dataItems[i].summary.replace(/\[.*?[^\w]*?.*?\]/i, "");  // remove other weird characters in [], outside of the a-zA-Z-0-9
                                                                                            // TODO: not sure if it's actually 100% correct

            dataItems[i].summary = dataItems[i].summary.replace(/\(.*?listen.*?\)/i, "");
                                                                                            
            
            el_disp_summary.innerText = dataItems[i].summary;
         

            el_disp_url.innerText = dataItems[i].url;

            // TODO: check / fix url acquisition or interpretation of the international characters fetched from Wikipedia


            el_disp_url.setAttribute('href', dataItems[i].url);
            el_disp_url.setAttribute('target', '_blank');
            

            el_li.appendChild(el_disp_title);
            el_li.appendChild(el_disp_summary);
            el_li.appendChild(el_disp_url);
            
            el_ul.appendChild(el_li);

        }

        
        fragment.appendChild(el_ul);
        payload.appendChild(fragment);

    };





    



    // FETCH for WIKI API 2
    
    const fetchSummaries = () => {

        configVal.configUpdate();
        queryTerm = stripHTML(document.querySelector('#plrWiki-query-term').value);
        payload.innerText = "Fetching...";    

        if (plr_debug)
        console.log(wiki_api_base + queryTerm);

        fetch(wiki_api_base + queryTerm,
            {
                method: 'GET',
                mode: "cors",
                headers: {
                    'Accept': 'application/json'
                }

            })
            .then(function (response) {
                if (plr_debug)
                console.log('RESPONSE...');
                return response.json();
            })
            .then(function (wikiJSON) {
                if (plr_debug)
                console.log('RESPONSE 2...');
                //console.log(JSON.stringify(myJson));
                fillPayloadArea(wikiJSON);
            });

    };


    btnFetch.addEventListener('click', fetchSummaries, false);



    // Live Configuration
    // configVal = { lang: 'en', webservice:'wikipedia'}; // default
  
    const langSelect = () => {

        langSelected = document.querySelector('#plrWiki-lang-select').value; 
        //console.log(langSelected);
        
        switch (langSelected) {
            case 'en':
            configVal.lang = langSelected;
                break;
            case 'pl':
            configVal.lang = langSelected;
                break;                
        
            default:
            configVal.lang = 'en';
                break;
        }

        //console.log(configVal.lang);

        configVal.configUpdate();
    
    }

    btnLangSelect.addEventListener('change', langSelect, false);
    





    // ADMIN 
    // select from payload <a> [title],
    // and push to the post Summary submit area

    (function () {
        var resources = document.querySelector('.plrWiki-payload');
        resources.addEventListener('click', handler, false);

        function handler(e) {
            var x = e.target; // get the clicked element
            // console.log('Event delegation:' + x);
            if (x.nodeName.toLowerCase() === 'div') {
                // alert('Event delegation:' + x);
                // console.log('Event delegation:' + x);
                
                e.preventDefault();

                let summaryNum = /plr-sum-num-(\d+)/.exec(x.className)[1];

                // console.log('Event delegation: ' + x.className + " pos= " + summaryNum); 
                
                title = document.querySelector('#plrWiki-summary-title');
                summary = document.querySelector('#plrWiki-summary');
                url = document.querySelector('#plrWiki-summary-url');

                title.value = dataItems[summaryNum].title;
                summary.value = dataItems[summaryNum].summary;
                url.value = dataItems[summaryNum].url;

                // console.log(summary.value); 

                
            }
        };
    })();






    // ADMIN 
    // select CONFIG [WEBSERVICE] BUTTONs

    (function () {
        var resources = document.querySelector('#plrWiki-switches');
        resources.addEventListener('click', handler, false);

        function handler(e) {
            var x = e.target; // get the clicked element
            // console.log('Event delegation:' + x);
            
            if (x.nodeName.toLowerCase() === 'button') {
                // alert('Event delegation:' + x);
                // console.log('Event delegation:' + x);
                
                e.preventDefault();

                let buttonNum = /btn-num-(\d+)/.exec(x.className)[1];

               // console.log('Event delegation: ' + x.className + " pos= " + buttonNum); 
               // console.log(x.value); 

               configVal.webservice = x.value;

               resources = document.querySelectorAll('#plrWiki-switches button');

               
               // https://gomakethings.com/es6-foreach-loops-with-vanilla-javascript/
               resources.forEach(
                   function(x, index)   {
                      x.classList.remove ('plrWiki-display-active');
                      //console.log(x);
                   }
               );
               

               x.classList.add('plrWiki-display-active');

               configVal.configUpdate();
               fetchSummaries();



                
            }
        };
    })();




    function stripHTML(html)
    {
       let tmp = document.createElement("div");
       tmp.innerHTML = html;
       return tmp.textContent || tmp.innerText || "";
    }



};