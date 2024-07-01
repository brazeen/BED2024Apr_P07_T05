//test variable
let testvolid = 1

async function getOpportunityInApplication(oppid) {
    let response = await fetch(`/opportunities/${oppid}`); // Replace with your API endpoint
    if (!response.ok) throw new Error('Network response was not ok');
    let opportunity = await response.json();
    return opportunity;
}

async function fetchAllApplications(volid) {
    try {
        let response = await fetch(`/applications/volunteer/${volid}`); // Replace with your API endpoint
        if (!response.ok) throw new Error('Network response was not ok');
        let data = await response.json();
        
        data.forEach((application) => {
            displayApplication(application);
        });
    } catch (error) {
        console.error('Error fetching applications:', error);
        alert('Error fetching applications');
    }
}

async function displayApplication(application) {
    
    let opportunity = await getOpportunityInApplication(application.opportunityid)
    let removeBtn; //only for rejected and pending applications
    let applicationDiv; //the main div to append everything to

    let eventDiv = document.createElement("div");
    eventDiv.classList.add("eventItem")

    let eventBoxDetails = document.createElement("div")

    //make html elements
    let eventDetailsDiv = document.createElement("div")
    eventDetailsDiv.classList.add("eventDetails")

    let eventTitle = document.createElement("div")
    eventTitle.classList.add("eventTitle")
    eventTitle.textContent = opportunity.title;

    let eventTime = document.createElement("div")
    eventTime.classList.add("eventTime")
    eventTime.textContent = `${new Date(opportunity.starttime).toLocaleTimeString('en-US', { timeZone: 'UTC'})} to ${new Date(opportunity.endtime).toLocaleTimeString('en-US', { timeZone: 'UTC'})}`;
    if (application.status == 'A') {
        applicationDiv = document.querySelector(".leftHomeDiv");
        
        eventBoxDetails.classList.add("eventDate")
        eventBoxDetails.textContent = new Date(opportunity.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    }
    else{
        //define remove button and classes
        removeBtn = document.createElement("div")
        removeBtn.classList.add("removeEvent")
        removeBtn.textContent = "×"
        removeBtn.addEventListener("click",() => {deleteApplication(testvolid, opportunity.opportunityid)})
        applicationDiv = document.querySelector(".rightHomeDiv");
        eventBoxDetails.classList.add("eventStatus")
        
        if (application.status == 'P') {
            eventDiv.classList.add("pending")
            eventBoxDetails.textContent = "Pending"
        }
        else {
            eventDiv.classList.add("rejected")
            eventBoxDetails.textContent = "Rejected"
        }
        eventTime.textContent += ` on ${new Date(opportunity.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`
    }
        eventDetailsDiv.appendChild(eventTitle)
        eventDetailsDiv.appendChild(eventTime)
        eventDiv.appendChild(eventBoxDetails)
        eventDiv.appendChild(eventDetailsDiv)
        if (application.status != 'A') {
            eventDiv.appendChild(removeBtn)
        }
        applicationDiv.appendChild(eventDiv)
}

async function deleteApplication(volunteerid, opportunityid) {
    const popup = document.querySelector(".user-popup");
    const nobutton = document.getElementById("userpopup-no");
    const yesbutton = document.getElementById("userpopup-yes");
    const popuptext = document.querySelector("#userpopup-text");
    popuptext.textContent = "Are you sure you want to delete this application?";
    popup.style.display = "flex";
    
    nobutton.onclick = function () {
        popup.style.display = "none";
    };
    
    yesbutton.onclick = async function () {
        try {
            let apistring = `/applications/${volunteerid}/${opportunityid}`;
            const response = await fetch(apistring, { method: "DELETE" });
            if (response.ok) {
                alert("Application deleted successfully! Please reload the page.");
                popup.style.display = "none";
            } else {
                alert("Error deleting application:", await response.text());
            }
        } catch (error) {
            console.error('Error deleting application:', error);
            alert('Error deleting application');
        }
    };
}
fetchAllApplications(testvolid)