
function nextStep() {
    document.getElementById('step-1').classList.remove('active');
    document.getElementById('step-2').classList.add('active');
}

function prevStep() {
    document.getElementById('step-2').classList.remove('active');
    document.getElementById('step-1').classList.add('active');
}

/*function encodeFileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Extract base64 string without the data URL prefix
        const base64Data = reader.result.split(',')[1];
        resolve(base64Data); // Resolve with base64 string only
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }*/
  
document.getElementById('registrationForm').addEventListener('submit', async function(event) {
    event.preventDefault();
  
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('confirm-password').value;
    const bio = document.getElementById('bio').value;
    const skills = document.getElementById('skills').value;
    const dateofbirth = document.getElementById('dob').value;
    const profilepicture = document.getElementById('profile-pic').files[0];
  
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
        alert('Error signing up volunteer: ' + data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error signing up volunteer.');
    });
  });