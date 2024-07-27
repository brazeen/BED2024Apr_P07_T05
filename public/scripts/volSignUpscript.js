function showAlert(message) {
    const alertBox = document.getElementById('alertMessage');
    alertBox.innerText = message;
    alertBox.style.display = 'block';
}

function hideAlert() {
    const alertBox = document.getElementById('alertMessage');
    alertBox.style.display = 'none';
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function nextStep() {
    hideAlert();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();

    if (name === '' || email === '' || password === '' || confirmPassword === '') {
        showAlert('Please fill in all the fields.');
        return;
    }

    if (!validateEmail(email)) {
        showAlert('Please enter a valid email address.');
        return;
    }

    if (password !== confirmPassword) {
        showAlert('Passwords do not match.');
        return;
    }

    document.getElementById('step-1').classList.remove('active');
    document.getElementById('step-2').classList.add('active');
}

function prevStep() {
    document.getElementById('step-2').classList.remove('active');
    document.getElementById('step-1').classList.add('active');
}

function toggleDropdown() {
    const dropdown = document.getElementById('skillsDropdown');
    dropdown.classList.toggle('active');
}

document.getElementById('registrationForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    hideAlert();    

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('confirm-password').value;
    const bio = document.getElementById('bio').value;
    const dateofbirth = document.getElementById('dob').value;

    const selectedSkills = Array.from(document.querySelectorAll('#skillsDropdown input:checked')).map(option => option.value);
    console.log(selectedSkills);

    const skillIds = [];

    for (const skill of selectedSkills) {
        try {
            const response = await fetch(`/skills/${skill}`);
            const skillData = await response.json();
            skillIds.push(skillData[0].skillid);
        } catch (error) {
            console.error('Error fetching skill ID:', error);
        }
    }

    const volunteerData = {
        name: name,
        email: email,
        password: password,
        bio: bio,
        dateofbirth: dateofbirth
    };

    // Send JSON data to the server
    try {
        const response = await fetch('/volunteers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(volunteerData)
        });
    
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
    
        const result = await response.json();
        if (result.message === 'Volunteer created successfully') {
            alert('Volunteer signed up successfully!');
            document.getElementById('registrationForm').reset();
        } else {
            showAlert('Error signing up volunteer: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error signing up volunteer.');
    }

    // Get current volunteer sign up id
    const currentvolid = await getMaxVolunteerId();
    if (currentvolid === null) {
        showAlert('Error retrieving maximum volunteer ID.');
        return; // Exit if unable to retrieve ID
    }
    console.log("currentvolid:", currentvolid);

    for (const skillid of skillIds) {
        console.log("currentvolid:", currentvolid);
        const data = {
            volunteerid: currentvolid,
            skillid: skillid
        };
        console.log("data:", data);
        try {
            const response = await fetch('/skills/createVolunteerSkills', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data) // Correctly send data
            });
    
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
    
            const result = await response.json();
            console.log('Response:', result);
    
        } catch (error) {
            console.error('Error creating volunteer skills:', error);
        }
    }
});




document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('skillsDropdown');
    if (!dropdown.contains(event.target)) {
        dropdown.classList.remove('active');
    }
});

async function getMaxVolunteerId() {
    try {
        const response = await fetch('/volunteers/maxid');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log("Max Volunteer ID:", data.maxVolunteerId);
        return data.maxVolunteerId;
    } catch (error) {
        console.error('Error fetching max volunteer id:', error);
        return null; // Return null or handle error case as needed
    }
}


// Call the function
getMaxVolunteerId();

