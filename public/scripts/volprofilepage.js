//yangyi
let placeholderid = 1
async function fetchVolunteerProfile(id) {
    try {
        const response = await fetch(`/volunteers/${id}`); // Replace with your API endpoint
        const volunteer = await response.json();

        const volunteerList = document.getElementsByClassName("volunteer-list")[0]; // Correctly select the element
        if (!volunteerList) {
            throw new Error('Element with class "volunteer-list" not found');
        }

        const volunteerItem = document.createElement("div");
        volunteerItem.classList.add("data"); // Add a CSS class for styling

        // Create elements for email, username, etc. and populate with vol data
        const email = document.createElement("h2");
        email.textContent = `Email: ${volunteer.email}`;
        const username = document.createElement("h2");
        username.textContent = `Username: ${volunteer.name}`;
        const bio = document.createElement("h2");
        bio.textContent = `Bio: ${volunteer.bio}`;
        
        const dob = new Date(volunteer.dateofbirth);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDOB = dob.toLocaleDateString('en-US', options);
        const dateofbirth = document.createElement("h2");
        dateofbirth.textContent = `Date of birth: ${formattedDOB}`;

        // Append all elements to the volItem div
        volunteerItem.append(email, username, bio, dateofbirth);

        // Append the volItem div to the volList
        volunteerList.appendChild(volunteerItem);

        const volunteerdescription = document.getElementsByClassName("volunteer-img-container")[0];
        if (!volunteerdescription) {
            throw new Error('Element with class "volunteer-img-container" not found');
        }

        const volunteerdescriptionItem = document.createElement("div");
        volunteerdescriptionItem.classList.add("data"); // Add a CSS class for styling
        const profilepicture = document.createElement("img");
        profilepicture.src = `${volunteer.profilepicture}`;
        // Append the description to the voldescriptionItem
        volunteerdescriptionItem.appendChild(profilepicture);
        // Append the voldescriptionItem to the voldescription
        volunteerdescription.appendChild(volunteerdescriptionItem);

    } catch (error) {
        console.error("Error fetching volunteer profile:", error);
    }
}

fetchVolunteerProfile(placeholderid); // Call the function to fetch and display vol data
console.log("testing");

document.querySelector('.delete-btn').addEventListener('click', function()
    {
        
       console.log("Button was clicked");
       deleteVolunteerProfile(placeholderid)
    })
async function deleteVolunteerProfile(id) {
    const response = await fetch(`/volunteers/${id}`, {
        method: 'DELETE'
    })
    if (response.ok) {
        alert("Account successfully deleted.")
    }
    else {
        alert("Unable to delete account.")
    }
}
    

