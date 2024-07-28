//donovan
const token = localStorage.getItem('token');
//To format time (example: 05:30 PM)
function formatTimeRange(startTimeString, endTimeString) {
    const startTime = new Date(startTimeString);
    const endTime = new Date(endTimeString);

    const options = { hour: '2-digit', minute: '2-digit', timeZone: 'UTC'}; // Specify desired format, time can only be formatted based on UTC
    const formattedStartTime = startTime.toLocaleTimeString('en-SG', options); 
    const formattedEndTime = endTime.toLocaleTimeString('en-SG', options);

    return `${formattedStartTime} - ${formattedEndTime}`;
}

//To format date to numeric + month (example 12 May)
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'short' };
    return date.toLocaleDateString('en-SG', options);
}

let searchPrompt = []; //keywords that will appear under search bar
//fetching of all data required
async function fetchOpportunities() {
    let response = await fetch(`/opportunities`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Include the token in the Authorization header
        }
    });
    if (!response.ok) throw new Error('Network response was not ok');
    let opportunity = await response.json();
    return opportunity;
}

async function fetchOpportunitySkills(id) {
    let response = await fetch(`/opportunities/skills/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Include the token in the Authorization header
        }
    }); // Replace with your API endpoint
    if (!response.ok) throw new Error('Network response was not ok');
    let skills = await response.json(); 
    return skills;
}
//search for certain data
async function searchOpportunities(searchTerm) {
    let response = await fetch(`/opportunities/search/listing?searchTerm=${encodeURIComponent(searchTerm)}`, { // ensure input can be safely included in a URL, preventing inputs that might break the URL format and misreading data.
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${token}` // Include the token in the Authorization header
        }
    });
    if (!response.ok) throw new Error('Network response was not ok');
    let opportunities = await response.json();
    return opportunities;
}

//Adding names to a variable
async function addKeywords() {    
    let keywords = await fetchOpportunities();
    searchPrompt = keywords;
    console.log(searchPrompt);
    showPrompts();
}
//search bar show prompts when have input
function showPrompts() {
    const resultsBox = document.querySelector(".result-box"); //the part where prompts will appear
    const inputBox = document.getElementById("input-box"); //the part where user types
    let ul = document.querySelector("ul");

    inputBox.onkeyup = function() {
        let result = []; //store search results
        let input = inputBox.value; //get current input text
        
        if(input.length){ //check if theres any input in search bar
            result = searchPrompt.filter((keyword)=>{
                return keyword.title.toLowerCase().includes(input.toLowerCase()); //compare with opportunity title to input
            });
            console.log(result);

            //create list items for each filtered result
            const content = result.map((item) => {
                const li = document.createElement('li');
                li.textContent = item.title;

                li.addEventListener('click', () => {
                    inputBox.value = item.title; // Set the search bar text to clicked item
                    ul.innerHTML = ""; // clear other suggestions after text is set
                    ul.appendChild(li);
                })
                return li;
            });
    
            resultsBox.appendChild(ul);
            ul.innerHTML = ""; //clear previous results before adding new ones
            content.forEach(li => ul.appendChild(li)); //append new list items
        }
        else {
            ul.innerHTML = ""; // clear list when input is empty
        }
        if(!result.length) {
            resultsBox.innerHTML = ''; //removes line under search bar when no results show
        }
        displayFilteredOpportunities(result);
    }
}

