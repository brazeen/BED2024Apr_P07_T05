const token = localStorage.getItem('token');
if (!token) {
    window.location.href = '/login'; //replace with the main login page BUT IT HASNT BEEN MADE 
}
let currentVolunteerId = localStorage.getItem("id");
console.log("volunteer id:", currentVolunteerId)
//initialize ngoId first
let ngoId;
const urlParams = new URLSearchParams(window.location.search)
const currentOpportunityId = urlParams.get('id')
console.log("ngoId:", ngoId);
const applyButton = document.querySelector(".apply-button")
applyButton.addEventListener("click", () => applyForOpportunity(currentVolunteerId, currentOpportunityId)); 
const chatButton = document.querySelector(".chat-button");

//ensure ngoid is set before creating chat
(async function initialize() {
    try {
        const opportunity = { ngoid: currentOpportunityId }; // Assuming you have the opportunity details
        await fetchNGOInOpportunity(opportunity);

        // Set volid to 1 first since localStorage doesn't work yet
        currentVolunteerId = 1;
        console.log("current vol id:", currentVolunteerId);
        console.log("current ngoid:", ngoId);

        chatButton.addEventListener("click", async () => {
            const bool = await checkForExistingChat(currentVolunteerId, ngoId);
            //if bool = false, chat hasn't been created so create chat
            if (bool === false) {
                await createChat(currentVolunteerId, ngoId);
                window.location.href = "volmessage.html";
                //else chat already created so just take volunteer to chat
            } else {
                window.location.href = "volmessage.html";
            }
        });
    } catch (error) {
        console.error('Error fetching NGO data:', error);
    }
})();

async function checkForExistingChat(volunteerId, ngoId) {
    try {
        // Fetch chat history
        const chatResponse = await fetch(`/volunteers/chats/${volunteerId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include the token in the Authorization header
            }
        });

        if (!chatResponse.ok) throw new Error('Network response was not ok');

        const chatData = await chatResponse.json();
        const chats = chatData.chats;
        //set bool to false first
        let bool = false;

        chats.forEach(chat => {
            if (chat.ngoid === ngoId) {
                //if ngoid is found within the loop, means there is an existing chat so set bool to true
                bool = true;
            }
        });

        return bool;
    } catch (error) {
        console.error('Error checking for existing chat:', error);
        return false;
    }
}


async function fetchNGOInOpportunity(opportunity) {
    let response = await fetch(`/ngos/${opportunity.ngoid}`, {
        headers: {
            'Authorization': `Bearer ${token}`}
         // Replace with your API endpoint
    }); // Replace with your API endpoint
    if (!response.ok) throw new Error('Network response was not ok');
    let ngo = await response.json();
    //set ngoId
    ngoId = ngo.ngoid
    console.log("ngoID in fetch ngo opp:", ngoId)
    return ngo;
}

async function fetchOpportunitySkills(id) {
    let response = await fetch(`/opportunities/skills/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`}
    }); // Replace with your API endpoint
    if (!response.ok) throw new Error('Network response was not ok');
    let skills = await response.json(); 
    return skills;
}

async function fetchOpportunity(id) {
    let response = await fetch(`/opportunities/${id}`, {
        headers: {
                    'Authorization': `Bearer ${token}`}
    }); // Replace with your API endpoint
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
    let response = await fetch(`/applications/${volid}/${oppid}`, {
        headers: {
            'Authorization': `Bearer ${token}`}
    })
    if (response.status != 404) {
        alert("An application for this opportunity has already been made.")
        return;
    }
    response = await fetch('/applications', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`},
        body: JSON.stringify(newApplication)
      });// Replace with your API endpoint
      
    if (!response.ok) throw new Error('Network response was not ok');
    else {
        alert("Application has been made! Please refresh the page.")
    }
}

displayOpportunity(currentOpportunityId)

//function to create chat
async function createChat(volunteerId, ngoId) {
        const newMessage = {
            volunteerid: volunteerId,
            ngoid: ngoId,
            content: 'chat created',
            timestamp: new Date().toISOString(),
            senderName:  ' '
        };

        try {
            const response = await fetch(`/volunteers/createMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newMessage)
            });

            if (!response.ok) throw new Error('Network response was not ok');
            window.href = 'volmessage.html'
            const createdChat = await response.json();
            console.log('Chat created successfully:', createdChat);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    
}





