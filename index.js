const token = "TapaHBWxr3seBwRY";
let reportingDate;
let originalFormatReportingDate;
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
    originalFormatReportingDate = reportingDate;
    reportingDate = dateFormater(reportingDate);
    // console.log(reportingDate);
    commentaryURL = commentaryURL.replace("{token}", token).replace("{reportingDate}", reportingDate);
    // console.log('URL', commentaryURL);

    // Adding commentary
    const commentary = await fetchData(commentaryURL);
    // console.log(commentary);
    const commentaryFFAMarket = commentary[0].comment;
    const commentaryFFACape = commentary[1].comment;
    addCommentary(commentaryFFAMarket, commentaryFFACape);

    // Adding CPA tables
    handleRouteTableInfo();

    //Adding CapeIndex-Price chart
    handleChartDisplay();
});

async function fetchData(requestQuery) {
    try{
    const response = await fetch(requestQuery)
    const data = await response.json();
    return data;
    }catch(error){
        console.log(error);
    }    
    // console.log('Inside fetchData');
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
    const tablesContainer = document.getElementById('route-info-table-container');
    tablesContainer.innerHTML = '';

    for(let routeCode in veeselRoutes){
        let isAPIDataAvailable = false;
        let routePriceUrl = "https://www.ssyreports.com/api/ExampleEodPrices/{token}/{routeCode}/{reportingDate}";
        const tempTable = document.createElement('table');
        tempTable.setAttribute('id', 'route-'+routeCode);
        tempTable.setAttribute('class', 'route-table');
        tempTable.setAttribute('border', '1');


        // Create table caption
        const caption = document.createElement('caption');
        caption.textContent =  routeCode +' '+ veeselRoutes[routeCode]+' Route Price Information Table';
        tempTable.appendChild(caption);

        const tRow = document.createElement('tr');
        tempTable.appendChild(tRow);

        const tHead1 = document.createElement('th');
        tHead1.innerHTML = 'Period Code';

        const tHead2 = document.createElement('th');
        tHead2.innerHTML = 'End-of-day price';
        
        const tHead3 = document.createElement('th');
        tHead3.innerHTML = 'Day-on-day movements';

        tRow.appendChild(tHead1);
        tRow.appendChild(tHead2);
        tRow.appendChild(tHead3);

        tempTable.appendChild(tRow);

        routePriceUrl = routePriceUrl.replace("{token}", token)
        .replace("{routeCode}",routeCode)
        .replace("{reportingDate}", reportingDate);

        const routePriceinfo = await fetchData(routePriceUrl);
        
        // console.log(routePriceinfo);
        if(routePriceinfo.length > 0){
            isAPIDataAvailable = true;
            routePriceinfo.forEach((routePriceDetails) => {
                const periodCode = routePriceDetails.periodCode;
                const price = routePriceDetails.price;
                const doD = routePriceDetails.doD;

                // console.log('ROUTE CODE', routeCode, ' PERIOD CODE', periodCode, ' PRICE', price, ' DOD', doD);

                if(periodCode || price || doD){
                    const tRow = document.createElement('tr');
        
                const periodCodeCell = document.createElement('td');
                periodCodeCell.innerHTML = periodCode;
        
                const priceCell = document.createElement('td');
                priceCell.innerHTML = price;
                
                const dOdCodeCell = document.createElement('td');
                // console.log('doD', doD);
                dOdCodeCell.innerHTML = doD;
        
                tRow.appendChild(periodCodeCell);
                tRow.appendChild(priceCell);
                tRow.appendChild(dOdCodeCell);
                
                tempTable.appendChild(tRow);
                }
                
            });
        }
        
        const routeTablesContainer = document.getElementById('route-info-table-container');
        if(isAPIDataAvailable){
            routeTablesContainer.appendChild(tempTable);
        }else{
            routeTablesContainer.innerHTML += '<h6>No data available for Route ' + routeCode + ' on ' + originalFormatReportingDate + '</h6>';
        }
        
    }
}

async function handleChartDisplay(){
    const chartContainer = document.getElementById('capeindex-price-chart-container');
    const capeIndexPriceRequestUrl = "https://www.ssyreports.com/api/ExampleEodCapeIndex/{token}/{reportingDate}";
    const capeIndexPriceData = await fetchData(capeIndexPriceRequestUrl.replace("{token}", token).replace("{reportingDate}", reportingDate));

    if(capeIndexPriceData.length > 0){
        let capeIndexPriceDataArray = [];

        capeIndexPriceData.forEach((capeIndexPriceDetails) => {
            capeIndexPriceDataArray.push([capeIndexPriceDetails.priceDate, capeIndexPriceDetails.price]);
        });
        console.log('CAPE INDEX PRICE INFO', capeIndexPriceData.length);

        Highcharts.stockChart(chartContainer, {
            rangeSelector: {
            selected: 1
            },        
            title: {
            text: 'Cape Index Price Chart'
            },        
            series: [{
            name: 'Cape Index Price',
            data: capeIndexPriceDataArray,
            type: 'spline',
            tooltip: {
                valueDecimals: 2
            }
            }]
        });

    }else{
        chartContainer.innerHTML = '<h6>No data available for Cape Index Price on ' + originalFormatReportingDate + '</h6>';
    }
    
}