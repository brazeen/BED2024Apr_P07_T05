//donovan

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
        let response = await fetch(`/opportunities`);
        if (!response.ok) throw new Error('Network response was not ok');
        let opportunity = await response.json();
        return opportunity;
}
async function displayOpportunities() {

    let opportunities = await fetchOpportunity();
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
        // 1. Pass opportunity ID as a query parameter
        window.location.href = `ngomanageopportunity.html?id=${opportunity.id}`;
      });
      
    });
  }
  displayOpportunities();