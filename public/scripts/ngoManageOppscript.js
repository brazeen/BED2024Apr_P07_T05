async function getVolunteerSkillsArray(id) {
    const response = await fetch(`/volunteers/skills/${id}`); // Replace with your API endpoint
    const data = await response.json();
    return "Skills: " + data.join(", ");
  }

async function fetchOpportunityApplications(oppid) {
    try {
        let response = await fetch(`/applications/array/${oppid}/P`); // Replace with your API endpoint
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
        let response = await fetch(`/volunteers/${application.volunteerid}`); // Replace with your API endpoint
        if (!response.ok) throw new Error('Network response was not ok');
        let volunteer = await response.json();
        getVolunteerSkillsArray(volunteer.volunteerid)
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
} // <-- Missing closing bracket added here

async function manageVolunteerApplication(volid, oppid, status) {
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
            const response = await fetch(apistring, { method: "PATCH" });
            if (response.ok) {
                alert("Volunteer managed successfully! Please reload the page.");
                popup.style.display = "none";
            } else {
                alert("Error managing volunteer application:", await response.text());
            }
        } catch (error) {
            console.error('Error managing volunteer application:', error);
            alert('Error managing volunteer application');
        }
    };
}

fetchOpportunityApplications(1);

//donovan
async function fetchOpportunity() {
    const urlParams = new URLSearchParams(window.location.search);
    const oppid = urlParams.get('id');

    if (!oppid) {
        // Handle case where no ID is provided
        console.error("Opportunity ID is missing.");
        return;
    }

    try {
        const response = await fetch(`/opportunities/${opportunityId}`);
        if (!response.ok) {
        throw new Error(`Error fetching opportunity details: ${response.status}`);
        }

        const oppData = await response.json();

        // Display opportunity details on the page (update elements, etc.)

    }
    catch (error) {
        console.error("Error loading opportunity details: ", error); //error handling
    }
}
//call function when page loads
document.addEventListener('DOMContentLoaded', loadOpportunityDetails);

//yangyi
async function fetchNgoProfile(id) {
    try {
        const response = await fetch(`/ngos/${id}`); // Replace with your API endpoint
        const NGO = await response.json();

        const ngoList = document.getElementsByClassName("ngo-list")[0]; // Correctly select the element
        if (!ngoList) {
            throw new Error('Element with class "ngo-list" not found');
        }

        const ngoItem = document.createElement("div");
        ngoItem.classList.add("data"); // Add a CSS class for styling

        // Create elements for email, username, etc. and populate with NGO data
        const email = document.createElement("h2");
        email.textContent = `Email: ${NGO.email}`;
        const username = document.createElement("h2");
        username.textContent = `Username: ${NGO.name}`;
        const contactPerson = document.createElement("h2");
        contactPerson.textContent = `Contact Person: ${NGO.contactperson}`;
        const contactNumber = document.createElement("h2");
        contactNumber.textContent = `Contact Number: ${NGO.contactnumber}`;
        const address = document.createElement("h2");
        address.textContent = `Address: ${NGO.address}`;
        const description = document.createElement("p");
        description.textContent = `Description: ${NGO.description}`;

        // Append all elements to the ngoItem div
        ngoItem.append(email, username, contactPerson, contactNumber, address, description);

        // Append the ngoItem div to the ngoList
        ngoList.appendChild(ngoItem);

        const ngodescription = document.getElementsByClassName("logo-container")[0];
        if (!ngodescription) {
            throw new Error('Element with class "logo-container" not found');
        }

        const ngodescriptionItem = document.createElement("div");
        ngodescriptionItem.classList.add("data"); // Add a CSS class for styling
        const logo = document.createElement("img");
        logo.src = `${NGO.logo}`;
        // Append the description to the ngodescriptionItem
        ngodescriptionItem.appendChild(logo);
        // Append the ngodescriptionItem to the ngodescription
        ngodescription.appendChild(ngodescriptionItem);

    } catch (error) {
        console.error("Error fetching NGO profile:", error);
    }
}

fetchNgoProfile(1); // Call the function to fetch and display NGO data
