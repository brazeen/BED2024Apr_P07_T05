//donovan
let searchPrompt = []; //keywords that will appear under search bar
async function fetchOpportunities() {
    let response = await fetch(`/opportunities`);
    if (!response.ok) throw new Error('Network response was not ok');
    let opportunity = await response.json();
    return opportunity;
}

async function addKeywords() {    
    let keywords = await fetchOpportunities();
    /*keywords.forEach(opp => {
        searchPrompt.push(opp);
    })*/
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
    }
}

async function displaySuggestedOpp() {
    let opportunities = await fetchOpportunities();
}


addKeywords();