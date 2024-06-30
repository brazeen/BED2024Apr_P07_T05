//donovan
function oppFormSubmission(){
    // Get references to the form elements and the post button
    const title = document.getElementById("title");
    const description = document.getElementById("description");
    const date = document.getElementById("date");
    const starttime = document.getElementById("time1");
    const endtime = document.getElementById("time2");
    const address = document.getElementById("address");
    const age = document.getElementById("age");
    const maxvolunteers = document.getElementById("count");

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
            ngoid: 1,
            title: title.value,
            description: description.value,
            date: date.value,
            starttime: starttime.value,
            region: 'west',
            endtime: endtime.value,
            address: address.value,
            age: age.value,
            maxvolunteers: maxvolunteers.value,
            currentVolunteers: 0,
        };

        //Input validation
        if (title.value.trim() === "" ||
            description.value.trim() === "" ||
            date.value === "" ||
            starttime.value === "" ||
            endtime.value === "" ||
            address.value.trim() === "" ||
            age.value === "" ||
            maxvolunteers.value === ""
        ) {
            alert("Please fill in required fields before posting."); // Alert user
            return; // Stop submission if any field is empty
        }
        if (parseInt(age.value) < 16 || parseInt(age.value) > 80) {
            alert("Age must be between 16 and 80.");
            return;
        }
        if (parseInt(maxvolunteers.value) < 1 || parseInt(maxvolunteers.value) > 100) {
            alert("Maximum volunteers must be between 1 and 100.");
            return;
        }
        try {
            const response = await fetch('/opportunities',{
                method: 'POST',
                headers: {
                    'content-type' :'application/json',
                },
                body: JSON.stringify(newOpportunity)
            });

            if (response.ok) {
                const createdOpp = await response.json();
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