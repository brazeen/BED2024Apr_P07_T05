let response;
document.getElementById('registrationForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const data = { username, password };

    try {
        response = await fetch('/admins/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        let result = await response.json();
        
        if (response.ok) {
            console.log("token:",result.token);
            localStorage.setItem('token', result.token); // Store JWT token
            document.getElementById('registrationForm').reset();
            
            let redirectresponse = await fetch('/admin/dashboard', {
                method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${result.token}` // Include the token in the Authorization header
            }})
            if (redirectresponse.redirected) {
                window.location.href = redirectresponse.url;
            } else {
                return redirectresponse.text().then(text => {
                    alert('Redirection failed: ' + text);
                });
            }
              
        } else {
            showAlert('Error logging in admin: ' + result.message);
        }
    } catch (error) {
        showAlert('Error logging in admin: ' + error.message);
    }
});

function showAlert(message) {
    alert(message);
}
