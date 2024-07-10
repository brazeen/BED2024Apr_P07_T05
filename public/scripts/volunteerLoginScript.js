document.getElementById('registrationForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const data = {
        email,
        password
    };

    try {
        // Send JSON data to the server
        const response = await fetch('/volunteers/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            alert('Volunteer logged in successfully!');
            document.getElementById('registrationForm').reset();
        } else {
            showAlert('Error logging in volunteer: ' + result.message);
        }
    } catch (error) {
        showAlert('Error logging in volunteer: ' + error.message);
    }
});

function showAlert(message) {  
    alert(message);
}
