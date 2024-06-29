
/*static async getAllBooks() {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM Books`; // Replace with your actual table name

    const request = connection.request();
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset.map(
      (row) => new Book(row.id, row.title, row.author)
    ); // Convert rows to Book objects
  }
    */
async function fetchOpportunity() {
        let response = await fetch(`/opportunities`);
        if (!response.ok) throw new Error('Network response was not ok');
        let opportunity = await response.json();
        return opportunity;
}
async function displayOpportunities() {
    /*let response = await fetch(`/opportunities`);
    if (!response.ok) throw new Error('Network response was not ok');
    let opportunities = await response.json();*/
    let opportunity = await fetchOpportunity();
    console.log(opportunity);
    
    const opportunitiesContainer = document.createElement('div');
    opportunitiesContainer.classList.add('opportunities-container');

    const oInfo = document.createElement('section');
    oInfo.classList.add('dashContentClick');

    const oDate = document.createElement('span');
    oDate.classList.add('dash-date');
    oDate.textContent = opportunity.date;

    const oBody = document.createElement('section');
    oBody.classList.add('dash-body');

    const oTitle = document.createElement('p');
    oTitle.classList.add('dashTitle');
    oTitle.textContent = opportunity.title;

    const oTime = document.createElement('p');
    oTitle.classList.add('dashTime');

    oInfo.appendChild(oDate);
    oInfo.appendChild(oBody);
    oBody.appendChild(oTitle);
    oBody.appendChild(oTime);

    opportunitiesContainer.appendChild(oInfo);
    
    

    /*
    // Create a table element
    const table = document.createElement('table');
    table.classList.add('opportunities-table');
  
    // Create table headers
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
      <th>Date</th>
      <th>Time</th>
      <th>Title</th>
    `;
    table.appendChild(headerRow);
  
    // Add opportunities to the table
    for (const opportunity in opportunities) {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${opportunity.date}</td>
        <td>${opportunity.starttime}</td>
        <td><a href="/opportunities/${opportunity.id}">${opportunity.title}</a></td>
      `;
      table.appendChild(row);
    }
  
    // Add the table to the DOM
    document.getElementById('opportunities-container').appendChild(table);*/
  }
  displayOpportunities();