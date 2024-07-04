//yangyi
async function fetchNgoProfile(id) {
    try {
        const response = await fetch(`/ngos/${id}`); // Replace with your API endpoint
        const NGO = await response.json();

        const ngoList = document.getElementsByClassName("ngo-list")[0]; // Correctly select the element
        if (!ngoList) {
            throw new Error('Element with class "ngo-list" not found');
        }

        const ngoItem = document.createElement("div");
        ngoItem.classList.add("data"); // Add a CSS class for styling

        // Create elements for email, username, etc. and populate with NGO data
        const email = document.createElement("h2");
        email.textContent = `Email: ${NGO.email}`;
        const username = document.createElement("h2");
        username.textContent = `Username: ${NGO.name}`;
        const contactPerson = document.createElement("h2");
        contactPerson.textContent = `Contact Person: ${NGO.contactperson}`;
        const contactNumber = document.createElement("h2");
        contactNumber.textContent = `Contact Number: ${NGO.contactnumber}`;
        const address = document.createElement("h2");
        address.textContent = `Address: ${NGO.address}`;
        const description = document.createElement("p");
        description.textContent = `Description: ${NGO.description}`;

        // Append all elements to the ngoItem div
        ngoItem.append(email, username, contactPerson, contactNumber, address, description);

        // Append the ngoItem div to the ngoList
        ngoList.appendChild(ngoItem);

        const ngodescription = document.getElementsByClassName("logo-container")[0];
        if (!ngodescription) {
            throw new Error('Element with class "logo-container" not found');
        }

        const ngodescriptionItem = document.createElement("div");
        ngodescriptionItem.classList.add("data"); // Add a CSS class for styling
        const logo = document.createElement("img");
        logo.src = `${NGO.logo}`;
        // Append the description to the ngodescriptionItem
        ngodescriptionItem.appendChild(logo);
        // Append the ngodescriptionItem to the ngodescription
        ngodescription.appendChild(ngodescriptionItem);

    } catch (error) {
        console.error("Error fetching NGO profile:", error);
    }
}

fetchNgoProfile(1); // Call the function to fetch and display NGO data