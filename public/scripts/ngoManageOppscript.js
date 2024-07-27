const token = localStorage.getItem("token")

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

//brandon
async function getVolunteerSkillsArray(id) {
    const response = await fetch(`/volunteers/skills/${id}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Include the token in the Authorization header
        }
    }); // Replace with your API endpoint
    const data = await response.json();
    return "Skills: " + data.join(", ");
  }

async function fetchOpportunityApplications(oppid) {
    try {
        let response = await fetch(`/applications/array/${oppid}/P`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include the token in the Authorization header
            }
        }); // Replace with your API endpoint
        if (!response.ok) throw new Error('Network response was not ok');
        let data = await response.json();
        const applicationDiv = document.querySelector(".rightSideDiv");
        data.forEach((application) => {
            displayVolunteersInApplications(application, applicationDiv);
        });
    } catch (error) {
        console.error('Error fetching applications:', error);
        alert('Error fetching applications');
    }
}

async function displayVolunteersInApplications(application, applicationDiv) {
    try {
        let response = await fetch(`/volunteers/${application.volunteerid}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include the token in the Authorization header
            }
        }); // Replace with your API endpoint
        if (!response.ok) throw new Error('Network response was not ok');
        let volunteer = await response.json();
        getVolunteerSkillsArray(volunteer.volunteerid) //display data
            .then(skillstr => {
                const volItem = document.createElement("div");
                volItem.classList.add("volunteer");

                const volImage = document.createElement("img");
                volImage.classList.add("volunteer-photo");
                volImage.setAttribute("src", volunteer.profilepicture);

                const volInfo = document.createElement("div");
                volInfo.classList.add("volunteer-info");

                const volName = document.createElement("h3");
                volName.textContent = volunteer.name;
                volName.classList.add("volunteer-name");

                const volAge = document.createElement("p");
                let now = new Date();
                let birth = new Date(volunteer.dateofbirth);
                let age = new Date(now - birth);
                volAge.textContent = `Age: ${Math.abs(age.getUTCFullYear() - 1970)} years old`;
                volAge.classList.add("volunteer-age");

                const volSkills = document.createElement("p");
                volSkills.textContent = skillstr;
                volSkills.classList.add("volunteer-skills");

                const volAcceptBtn = document.createElement("button");
                volAcceptBtn.textContent = "✓";
                volAcceptBtn.classList.add("accept-volunteer");
                volAcceptBtn.addEventListener("click", () => manageVolunteerApplication(volunteer.volunteerid, application.opportunityid, "A")); // Correct assignment

                const volRemoveBtn = document.createElement("button");
                volRemoveBtn.textContent = "✕";
                volRemoveBtn.classList.add("remove-volunteer");
                volRemoveBtn.addEventListener("click", () => manageVolunteerApplication(volunteer.volunteerid, application.opportunityid, "R")); // Correct assignment

                volItem.appendChild(volImage);
                volItem.appendChild(volInfo);
                volInfo.appendChild(volName);
                volInfo.appendChild(volAge);
                volInfo.appendChild(volSkills);
                volItem.appendChild(volAcceptBtn);
                volItem.appendChild(volRemoveBtn);
                applicationDiv.appendChild(volItem);
            });
    } catch (error) {
        console.error('Error displaying volunteer applications:', error);
        alert('Error displaying volunteer applications');
    }
} 

