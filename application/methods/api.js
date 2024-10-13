// Api+Crud reusable functions
export async function tableQuery(query, connection, req) {
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
