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

document.getElementById('registrationForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    hideAlert();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('confirm-password').value;
    const bio = document.getElementById('bio').value;
    const skills = document.getElementById('skills').value;
    const dateofbirth = document.getElementById('dob').value;
    let profilepicture;

    const data = {
        name,
        email,
        password,
        bio,
        skills,
        dateofbirth,
        profilepicture
    };

    // Send JSON data to the server
    fetch('/volunteers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Volunteer created successfully') {
            alert('Volunteer signed up successfully!');
            document.getElementById('registrationForm').reset();
        } else {
            showAlert('Error signing up volunteer: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showAlert('Error signing up volunteer.');
    });
});
