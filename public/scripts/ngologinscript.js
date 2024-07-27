document.getElementById('registrationForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value; //get elements

    const data = { email, password };
    console.log("email:", email);
    console.log("password:", password); //check pulled data
    try {
        const response = await fetch('/ngos/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            alert('NGO logged in successfully!');
            console.log("token:",result.token);
            localStorage.setItem('token', result.token); // Store JWT token
            window.location.href = '/ngodashboard.html'; // Redirect to the desired page
            document.getElementById('registrationForm').reset();
        } else {
            showAlert('Error logging in NGO: ' + result.message);
        }
    } catch (error) {
        showAlert('Error logging in NGO: ' + error.message);
    }
});

function showAlert(message) {
    alert(message);
}
