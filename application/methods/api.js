// Api+Crud reusable functions
async function tableQuery(query, connection, req) {
  // define the search term from the request
  const search = req.body.search;
  const searchTerm = `%${search}%`;

  // read how many question marks are in the querry
  const substitutions = query.split("?").length - 1;
  // Fill array with number of substitutions needed
  const searchSubstitutions = new Array(substitutions).fill(searchTerm);

  try {
    const [results] = await connection
      .promise()
      .query(query, searchSubstitutions);
    return results;
  } catch (err) {
    console.error("database query error: ", err);
  }
};

async function idSearch(query, connection, req) {
  const search = req.body.id;
  console.log("search: ", search);
  console.log("query: ", query);

  try {
    const [results] = await connection
      .promise()
      .query(query, search);
    return results;
  } catch (err) {
    console.error("database query error: ", err);
  }
};

async function databaseUpdate(query, connection, req) {
  const content = req.body.elements;
  try {
    const [results] = await connection
      .promise()
      .query(query, content)
    return results;
  } catch (err) {
    console.error("database error: ", err);
  }
};

export { tableQuery, databaseUpdate, idSearch };
