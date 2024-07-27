//donovan
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
async function fetchOpportunities() {
    let response = await fetch(`/opportunities`);
    if (!response.ok) throw new Error('Network response was not ok');
    let opportunity = await response.json();
    return opportunity;
}

async function fetchOpportunitySkills(id) {
    let response = await fetch(`/opportunities/skills/${id}`); // Replace with your API endpoint
    if (!response.ok) throw new Error('Network response was not ok');
    let skills = await response.json(); 
    return skills;
}

async function addKeywords() {    
    let keywords = await fetchOpportunities();
    searchPrompt = keywords;
    console.log(searchPrompt);
    showPrompts();
}

function showPrompts() {
    const resultsBox = document.querySelector(".result-box");
    const inputBox = document.getElementById("input-box");
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
    }
}

async function displaySuggestedOpp() {
    let opportunities = await fetchOpportunities();
    let oppDiv = document.querySelector(".suggestedOpps");

    opportunities.slice(-5).forEach(opp => { //limits number of opportunities displayed
        const imgDiv = document.createElement('div');
        imgDiv.classList.add('sImage');
        const putImage = document.createElement('img');
        putImage.innerHTML = `src='https://images.unsplash.com/photo-1505761671109-90433e8a56e3?crop=entropy&amp;cs=tinysrgb&amp;fit=max&amp;fm=jpg&amp;ixid=MnwxfDB8MXxyYW5kb218MHx8QmVhY2gtQ29hc3Qtd2l0aC1jb3N8fHx8fHwxNzEwNzA0MjQ1&amp;ixlib=rb-4.0.3&amp;w=1080' alt='https://images.unsplash.com/photo-1505761671109-90433e8a56e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8QmVhY2gtQ29hc3Qtd2l0aC1jb3N8fHx8fHwxNzEwNzA0MjQ1&ixlib=rb-4.0.3&w=1080'`;

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
    filterOpp();
}

async function filterOpp() {
    const opportunities = await fetchOpportunities();
    const regionSelect = document.querySelector('.searchFilter .form-select[aria-label="Region"]');
    const skillSelect = document.querySelector('.searchFilter .form-select[aria-label="Skills"]');
    const dateSelect = document.querySelector('.searchFilter .form-select[aria-label="Date"]');

    const selectedRegion = regionSelect.value;
    const selectedSkill = skillSelect.value;
    const selectedDate = dateSelect.value;

    filteredOpportunities = opportunities.filter(opp => {
        
    })
    // Sort opportunities based on date
    if (selectedDate === 'newest') {
        Opportunities.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (selectedDate === 'oldest') {
        Opportunities.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
}

displaySuggestedOpp();
addKeywords();