async function manageVolunteerApplication(volid, oppid, status) {
    try {
        const popup = document.querySelector(".user-popup");
        const nobutton = document.getElementById("userpopup-no");
        const yesbutton = document.getElementById("userpopup-yes");
        const popuptext = document.querySelector("#userpopup-text");
        if (status == "A") {
            popuptext.textContent = "Are you sure you want to accept this volunteer's application?";
        }
        else {
            popuptext.textContent = "Are you sure you want to reject this volunteer's application?";
        }
        
        popup.style.display = "flex";
        
        nobutton.onclick = function () {
            popup.style.display = "none";
        };
        
        yesbutton.onclick = async function () {
            try {
                let apistring = `/applications/${volid}/${oppid}/${status}`;
                const response = await fetch(apistring, { method: "PATCH" , headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Include the token in the Authorization header
                }});
                if (response.ok) {
                    let incrementResponse = await fetch(`/opportunities/increment/${oppid}`, {
                        method: "PATCH",
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}` // Include the token in the Authorization header
                        }
                    })
                    if (!incrementResponse.ok) {
                        alert("Error updating opportunity volunteers:", await incrementResponse.text())
                    }
                    else {
                        alert("Volunteer managed successfully! Please reload the page.");
                        popup.style.display = "none";
                    }
                    
                } else {
                    alert("Error managing volunteer application:", await response.text());
                }
            } catch (error) {
                console.error('Error managing volunteer application:', error);
                alert('Error managing volunteer application');
            }
        };
    }
    catch (error) {
        console.error(error)
    }
    
}



//donovan
async function fetchOpportunity() {
    const urlParams = new URLSearchParams(window.location.search);
    const oppid = urlParams.get('id'); //pull out opp id from url passed down

    if (!oppid) {
        // Handle case where no ID is provided
        console.error("Opportunity ID is missing.");
        return;
    }

    try {
        const response = await fetch(`/opportunities/${oppid}` , { //endpoint to get opportunities
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include the token in the Authorization header
            }
        });
        if (!response.ok) { //if response is not ok, error status is displayed on console
        throw new Error(`Error fetching opportunity details: ${response.status}`);
        }

        const oppData = await response.json();

        // Display opportunity details on the page
        console.log(oppData);
        let leftContainer = document.querySelector('.leftSideDiv');
        
        const title = document.createElement('h2');
        title.textContent = oppData.title;

        const content = document.createElement('div');
        content.classList.add('details');

        const date = document.createElement('p');
        date.innerHTML = `<strong>Date :</strong> ${formatDate(oppData.date)}`
        
        const time = document.createElement('p');
        time.innerHTML = `<strong>Time :</strong> ${formatTimeRange(oppData.starttime,oppData.endtime)}`;

        const address = document.createElement('p');
        address.innerHTML = `<strong>Venue :</strong> ${oppData.address}`

        const age = document.createElement('p');
        age.innerHTML = `<strong>Age :</strong> ${oppData.age}`

        const maxvol = document.createElement('p');
        maxvol.innerHTML = `<strong>Volunteers needed :</strong> ${oppData.maxvolunteers}`

        const curVol = document.createElement('p');
        curVol.innerHTML = `<strong>Current Volunteers :</strong> ${oppData.currentvolunteers}`

        const desc = document.createElement('p');
        desc.innerHTML = `<strong>Description :</strong> ${oppData.description}`

        content.appendChild(date);
        content.appendChild(time);
        content.appendChild(address);
        content.appendChild(age);
        content.appendChild(maxvol);
        content.appendChild(curVol);
        content.appendChild(desc);

        leftContainer.appendChild(title);
        leftContainer.appendChild(content);

    }
    catch (error) {
        console.error("Error loading opportunity details: ", error); //error handling
    }
    finally {
        fetchOpportunityApplications(oppid);
    }
}
//call function when page loads
document.addEventListener('DOMContentLoaded', fetchOpportunity);

async function removeOpportunity() {
    const urlParams = new URLSearchParams(window.location.search);
    const oppid = urlParams.get('id'); //pull out opp id from URL passed down
    const deleteBtn = document.querySelector('.delete-btn');
    const popup = document.querySelector('.delete-popup');
    const popupText = document.getElementById('deletepopup-text');
    const cancelpopBtn = document.getElementById('cancel-popBtn');
    const deletepopBtn = document.getElementById('delete-popBtn');
    //when deleteBtn is clicked
    deleteBtn.addEventListener('click', async () => {
        popupText.textContent = 'Are you sure you want to delete the opportunity?'
        popup.style.display = 'flex'; // Show the popup
    });

    cancelpopBtn.onclick = function() {
        popup.style.display = 'none'; //close popup
    };
    
    deletepopBtn.onclick = async function() {
        try {
            const response = await fetch(`/opportunities/${oppid}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Include the token in the Authorization header
                }
            });
            if (response.ok){
                popup.style.display = 'none';
                alert('Opportunity has been deleted!');
                window.location.href = 'ngodashboard.html'; //redirect out of page
            }
            else if (!response.ok) {
                throw new Error(`Error deleting opportunity : ${response.status}`);
            }
        }
        catch (error) {
            console.error("Error fetching opportunity :", error);
            alert('An error has occurred.');
        }
    }

}

document.addEventListener('DOMContentLoaded',removeOpportunity);

async function editOpportunity() {
    const urlParams = new URLSearchParams(window.location.search);
    const oppid = urlParams.get('id');
    const editBtn = document.querySelector('.edit-btn');

    editBtn.addEventListener('click', () => {
        //Pass opportunity ID as a query parameter
        console.log("Opportunity ID being passed:", oppid)
        window.location.href = `ngoupdate.html?id=${oppid}`; //redirect to update page
      });
}

editOpportunity();