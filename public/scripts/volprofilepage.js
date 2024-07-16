let volunteer;
let placeholderid = 1;

async function fetchVolunteerProfile(id) {
    try {
        const response = await fetch(`/volunteers/${id}`); // Replace with your API endpoint
        volunteer = await response.json();
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
        username.textContent = `Name: ${volunteer.name}`;
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

document.querySelector('.delete-btn').addEventListener('click', function() {
    deleteVolunteerProfile(placeholderid);
});

async function deleteVolunteerProfile(id) {
    const response = await fetch(`/volunteers/${id}`, {
        method: 'DELETE'
    });
    if (response.ok) {
        alert("Account successfully deleted.");
    } else {
        alert("Unable to delete account.");
    }
}

//when update button is pressed, the updateProfile method gets called
document.querySelector('.update-btn').addEventListener('click', updateProfile);

async function updateProfile() {
    let modal = document.querySelector('.modal');
    var nameField = document.getElementById("name");
    var emailField = document.getElementById("email");
    var bioField = document.getElementById("bio");
    var dobField = document.getElementById("dateOfBirth");
    var picField = document.getElementById("profilePicture");
    var volunteerdob = new Date(volunteer.dateofbirth);

    //display popup
    modal.style.display = 'block';

    //close popup
    document.querySelector('.close').addEventListener('click', function() {
        modal.style.display = 'none';
    });

    //set form fields with current volunteer data
    nameField.value = volunteer.name;
    emailField.value = volunteer.email;
    bioField.value = volunteer.bio;
    dobField.value = `${volunteerdob.getFullYear()}-${String(volunteerdob.getMonth() + 1).padStart(2, '0')}-${volunteerdob.getDate().toString().padStart(2, '0')}`;

    //when submit
    document.querySelector('.submit-btn').addEventListener('click', async function() {
        try{
            let pic = volunteer.profilepicture;

            //if a file is uploaded
            if (picField.files.length > 0) {
                const formData = new FormData();
                formData.append('profilepicture', picField.files[0]);
                Object.entries(volunteer).forEach(([key, value]) => {
                    if (key != "volunteerid") {
                        formData.append(key, value);
                    }
                    
                });

                const picResponse = await fetch(`/volunteers/profilepicture/${volunteer.volunteerid}`, {
                    method: 'POST',
                    body: formData
                });

                if (picResponse.ok) {
                    const picData = await picResponse.json();
                    console.log(picData)
                    pic = picData.profilepicture; //update pic with the new profile picture path
                } else {
                    alert("Failed to upload new profile picture.");
                    return;
                }
            }

            
            let newVolunteerData = {
                name: nameField.value,
                email: emailField.value,
                passwordHash: volunteer.passwordHash,
                bio: bioField.value,
                dateofbirth: dobField.value,
                profilepicture: pic
            };

            
            const response = await fetch(`/volunteers/${volunteer.volunteerid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newVolunteerData)
            });
    
            if (response.ok) {
                alert("Profile successfully updated.");
                modal.style.display = 'none';
                // Optionally, update the displayed volunteer information on the page
                volunteer = await response.json();
                // Update displayed data with new information
                
            } else {
                alert("Failed to update profile.");
                
            }
        }
        catch(error){
            console.error(error)
            throw new Error("Failed to update volunteer")
            
        }
        finally {
            return;
        }
        
            
    });
}

document.querySelector('#change-password-btn').addEventListener('click', changePassword);

async function changePassword() {
    const popup = document.getElementById("passwordpopup");
    const currentpwField = document.getElementById("current-password");
    const newpwField = document.getElementById("new-password");
    const confirmpwField = document.getElementById("confirm-password");

    popup.style.display = 'block';

    document.querySelector('.passwordpopup-close').addEventListener('click', function() {
        popup.style.display = 'none';
    });

    document.querySelector('.passwordpopup-submit').addEventListener('click', async function(event) {
        event.preventDefault(); // Prevent form submission

        let currentpw = currentpwField.value;
        let newpw = newpwField.value;
        let confirmpw = confirmpwField.value;

        try {
            //check if the current password is correct
            let response = await fetch(`/volunteers/${volunteer.volunteerid}/${currentpw}`, {
                method: "POST"
            });
            if (!response.ok) {
                alert("Invalid current password");
                return;
            }
            //check if the new passwords match
            if (newpw !== confirmpw) {
                alert("New and Confirm password fields do not match");
                return;
            }
            //continue if no errors
            response = await fetch(`/volunteers/changepw/${volunteer.volunteerid}/${newpw}`, {
                method: "PATCH"
            });
            if (response.ok) {
                alert("Password successfully changed");
                popup.style.display = 'none';
            } else {
                alert("There was an error changing your password");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("There was an error processing your request");
        }
        finally {
            //empty the fields
            currentpwField.value = ''
            newpwField.value = ''
            confirmpwField.value = ''
        }
    })
}



    

