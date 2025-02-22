const db = require("../../data/db-config");

const getAll = () => {
  // KODLAR BURAYA
  return db("accounts");
  //db.select('*'.from('users'));
};

const getById = (id) => {
  // KODLAR BURAYA
  return db("accounts").where({ id }).first();
};

const create = (account) => {
  // KODLAR BURAYA
  return db("accounts")
    .insert(account)
    .then((id) => {
      return getById(id);
    });
};

const checkName = async (name) => {
  let nameExist = await db("accounts").where("name", name).first();
  return !!nameExist;
};
const updateById = (id, account) => {
  // KODLAR BURAYA
  return db("accounts")
    .where({ id })
    .update(account)
    .then((rows) => {
      return getById(id);
    });
};

const deleteById = (id) => {
  // KODLAR BURAYA
  return db("accounts").where("id", id).del();
};

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
  checkName,
};
