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

async function deleteUser(event) {
  const popup = document.querySelector(".userdeletion-popup")
  const nobutton = document.getElementById("userdeletion-no")
  const yesbutton = document.getElementById("userdeletion-yes")
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



fetchVolunteers(); // Call the function to fetch and display data
fetchNGOs();

