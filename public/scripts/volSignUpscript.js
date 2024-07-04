
document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('registrationForm');
    
    form.addEventListener('submit-button', function(event) {
        event.preventDefault();

        // Collect form data
        let name = document.getElementById('name').value;
        let email = document.getElementById('email').value;
        let password = document.getElementById('confirm-password').value;
        let bio = document.getElementById('bio').value;
        let skills = document.getElementById('skills').value;
        let dob = document.getElementById('Dob').value;
        let profilePic = document.getElementById('profile-pic').files[0];

        // Prepare form data to send
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('confirm-password', password);
        formData.append('bio', bio);
        formData.append('skills', skills);
        formData.append('dob', dob);
        formData.append('profilePic', profilePic);

        // Send form data to server (example URL)
        fetch('/volunteer', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Volunteer signed up successfully!");
                form.reset();
            } else {
                alert("Error signing up volunteer: " + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Error signing up volunteer.");
        });
    });
});
