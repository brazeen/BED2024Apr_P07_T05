//donovan
const token = localStorage.getItem("token")
function oppFormSubmission(){
    // Get references to the form elements and the post button
    const title = document.getElementById("title");
    const description = document.getElementById("description");
    const date = document.getElementById("date");
    const starttime = document.getElementById("time1");
    const endtime = document.getElementById("time2");
    const address = document.getElementById("address");
    const region = document.getElementById("region");
    const age = document.getElementById("age");
    const maxvolunteers = document.getElementById("count");
    const photo = document.getElementById("media");

    var selectedSkills = [];
    const skillCheckboxes = document.querySelectorAll('.form-check-input');
    for (var checkbox of skillCheckboxes) {
        checkbox.addEventListener('click', function(){
            if (this.checked == true){
                console.log(this.value);
                selectedSkills.push(this.value);
                console.log(selectedSkills);
            }
            else {
                console.log("You unchecked this box");
                selectedSkills = selectedSkills.filter(i => i !== this.value);
                console.log(selectedSkills);
            }
        })
    }

    //form submission btn
    const postBtn = document.getElementById("post-btn");
    //cancel btn
    const cancelBtn = document.querySelector('.cancel-btn');
    cancelBtn.addEventListener('click', () => {
        window.location.href = `ngodashboard.html`;
    });
    //posting opportunity
    postBtn.addEventListener("click", async (event) => { 
        // Prevent the default form submission behavior
        event.preventDefault();

        // Collect the data from the form
        const newOpportunity = {
            ngoid: localStorage.getItem("ngoid"),
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
            photo: photo.value
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
            const response = await fetch('/opportunities',{
                method: 'POST',
                headers: {
                    'content-type' :'application/json',
                    'Authorization': `Bearer ${token}` // Include the token in the Authorization header
                },
                body: JSON.stringify(newOpportunity)
            });

            if (response.ok) {
                const createdOpp = await response.json();
                const opportunityid = createdOpp.opportunityid;

                try {
                    // Create opportunity skills
                    for (const skillname of selectedSkills) {
                        const oppSkillData = {
                        skillid: skillname,  // Use skill name directly
                        opportunityid: opportunityid
                        };

                        await fetch(`/skills`, {
                        method: 'POST',
                        headers: { 'content-type': 'application/json' ,
                            'Authorization': `Bearer ${token}` // Include the token in the Authorization header
                        },
                        body: JSON.stringify(oppSkillData)
                        });
                        console.log("Skills:", oppSkillData)
                    }
                }
                catch (error) {
                    console.log("Error posting opportunity skills:", error);
                }
                
                console.log("Opportunity Created: ", createdOpp);
                alert("New opportunity created!");
                window.location.href = 'ngodashboard.html';
            }
            else {
                console.log("Error creating opportunity:", response.statusText);
            }
        }
        catch (error) {
            console.log("Error creating opportunity:", error);
        }
    });
}
oppFormSubmission();