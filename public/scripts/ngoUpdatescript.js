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

    try {
    const response = await fetch(`/opportunities/${oppid}`);
    if (!response.ok) {
        throw new Error(`Error fetching opportunity details: ${response.status}`);
    }

    const oppData = await response.json();

    document.getElementById('title').value = oppData.title;
    document.getElementById('description').value = oppData.description;
    document.getElementById('date').value = oppData.date.split('T')[0]; // Extract date part from ISO string
    document.getElementById('time1').value = oppData.starttime.split('T')[1].substring(0, 5); // Extract time part (HH:mm)
    document.getElementById('time2').value = oppData.endtime.split('T')[1].substring(0, 5); // Extract time part (HH:mm)
    document.getElementById('address').value = oppData.address;
    document.getElementById('age').value = oppData.age;
    document.getElementById('count').value = oppData.maxvolunteers;

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
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(updatedOpportunity)
        });

        if (response.ok) {
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