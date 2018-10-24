


// Fetch the data from WIKIPEDIA to fill the suggested list of SUMMARIES

window.onload = function () {

    //    #plrWiki-summary-loader
    //    .plrWiki-payload


    // CORS resolving cross domain issue https://stackoverflow.com/questions/23952045/wikipedia-api-cross-origin-requests
    // &origin=* to wikipedia

    wiki_api_base = "https://en.wikipedia.org/w/api.php?format=json&action=opensearch&origin=*&search=";
    //wiki_api_base = "https://en.wikipedia.org/w/api.php?format=json&action=query&origin=*&prop=extracts&exchars=175&titles=";
    //wiki_api_base = "https://commons.wikimedia.org/w/api.php?format=json&action=opensearch&origin=*&search=";
    //wiki_api_base = "https://en.wikibooks.org/w/api.php?format=json&action=opensearch&origin=*&search=";
    //wiki_api_base = "https://en.wikinews.org/w/api.php?format=json&action=opensearch&origin=*&search=";
    

    // WIKI API v2

    //wiki_api_base = "https://en.wikipedia.org/w/api.php?origin=*&format=json&action=query&list=search&srsearch=";

    wiki_api_base = "https://en.wikipedia.org/w/api.php?origin=*&format=json&action=query&generator=search&prop=info|extracts&inprop=url&exintro&explaintext&exsentences=2&gsrsearch=";
    //wiki_api_base = "https://en.wikinews.org/w/api.php?origin=*&format=json&action=query&generator=search&prop=info|extracts&inprop=url&exintro&explaintext&exsentences=2&gsrsearch=";
    


    let payload = document.querySelector('#plrWiki-summary-loader .plrWiki-payload');
    let queryTerm = document.querySelector('#plrWiki-query-term').value;


    payload.innerText = "Ready to work";

    let btnFetch = document.querySelector('#plrWiki-fetch-summary');

    let wikiJSON;


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
        console.log(JSONitemsCount);

        let wikiJSON = {};
        wikiJSON = wikiJSON_2.query.pages;


        console.log(wikiJSON);


        dataItems.length = 0;
     
        let textFormed = "";

        JSONitemsCount = Object.keys( wikiJSON ).length ;

        //itemsCount = wikiJSON.length;
        
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
    

        //for (var j = 0; j < itemsCount; j++) {




        for (var pageId in wikiJSON) {
            // string1 += object1[property1];
                 
            console.log(pageId + " " + wikiJSON[pageId].title);

                dataSet = new Object();
                // dataSet = { title:wikiJSON[j][0].title, summary:wikiJSON[j][0].extract, url:wikiJSON[j][0].pageid }
                dataSet = { title:wikiJSON[pageId].title, summary:wikiJSON[pageId].extract, url:wikiJSON[pageId].fullurl }
                dataItems.push(dataSet);

                }
        
                
                        

        let dataItems2 = dataItems.reverse();
        dataItems = dataItems2;

        console.log(dataItems);        



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

        queryTerm = document.querySelector('#plrWiki-query-term').value;

        payload.innerText = "Fetching...";    

        fetch(wiki_api_base + queryTerm,
            {
                method: 'GET',
                mode: "cors",
                headers: {
                    'Accept': 'application/json'
                }

            })
            .then(function (response) {
                console.log('RESPONSE...');
                return response.json();
            })
            .then(function (wikiJSON) {
                console.log('RESPONSE 2...');
                //console.log(JSON.stringify(myJson));
                fillPayloadArea(wikiJSON);
            });

    };

    

    /*
    // FETCH & FILL for WIKI API 1




    const fillPayloadArea = (wikiJSON) => {

        //payload.innerText = wikiJSON[1];

        // while(dataItems.pop()); // clear - may not work if an element is like false?
        dataItems.length = 0;
     
        let textFormed = "";

        JSONitemsCount = Object.keys( wikiJSON ).length ;

        itemsCount = wikiJSON[1].length;
        
        
        
        for (var j = 0; j < itemsCount; j++) {

                dataSet = new Object();
                dataSet = { title:wikiJSON[1][j], summary:wikiJSON[2][j], url:wikiJSON[3][j] }
                dataItems.push(dataSet);

                }
            
        let el_span;
        let fragment;

        fragment = document.createDocumentFragment();
        payload.innerText = "";    

        if (dataItems.length == 0) {
            
            el_span = document.createElement('span');
            el_span.innerText = "Can't find a thing, try a different phrase";
            el_span.className = "plrWiki-err";

            fragment.appendChild(el_span);
            payload.appendChild(fragment);
            return false;
        }
            
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



    const fetchSummaries = () => {

        queryTerm = document.querySelector('#plrWiki-query-term').value;

        payload.innerText = "Fetching...";    

        fetch(wiki_api_base + queryTerm,
            {
                method: 'GET',
                mode: "cors",
                headers: {
                    'Accept': 'application/json'
                }

            })
            .then(function (response) {
                return response.json();
            })
            .then(function (wikiJSON) {
                // console.log(JSON.stringify(myJson));
                fillPayloadArea(wikiJSON);


            });

    };


    */

    btnFetch.addEventListener('click', fetchSummaries, false);



    // ADMIN 
    // select from payload <a> title,
    // and push to the post Summary submit area

    (function () {
        var resources = document.querySelector('.plrWiki-payload');
        resources.addEventListener('click', handler, false);

        function handler(e) {
            var x = e.target; // get the link tha
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



};