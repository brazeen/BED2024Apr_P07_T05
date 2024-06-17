async function getVolunteerSkillsArray(id) {
  const response = await fetch(`/volunteers/skills/${id}`); // Replace with your API endpoint
  const data = await response.json();
  return "Skills: " + data.join(", ");
}

async function fetchVolunteers() {
  const response = await fetch("/volunteers"); // Replace with your API endpoint
  const data = await response.json();

  const volDiv = document.querySelector(".leftHomeDiv");

  data.forEach((volunteer) => {
    getVolunteerSkillsArray(volunteer.volunteerid)
      .then(skillstr => {
        const volItem = document.createElement("div");
        volItem.classList.add("volunteer"); // Add a CSS class for styling

        const volImage = document.createElement("img");
        volImage.classList.add("volunteer-photo"); // Add a CSS class for styling
        volImage.setAttribute("src", volunteer.profilepicture)

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
        volSkills.textContent = skillstr; // Use the resolved skill string here
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
  });
}

async function fetchNGOs() {
  const response = await fetch("/ngos/status/A"); // Replace with your API endpoint
  const data = await response.json();

  const ngoDiv = document.querySelector(".rightHomeDiv");

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
  const response = await fetch("/ngos/status/P"); // Replace with your API endpoint
  const data = await response.json();

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

//check if is dashboard page or applications page
if (document.querySelector(".leftHomeDiv")) {
  fetchVolunteers(); // Call the function to fetch and display data
  fetchNGOs();
}
else{
  fetchNGOapplications();
}


