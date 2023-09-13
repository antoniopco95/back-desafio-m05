const knex = require("knex")(require("../knexfile").development);

validateEmailDomain = (email) => {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
};

module.exports={
    validateEmailDomain,
}