const token = localStorage.getItem('token');
if (!token) {
    window.location.href = '/login'; 
}

if (document.getElementById('searchVolunteers') && document.getElementById('searchNGOs')) {
  document.getElementById('searchVolunteers').addEventListener('input', async function () {
    const searchTerm = this.value.trim(); //get the value of the search but trim the spaces
  
    await fetchVolunteers(searchTerm);
  });
  
  document.getElementById('searchNGOs').addEventListener('input', async function () {
    const searchTerm = this.value.trim(); //get the value of the search but trim the spaces
  
    await fetchNGOs(searchTerm);
  });
}


async function initialiseAdmin() {
  try {
    let response = await fetch('/users/validate', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Include the token in the Authorization header
        }
    });
  
    // Check if the response is OK (status code 200-299)
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    else {
      if (document.querySelector(".leftHomeDiv")) {
        fetchVolunteers(); // Call the function to fetch and display data
        fetchNGOs();
      }
      else{
        fetchNGOapplications();
      }
    }
  
    let data = await response.json();
  
    // Assuming the response contains an object with the ID
    localStorage.setItem('role', data.role);
  } catch (error) {
    console.error('Error fetching admin:', error);
  }
}


async function getVolunteerSkillsArray(id) {
  const response = await fetch(`/volunteers/skills/${id}`, {
    method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include the token in the Authorization header
            }
  }); // Replace with your API endpoint
  const data = await response.json();
  return "Skills: " + data.join(", ");
}

async function fetchVolunteers(searchTerm = '') {
  //if searchTerm exists, put it inside the url and search but if not just fetch all
  let url;
  if (searchTerm == '') {
    url = '/volunteers'
  }
  else {
    url = `/volunteers/search/user?searchTerm=${encodeURIComponent(searchTerm)}`
  }
  const response = await fetch(url, {
    method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include the token in the Authorization header
            }
  }); // Replace with your API endpoint
  const data = await response.json();

  const volCount = document.getElementById("volcount")
  volCount.innerText = `(${data.length})`
  const volDiv = document.querySelector(".leftHomeDiv");

  //clear the current content so that it doesnt get loaded twice when searched 
  volDiv.innerHTML = '';

  //get the volunteer's skills, and then return an array of {volunteer, skillstr}
  if (data) {
    const skillPromises = data.map(volunteer => 
      getVolunteerSkillsArray(volunteer.volunteerid).then(skillstr => ({ volunteer, skillstr }))
    );
  
    //ensure ALL volunteers have been returned (to prevent volunteers not being loaded cos page refresh too fast etc)
    const volunteersWithSkills = await Promise.all(skillPromises);
  
    volunteersWithSkills.forEach(({ volunteer, skillstr }) => {
      const volItem = document.createElement("div");
      volItem.classList.add("volunteer"); // Add a CSS class for styling
  
      const volImage = document.createElement("img");
      volImage.classList.add("volunteer-photo"); // Add a CSS class for styling
      volImage.setAttribute("src", volunteer.profilepicture);
  
      const volInfo = document.createElement("div");
      volInfo.classList.add("volunteer-info"); // Add a CSS class for styling
  
      const volName = document.createElement("h3");
      volName.textContent = volunteer.name;
      volName.classList.add("volunteer-name");
  
      const volAge = document.createElement("p");
      let now = new Date();
      let birth = new Date(volunteer.dateofbirth);
      let age = new Date(now - birth);
      volAge.textContent = `Age: ${Math.abs(age.getUTCFullYear() - 1970)} years old`;
      volAge.classList.add("volunteer-age");
  
      const volSkills = document.createElement("p");
      volSkills.textContent = skillstr; //use skillstr to show all vol skills
      volSkills.classList.add("volunteer-skills");
  
      const volRemoveBtn = document.createElement("button");
      volRemoveBtn.textContent = "✕";
      volRemoveBtn.classList.add("remove-volunteer");
      volRemoveBtn.setAttribute("id", `voldeletion-btn${volunteer.volunteerid}`);
      volRemoveBtn.addEventListener("click", deleteUser);
  
      volItem.appendChild(volImage);
      volItem.appendChild(volInfo);
      volInfo.appendChild(volName);
      volInfo.appendChild(volAge);
      volInfo.appendChild(volSkills);
      volItem.appendChild(volRemoveBtn);
      volDiv.appendChild(volItem);
    });
  }
  
}

