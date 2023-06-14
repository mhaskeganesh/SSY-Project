const token = "TapaHBWxr3seBwRY";
let reportingDate;
let commentaryUR;
let routePriceUrl;


const veeselRoutes = {
    'CP1': 'Hampton Roads / Rotterdam',
    'CP2': 'Tubarao / Rotterdam',
    'CP3': 'Tubarao / Qingdao',
    'CP4': 'Richards Bay / Rotterdam',
    'CP5': 'West Australia / Qingdao',
    'CP7': 'Bolivar / Rotterdam',
}

// Adding event listener to the reporting date input
const reportingDateInput = document.getElementById("reporting-date");
reportingDateInput.addEventListener("change", async (event) => {
    let commentaryURL = "https://www.ssyreports.com/api/ExampleEodCommentary/{token}/{reportingDate}";
    reportingDate = event.target.value;
    reportingDate = dateFormater(reportingDate);
    console.log(reportingDate);
    commentaryURL = commentaryURL.replace("{token}", token).replace("{reportingDate}", reportingDate);
    console.log('URL', commentaryURL);

    // Adding commentary
    const commentary = await fetchData(commentaryURL);
    console.log(commentary);
    const commentaryFFAMarket = commentary[0].comment;
    const commentaryFFACape = commentary[1].comment;
    addCommentary(commentaryFFAMarket, commentaryFFACape);

    // Adding CPA tables
    handleRouteTableInfo();
});

async function fetchData(requestQuery) {
    try{
    const response = await fetch(requestQuery)
    const data = await response.json();
    return data;
    }catch(error){
        console.log(error);
    }    
    console.log('Inside fetchData');
}

function dateFormater(date){
    const parts =  date.split("-");
    const formattedDate = parts.join("");
    return formattedDate;
}

function addCommentary(commentaryFFAMarket, commentaryFFACape){
    const fMarketDiv = document.getElementById("ffa-market");
    fMarketDiv.innerHTML = commentaryFFAMarket;

    const fCapeDiv = document.getElementById("ffa-cape");
    fCapeDiv.innerHTML = commentaryFFACape;
}

async function handleRouteTableInfo(){
    let routePriceUrl = "https://www.ssyreports.com/api/ExampleEodPrices/{token}/{routeCode}/{reportingDate}";
    for(let routeCode in veeselRoutes){
        routePriceUrl = routePriceUrl.replace("{token}", token).replace("{routeCode}",routeCode).replace("{reportingDate}", reportingDate);
        const routePriceinfo = await fetchData(routePriceUrl);
        
        console.log(routePriceinfo);
        if(routePriceinfo.length > 0){
            for(Object )
        }
    }
}