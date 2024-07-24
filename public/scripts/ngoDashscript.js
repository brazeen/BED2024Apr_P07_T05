const token = localStorage.getItem("token") // Retrieve token from localStorage
let nid;

async function getNGOId() {
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

      let data = await response.json();

      // Assuming the response contains an object with the ID
      console.log("id:", data.id);
      nid = data.id;
      console.log("role:", data.role);
      localStorage.setItem('ngoid', nid)
      return data.id;
  } catch (error) {
      console.error('Error fetching ngo ID:', error);
  }
}

async function initializeApp() {
  // Ensure the global volunteer ID is set
  await getNGOId();

  // Now you can call other methods that depend on the global volunteer ID
  console.log("Global NGO ID is set to:", nid);

  // Example: Call other methods here
  displayOpportunities();
}

//To format time (example: 05:30 PM)
function formatTimeRange(startTimeString, endTimeString) {
    const startTime = new Date(startTimeString);
    const endTime = new Date(endTimeString);

    const options = { hour: '2-digit', minute: '2-digit', timeZone: 'UTC'}; // Specify desired format, time can only be formatted based on UTC
    const formattedStartTime = startTime.toLocaleTimeString('en-SG', options); 
    const formattedEndTime = endTime.toLocaleTimeString('en-SG', options);

    return `${formattedStartTime} - ${formattedEndTime}`;
}

//To format date to numeric + month (example 12 May)
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'short' };
    return date.toLocaleDateString('en-SG', options);
}
  

async function fetchOpportunity() {
        let response = await fetch(`/opportunities/ngos/${nid}`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Include the token in the Authorization header
        }
        });
        if (!response.ok) throw new Error('Network response was not ok');
        let opportunity = await response.json();
        return opportunity;
}
async function displayOpportunities() {

    let opportunities = await fetchOpportunity();
    console.log(opportunities);
    let parentContainer = document.querySelector(".dashContent")
    opportunities.forEach(opportunity => {

      const oInfo = document.createElement('section');
      oInfo.classList.add('dashContentClick');

      const oDate = document.createElement('span');
      oDate.classList.add('dashDate');
      oDate.textContent = formatDate(opportunity.date);

      const oBody = document.createElement('section');
      oBody.classList.add('dashBody');

      const oTitle = document.createElement('p');
      oTitle.classList.add('dashTitle');
      oTitle.textContent = opportunity.title;
        
      const starttime = opportunity.starttime;
      const endtime = opportunity.endtime;
      const oTime = document.createElement('p');
      oTime.classList.add('dashTime');
      oTime.textContent = `${formatTimeRange(starttime, endtime)}`;
      

      oInfo.appendChild(oDate);
      oInfo.appendChild(oBody);
      oBody.appendChild(oTitle);
      oBody.appendChild(oTime);

      parentContainer.appendChild(oInfo);

      oInfo.addEventListener('click', () => {
        //Pass opportunity ID as a query parameter
        console.log("Opportunity ID being passed:", opportunity.opportunityid)
        window.location.href = `ngomanageopportunity.html?id=${opportunity.opportunityid}`;
      });
      
    });
}

initializeApp();