//default display of opportunities without any filtering yet
async function displaySuggestedOpp() {
    let opportunities = await fetchOpportunities();
    let oppDiv = document.querySelector(".suggestedOpps");

    opportunities.slice(0, 20).forEach(opp => { //limits number of opportunities displayed
        const imgDiv = document.createElement('div');
        imgDiv.classList.add('sImage');
        const putImage = document.createElement('img');
        putImage.innerHTML = `src='${opp.photo}'`;

        const infoDiv = document.createElement('div');
        infoDiv.classList.add('sDetailsDiv');

        const texts = document.createElement('div');
        texts.classList.add('sText');
        texts.innerHTML = `<h2 style="font-size: 20px; font-weight: bold;">${opp.title}</h2>
                            <p style="color: #666;">${opp.address}</p>
                            <p style="font-size: 14px; color: #888;">${formatTimeRange(opp.starttime, opp.endtime)} on ${formatDate(opp.date)}</p>`
        const buttons = document.createElement('div');
        buttons.classList.add('sbutton');
        const viewBtn = document.createElement('button');
        viewBtn.textContent = `View`;
        viewBtn.addEventListener('click', () => {
            window.location.href = `volopportunity.html?oppid=${opp.opportunityid}`
        })

        imgDiv.appendChild(putImage);
        buttons.appendChild(viewBtn);
        infoDiv.appendChild(texts);
        infoDiv.appendChild(buttons);
        imgDiv.appendChild(infoDiv);
        oppDiv.appendChild(imgDiv);
    })
    filterOpp(); //filter
}

async function filterOpp() {
    const opportunities = await fetchOpportunities(); //call method to get opportunities
    const regionSelect = document.getElementById('searchRegion'); //region filter button
    const dateSelect = document.getElementById('searchDate'); //date filter button

    const selectedRegion = regionSelect.value;
    const selectedDate = dateSelect.value;

    let filteredOpportunities = opportunities;

    //filter based on region (north south east west)
    if (selectedRegion && selectedRegion !== "Region") { //if value is Region, no filter will occur
        filteredOpportunities = filteredOpportunities.filter(opp => opp.region.toLowerCase() === selectedRegion.toLowerCase());
    }

    //filter based on earliest dates
    if (selectedDate === 'Dec') {
        filteredOpportunities.sort((a, b) => new Date(b.date) - new Date(a.date)); //Dec - Jan
    } else if (selectedDate === 'Jan') {
        filteredOpportunities.sort((a, b) => new Date(a.date) - new Date(b.date)); //Jan - Dec
    }

    displayFilteredOpportunities(filteredOpportunities);
}
//display the filtered opportunities by region/date
function displayFilteredOpportunities(opportunities) {
    const oppDiv = document.querySelector(".suggestedOpps");
    oppDiv.innerHTML = ''; // Clear previous opportunities

    if (opportunities.length === 0) { //display 'no opportunities found' when no opportunities are shown based on filter
        const noOpportunitiesMessage = document.createElement('p');
        noOpportunitiesMessage.textContent = "No opportunities found.";
        noOpportunitiesMessage.style.textAlign = "center"; //center text
        oppDiv.appendChild(noOpportunitiesMessage);
    }

    opportunities.slice(0, 20).forEach(opp => { // Limits number of opportunities displayed
        const imgDiv = document.createElement('div');
        imgDiv.classList.add('sImage');
        const putImage = document.createElement('img');
        putImage.src = `${opp.photo}`; //image
        putImage.alt = 'Opportunity Image';

        const infoDiv = document.createElement('div');
        infoDiv.classList.add('sDetailsDiv');

        const texts = document.createElement('div');
        texts.classList.add('sText');
        texts.innerHTML = `<h2 style="font-size: 20px; font-weight: bold;">${opp.title}</h2>
                            <p style="color: #666;">${opp.address}</p>
                            <p style="font-size: 14px; color: #888;">${formatTimeRange(opp.starttime, opp.endtime)} on ${formatDate(opp.date)}</p>`
        const buttons = document.createElement('div');
        buttons.classList.add('sbutton');
        const viewBtn = document.createElement('button');
        viewBtn.textContent = `View`;
        viewBtn.addEventListener('click', () => {
            window.location.href = `volopportunity.html?oppid=${opp.opportunityid}`
        })

        imgDiv.appendChild(putImage);
        buttons.appendChild(viewBtn);
        infoDiv.appendChild(texts);
        infoDiv.appendChild(buttons);
        imgDiv.appendChild(infoDiv);
        oppDiv.appendChild(imgDiv);
    });
}

document.getElementById('searchRegion').addEventListener('change', filterOpp); //filter to happen when there is a change of value in the buttons
document.getElementById('searchDate').addEventListener('change', filterOpp);

displaySuggestedOpp();
addKeywords();

