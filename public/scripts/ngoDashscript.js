/*static async getAllBooks() {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM Books`; // Replace with your actual table name

    const request = connection.request();
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset.map(
      (row) => new Book(row.id, row.title, row.author)
    ); // Convert rows to Book objects
  }*/
async function fetchOpportunitybyID(id) {
        let response = await fetch(`/opportunities/${id}`); // Replace with your API endpoint
        if (!response.ok) throw new Error('Network response was not ok');
        let opportunity = await response.json();
        return opportunity;
}