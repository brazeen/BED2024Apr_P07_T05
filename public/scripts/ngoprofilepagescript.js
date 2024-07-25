const token = localStorage.getItem('token');
if (!token) {
    window.location.href = "/login"
}

let placeholderid = localStorage.getItem('ngoid');
async function fetchNgoProfile(id) {
    try {
        const response = await fetch(`/ngos/${id}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}` // Include the token in the Authorization header
            }
        }); // Replace with your API endpoint
        ngo = await response.json();

        const ngoList = document.getElementsByClassName("ngo-list")[0]; // Correctly select the element
        if (!ngoList) {
            throw new Error('Element with class "ngo-list" not found');
        }

        const ngoItem = document.createElement("div");
        ngoItem.classList.add("data"); // Add a CSS class for styling

        // Create elements for email, username, etc. and populate with NGO data
        const email = document.createElement("h2");
        email.textContent = `Email: ${ngo.email}`;
        const username = document.createElement("h2");
        username.textContent = `Username: ${ngo.name}`;
        const contactPerson = document.createElement("h2");
        contactPerson.textContent = `Contact Person: ${ngo.contactperson}`;
        const contactNumber = document.createElement("h2");
        contactNumber.textContent = `Contact Number: ${ngo.contactnumber}`;
        const address = document.createElement("h2");
        address.textContent = `Address: ${ngo.address}`;
        const description = document.createElement("p");
        description.textContent = `Description: ${ngo.description}`;

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
        logo.src = `${ngo.logo}`;
        // Append the description to the ngodescriptionItem
        ngodescriptionItem.appendChild(logo);
        // Append the ngodescriptionItem to the ngodescription
        ngodescription.appendChild(ngodescriptionItem);

    } catch (error) {
        console.error("Error fetching NGO profile:", error);
    }
}

fetchNgoProfile(placeholderid); // Call the function to fetch and display NGO data

document.querySelector('.delete-btn').addEventListener('click', function() {
    deleteNGOProfile(placeholderid);
});

async function deleteNGOProfile(id) {
    const response = await fetch(`/ngos/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}` // Include the token in the Authorization header
        }
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
    var descriptionField = document.getElementById("description");
    var contactpersonField = document.getElementById("contactperson");
    var contactnumberField = document.getElementById("contactnumber");
    var addressField = document.getElementById("address");
    var picField = document.getElementById("logo");

    //display popup
    modal.style.display = 'block';

    //close popup
    document.querySelector('.close').addEventListener('click', function() {
        modal.style.display = 'none';
    });

    //set form fields with current ngo data
    nameField.value = ngo.name;
    emailField.value = ngo.email;
    descriptionField.value = ngo.description;
    contactpersonField.value = ngo.contactperson;
    contactnumberField.value = ngo.contactnumber;
    addressField.value = ngo.address;

    

    //when submit
    document.querySelector('.submit-btn').addEventListener('click', async function() {
        try{
            let pic = ngo.logo;

            //if a file is uploaded
            if (picField.files.length > 0) {
                const formData = new FormData();
                formData.append('logo', picField.files[0]);
                Object.entries(ngo).forEach(([key, value]) => {
                    if (key != "ngoid") {
                        formData.append(key, value);
                    }
                    
                });

                const picResponse = await fetch(`/ngos/logo/${ngo.ngoid}`, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Authorization': `Bearer ${token}` // Include the token in the Authorization header
                    }
                });
    
                if (picResponse.ok) {
                    const picData = await picResponse.json();
                    console.log("picData:", picData);
                    pic = picData.logo; // update pic with the new profile picture path
                    console.log("Updated pic:", pic); // Log the updated pic
                } else {
                    alert("Failed to upload new profile picture.");
                    return;
                }
            }

            
            let newNGOData = {
                name: nameField.value,
                email: emailField.value,
                passwordHash: ngo.passwordHash,
                logo: pic,
                description: descriptionField.value,
                contactperson: contactpersonField.value,
                contactnumber: contactnumberField.value,
                address: addressField.value,
                status: ngo.status
            };

            
            const response = await fetch(`/ngos/${ngo.ngoid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newNGOData)
            });
    
            if (response.ok) {
                alert("Profile successfully updated.");
                modal.style.display = 'none';
                // Optionally, update the displayed ngo information on the page
                ngo = await response.json();
                // Update displayed data with new information
                // ...
            } else {
                alert("Failed to update profile.");
            }
        }
        catch(error){
            console.error(error)
            throw new Error("Failed to update profile")
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
            let response = await fetch(`/ngos/${ngo.ngoid}/${currentpw}`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`
                },
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
            response = await fetch(`/ngos/changepw/${ngo.ngoid}/${newpw}`, {
                method: "PATCH",
                headers: {
                    'Authorization': `Bearer ${token}`
                },
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

document.querySelector('.logout-btn').addEventListener('click', logout)

function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('ngoid')
    window.location.href="/login"
}


    