async function fetchNGOs(searchTerm = '') {
  //if searchTerm exists, put it inside the url and search but if not just fetch all
  let url;
  if (searchTerm == '') {
    url = '/ngos/status/A'
  }
  else {
    url = `/ngos/search/user?searchTerm=${encodeURIComponent(searchTerm)}`
  }
  const response = await fetch(url, {
    method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include the token in the Authorization header
            }
  }); // Replace with your API endpoint
  const data = await response.json();

  const ngoCount = document.getElementById("ngocount")
  ngoCount.innerText = `(${data.length})`
  const ngoDiv = document.querySelector(".rightHomeDiv");

  //clear div
  ngoDiv.innerHTML = '';

  data.forEach((ngo) => {
    const ngoItem = document.createElement("div");
    ngoItem.classList.add("ngo"); // Add a CSS class for styling

    const ngoImage = document.createElement("img");
    ngoImage.classList.add("ngo-photo"); // Add a CSS class for styling
    ngoImage.setAttribute("src", ngo.logo)

    const ngoInfo = document.createElement("div");
    ngoInfo.classList.add("ngo-info"); // Add a CSS class for styling

    const ngoName = document.createElement("h3");
    ngoName.textContent = ngo.name;
    ngoName.classList.add("ngo-name")

    const ngoEmail = document.createElement("p");
    ngoEmail.textContent = ngo.email;
    ngoEmail.classList.add("ngo-email")

    const ngoContact = document.createElement("p");
    ngoContact.textContent = ngo.contactnumber;
    ngoContact.classList.add("ngo-contact")

    const ngoRemoveBtn = document.createElement("button")
    ngoRemoveBtn.textContent = "✕";
    ngoRemoveBtn.setAttribute("id", `ngodeletion-btn${ngo.ngoid}`)
    ngoRemoveBtn.classList.add("remove-ngo")
    ngoRemoveBtn.addEventListener("click", deleteUser)

    ngoItem.appendChild(ngoImage);
    ngoItem.appendChild(ngoInfo);
    ngoInfo.appendChild(ngoName);
    ngoInfo.appendChild(ngoEmail);
    ngoInfo.appendChild(ngoContact);
    ngoItem.appendChild(ngoRemoveBtn);
    ngoDiv.appendChild(ngoItem);

  });
}

