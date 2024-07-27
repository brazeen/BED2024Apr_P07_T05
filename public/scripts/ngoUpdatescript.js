//donovan
const token = localStorage.getItem("token")
async function fetchCreatedOpp() {
    const urlParams = new URLSearchParams(window.location.search);
    const oppid = urlParams.get('id');
    if (!oppid) {
        console.error("Opportunity ID is missing.");
        return; 
    }

    //cancel btn
    const cancelBtn = document.querySelector('.cancel-btn');
    cancelBtn.addEventListener('click', () => {
        window.location.href = `ngomanageopportunity.html?id=${oppid}`; //redirect back to manage opportunity page
    });
    
    const title = document.getElementById("title");
    const description = document.getElementById("description");
    const date = document.getElementById("date");
    const starttime = document.getElementById("time1");
    const endtime = document.getElementById("time2");
    const address = document.getElementById("address");
    const age = document.getElementById("age");
    const maxvolunteers = document.getElementById("count");
    const region = document.getElementById("region");
    const photo = document.getElementById("photo");
    var checkedSkills = [];
    const skillCheckboxes = document.querySelectorAll('.form-check-input');
    for (var checkbox of skillCheckboxes) {
        checkbox.addEventListener('click', function(){
            if (this.checked == true){
                console.log(this.value);
                checkedSkills.push(this.value);
                console.log(checkedSkills);
            }
            else {
                console.log("You unchecked this box");
                checkedSkills = checkedSkills.filter(i => i !== this.value);
                console.log(checkedSkills);
            }
        })
    }

    try {
        const response = await fetch(`/opportunities/${oppid}`,{
            method: 'GET',
            headers: {
                'content-type' :'application/json',
                'Authorization': `Bearer ${token}` // Include the token in the Authorization header
            },
        });
        if (!response.ok) {
            throw new Error(`Error fetching opportunity details: ${response.status}`);
        }

        const oppData = await response.json();
        console.log(oppData);

        document.getElementById('title').value = oppData.title;
        document.getElementById('description').value = oppData.description;
        document.getElementById('date').value = oppData.date.split('T')[0]; // Extract date part from ISO string
        document.getElementById('time1').value = oppData.starttime.split('T')[1].substring(0, 5); // Extract time part (HH:mm)
        document.getElementById('time2').value = oppData.endtime.split('T')[1].substring(0, 5); // Extract time part (HH:mm)
        document.getElementById('address').value = oppData.address;
        document.getElementById('age').value = oppData.age;
        document.getElementById('count').value = oppData.maxvolunteers;
        document.getElementById('region').value = oppData.region;
        document.getElementById('photo').src = oppData.photo;
        
        const skillresponse = await fetch(`/skills/${oppid}`, {
            method: 'GET',
            headers: {
                'content-type' :'application/json',
                'Authorization': `Bearer ${token}` // Include the token in the Authorization header
            },
        });

        const skillData = await skillresponse.json();
        console.log(skillData);
        const skillsArray = Array.isArray(skillData) ? skillData : [];
        skillsArray.forEach(value => {
            const checkbox = document.querySelector(`input[value="${value.skillname}"]`);
            if (checkbox) {
                checkbox.checked = true;
                checkedSkills.push(value.skillname);
            }
    });

    }
    catch (error) {
        console.error("Error loading opportunity details:", error);
    }

    const updateBtn = document.getElementById('post-btn');
    updateBtn.addEventListener('click', async (event) => {
    event.preventDefault();

    // Collect updated opportunity data from the form
    const updatedOpportunity = {
        opportunityid: oppid,
        ngoid: 1,
        title: title.value,
        description: description.value,
        date: date.value,
        starttime: starttime.value,
        region: region.value,
        endtime: endtime.value,
        address: address.value,
        age: age.value,
        maxvolunteers: maxvolunteers.value,
        currentVolunteers: 0,
        photo: '',
        skills: checkedSkills
    };

    //Input validation
    if (title.value.trim() === "" ||
    description.value.trim() === "" ||
    date.value === "" ||
    starttime.value === "" ||
    endtime.value === "" ||
    region.value === "" ||
    address.value.trim() === "" ||
    age.value === "" ||
    maxvolunteers.value === ""
    ) {
        alert("Please fill in required fields before posting."); // Alert user
        return; // Stop submission if any field is empty
    }
    else if (parseInt(age.value) < 16 || parseInt(age.value) > 80) {
        alert("Age must be between 16 and 80.");
        return;
    }
    else if (parseInt(maxvolunteers.value) < 1 || parseInt(maxvolunteers.value) > 100) {
        alert("Maximum volunteers must be between 1 and 100.");
        return;
    }


    try {
        const response = await fetch(`/opportunities/${oppid}`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' ,
            'Authorization': `Bearer ${token}` // Include the token in the Authorization header
        },
        body: JSON.stringify(updatedOpportunity)
        });

        if (response.ok) {

            if (photo.length > 0) {
                const formData = new FormData();
                formData.append('photo', photo.files[0]);
                Object.entries(updatedOpportunity).forEach(([key, value]) => {
                    if (key != "opportunityid") {
                        formData.append(key, value);
                    }
                    
                });

                const photoResponse = await fetch(`/opportunities/photo/${oppid}`, {
                    method: 'PUT',
                    body: formData,
                    headers: {
                        'Authorization': `Bearer ${token}` // Include the token in the Authorization header
                    }
                });
                
                if (photoResponse.ok) {
                    const photoData = await photoResponse.json();
                    console.log("photoData:", photoData)
                    updatedOpportunity.photo = photoData.photo; // update photo with the new profile picture path
                    console.log("Updated photo:", updatedOpportunity.photo); // Log the updated photo
                }
                else {
                    alert("Failed to upload photo.");
                    return;
                }
            }

            for (const skillName of checkedSkills) {
                const oppSkillData = {
                    skillid: skillName,  // Use skill name
                    opportunityid: oppid
                };

                // Update each skill
                const updateSkillsResponse = await fetch(`/skills/${oppid}`, {
                    method: 'PUT',
                    headers: { 
                        'content-type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(oppSkillData)
                });

                if (!updateSkillsResponse.ok) {
                    throw new Error(`Error updating skill: ${updateSkillsResponse.status}`);
                }
            }
        alert('Opportunity updated successfully!');
        window.location.href = 'ngodashboard.html'; // Redirect to dashboard
        } else {
        console.error('Error updating opportunity:', response.statusText);
        }
    } catch (error) {
        console.error('Error updating opportunity:', error);
    }
    });
}
document.addEventListener('DOMContentLoaded', fetchCreatedOpp);