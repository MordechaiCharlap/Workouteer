const { db } = require("./firebase");
const getAll = async (collection) => {
  const allDocsSnapshot = await db.collection(collection).get();
  const docsData = allDocsSnapshot.docs.map((doc) => doc.data());
  return docsData;
};

const getById = async (collection, id) => {
  const docSnapshot = await db.doc(`${collection}/${id}`).get();
  return docSnapshot.data();
};

const create = async (collection, data, id) => {
  if (id != null) {
    return await db.doc(`${collection}/${id}`).set(data);
  } else {
    return await db.collection(collection).add(data);
  }
};

const update = async (collection, id, changes) => {
  await db.doc(`${collection}/${id}`).update(changes);
};

const remove = async (collection, id) => {
  await db.doc(`${collection}/${id}`).delete();
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