async function fetchNGOapplications() {
  const response = await fetch("/ngos/status/P", {
    method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}` // Include the token in the Authorization header
            }
  }); // Replace with your API endpoint
  const data = await response.json();
  console.log(data)
  const ngoDiv = document.querySelector(".fullHomeDiv");

  data.forEach((ngo) => {
    const ngoItem = document.createElement("div");
    ngoItem.classList.add("ngo"); // Add a CSS class for styling

    const ngoInfo = document.createElement("div");
    ngoInfo.classList.add("ngo-info"); // Add a CSS class for styling

    const ngoName = document.createElement("h3");
    ngoName.textContent = ngo.name;
    ngoName.classList.add("ngo-name")

    const ngoEmail = document.createElement("p");
    ngoEmail.textContent = ngo.email;
    ngoEmail.classList.add("ngo-email")

    const ngoContact = document.createElement("p");
    ngoContact.textContent = ngo.contactnumber;
    ngoContact.classList.add("ngo-contact")

    const ngoDescription = document.createElement("p");
    ngoDescription.textContent = ngo.description;
    ngoDescription.classList.add("ngo-description")

    const ngoAcceptBtn = document.createElement("button")
    ngoAcceptBtn.textContent = "✓";
    ngoAcceptBtn.setAttribute("id", `ngoaccept-btn${ngo.ngoid}`)
    ngoAcceptBtn.classList.add("accept-ngo")
    ngoAcceptBtn.addEventListener("click", acceptNGOApplication)

    const ngoRejectBtn = document.createElement("button")
    ngoRejectBtn.textContent = "✕";
    ngoRejectBtn.setAttribute("id", `ngodeletion-btn${ngo.ngoid}`)
    ngoRejectBtn.classList.add("remove-ngo")
    ngoRejectBtn.addEventListener("click", deleteUser)

    ngoItem.appendChild(ngoInfo);
    ngoInfo.appendChild(ngoName);
    ngoInfo.appendChild(ngoEmail);
    ngoInfo.appendChild(ngoContact);
    ngoInfo.appendChild(ngoDescription);
    ngoItem.appendChild(ngoAcceptBtn);
    ngoItem.appendChild(ngoRejectBtn);
    ngoDiv.appendChild(ngoItem);

  });
}


async function deleteUser(event) {
  const popup = document.querySelector(".user-popup")
  const nobutton = document.getElementById("userpopup-no")
  const yesbutton = document.getElementById("userpopup-yes")
  const popuptext = document.querySelector("#userpopup-text")
  popuptext.textContent = "Are you sure you want to delete this user?"
  popup.style.display = "flex"
  const buttonid = event.target.id;
  nobutton.onclick = function () {
    popup.style.display = "none"
  }
  yesbutton.onclick = async function () {
    let apistring = ""
    let userid = buttonid.slice(15)
    if (buttonid.includes("ngo")) {
      apistring = `/ngos/${userid}`
    }
    else {
      apistring = `/volunteers/${userid}`
    }
    const response = await fetch(apistring, {
      method: "DELETE", //specify the DELETE method
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include the token in the Authorization header
            }
    }); // Replace with your API endpoint
    if (response.ok) {
      alert("User deleted successfully! Please reload the page.");
      popup.style.display = "none"
    } else {
      alert("Error deleting user:", await response.text());
      // Handle deletion errors (e.g., display an error message)
    }
  }
}

async function acceptNGOApplication(event) {
  const popup = document.querySelector(".user-popup")
  const nobutton = document.getElementById("userpopup-no")
  const yesbutton = document.getElementById("userpopup-yes")
  const popuptext = document.querySelector("#userpopup-text")
  popuptext.textContent = "Are you sure you want to accept this NGO's application?"
  popup.style.display = "flex"
  const buttonid = event.target.id;
  nobutton.onclick = function () {
    popup.style.display = "none"
  }
  yesbutton.onclick = async function () {
    let userid = buttonid.slice(13)
    let apistring = `/ngos/${userid}/A`
    const response = await fetch(apistring, {
      method: "PATCH", //specify the method
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include the token in the Authorization header
            }
    }); // Replace with your API endpoint
    if (response.ok) {
      alert("NGO accepted successfully! Please reload the page.");
      popup.style.display = "none"
    } else {
      alert("Error accepting NGO:", await response.text());
      // Handle deletion errors (e.g., display an error message)
    }
  }
}

async function redirect(url) {
  let redirectresponse = await fetch(url, {
    method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Include the token in the Authorization header
  }})
  if (redirectresponse.redirected) {
    
      window.location.href = redirectresponse.url;
  } else {
      return redirectresponse.text().then(text => {
          alert('Redirection failed: ' + text);
      });
  }
}

initialiseAdmin()

//redirect logic
const dashbtn = document.getElementById("admindashboard")
const applicationsbtn = document.getElementById("adminapplications")
dashbtn.addEventListener('click', (event) => {
  event.preventDefault();
  redirect('/admin/dashboard');
});

applicationsbtn.addEventListener('click', (event) => {
  event.preventDefault();
  redirect('/admin/applications');
});
