

//hardcode
let currentVolunteerId = 1
let currentOpportunityId = 4

const applyButton = document.querySelector(".apply-button")
applyButton.addEventListener("click", () => applyForOpportunity(currentVolunteerId, currentOpportunityId)); 


async function fetchNGOInOpportunity(opportunity) {
    let response = await fetch(`/ngos/${opportunity.ngoid}`); // Replace with your API endpoint
    if (!response.ok) throw new Error('Network response was not ok');
    let ngo = await response.json();
    return ngo;
}

async function fetchOpportunitySkills(id) {
    let response = await fetch(`/opportunities/skills/${id}`); // Replace with your API endpoint
    if (!response.ok) throw new Error('Network response was not ok');
    let skills = await response.json(); 
    return skills;
}

async function fetchOpportunity(id) {
    let response = await fetch(`/opportunities/${id}`); // Replace with your API endpoint
    if (!response.ok) throw new Error('Network response was not ok');
    let opportunity = await response.json();
    return opportunity;
}

async function displayOpportunity(id) {
    try {
        let opportunity = await fetchOpportunity(id);
        let skillarray = await fetchOpportunitySkills(opportunity.opportunityid);
        //add opportunity to html page
        //add image
        /*
        const oppImageDiv = document.querySelector(".image-placeholder")
        const volImage = document.createElement("img");
        oppImage.setAttribute("src", opportunity.profilepicture);
        oppImageDiv.appendChild(volImage)
        */
        //replace text
        const oppTitle = document.getElementById("opportunity-title")
        oppTitle.textContent = opportunity.title;

        const oppDescription = document.getElementById("opportunity-description")
        oppDescription.textContent = opportunity.description;

        const oppDate = document.getElementById("opportunity-date")
        const oppStartTime = document.getElementById("opportunity-starttime")
        const oppEndTime = document.getElementById("opportunity-endtime")
        
        oppDate.textContent = new Date(opportunity.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        oppStartTime.textContent = new Date(opportunity.starttime).toLocaleTimeString('en-US', { timeZone: 'UTC'});
        oppEndTime.textContent = new Date(opportunity.endtime).toLocaleTimeString('en-US', { timeZone: 'UTC'});

        //participants
        const oppParticipants = document.getElementById("opportunity-participants")
        oppParticipants.textContent = `${opportunity.currentvolunteers}/${opportunity.maxvolunteers}`

        //ngo who organised
        const oppNGO = document.getElementById("opportunity-ngo")
        let NGOObject = await fetchNGOInOpportunity(opportunity)
        oppNGO.textContent = NGOObject.name

        //skills
        const oppSkillsList = document.getElementById("opportunity-skillslist")
        
        for (let i = 0; i<skillarray.length; i++) {
            let newListItem = document.createElement("li");
            newListItem.textContent = skillarray[i];
            oppSkillsList.appendChild(newListItem)
        }
    }
    catch (error) {
        console.error('Error fetching opportunity:', error);
        alert('Error fetching opportunity');
    }
}


async function applyForOpportunity(volid, oppid) {
    //fake volunteer id as login is not done
    let applicationstatus = "P"
    let newApplication = {
        volunteerid: volid,
        opportunityid: oppid,
        status: applicationstatus
    }
    let response = await fetch(`/applications/${volid}/${oppid}`)
    if (response.status != 404) {
        alert("An application for this opportunity has already been made.")
        return;
    }
    response = await fetch('/applications', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(newApplication)
      });// Replace with your API endpoint
      
    if (!response.ok) throw new Error('Network response was not ok');
    else {
        alert("Application has been made! Please refresh the page.")
    }
}

displayOpportunity(currentOpportunityId)





