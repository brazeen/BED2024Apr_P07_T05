// Retrieve token from localStorage
const token = localStorage.getItem('token');
console.log("local storage token:", token);
let testvolid;
// Function to retrieve volunteer ID
async function getVolunteerId() {
    try {
        let response = await fetch('/users/validate', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include the token in the Authorization header
            }
        });

        // Check if the response is OK (status code 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let data = await response.json();

        // Assuming the response contains an object with the ID
        console.log("id:", data.volunteerid);
        testvolid = data.volunteerid;
        console.log("role:", data.volunteerRole);
        localStorage.setItem('volunteerid', data.volunteerid)
        return data.volunteerid;
    } catch (error) {
        console.error('Error fetching volunteer ID:', error);
    }
}

async function initializeApp() {
    // Ensure the global volunteer ID is set
    await getVolunteerId();

    // Now you can call other methods that depend on the global volunteer ID
    console.log("Global volunteer ID is set to:", testvolid);

    // Example: Call other methods here
    fetchAllApplications(testvolid);
}

initializeApp();

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
    const options = { year:"numeric", day: 'numeric', month: 'long' };
    return date.toLocaleDateString('en-SG', options);
}
//test variable
async function getOpportunityInApplication(oppid) {
    let response = await fetch(`/opportunities/${oppid}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Include the token in the Authorization header
        }}); // Replace with your API endpoint
    if (!response.ok) throw new Error('Network response was not ok');
    let opportunity = await response.json();
    return opportunity;
}

async function fetchAllApplications(volid) {
    try {
        let response = await fetch(`/applications/volunteer/${volid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include the token in the Authorization header
            }}); 
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
    eventTime.textContent = `${formatTimeRange(opportunity.starttime, opportunity.endtime)}`;
    if (application.status == 'A') {
        applicationDiv = document.querySelector(".leftHomeDiv");
        
        eventBoxDetails.classList.add("eventDate")
        eventBoxDetails.textContent = formatDate(opportunity.date) //new Date(opportunity.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
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
        eventTime.textContent += ` on ${formatDate(opportunity.date)}`
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