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

const create = async (collection, data) => {
  if (data.id != null) {
    await db.doc(`${collection}/${data.id}`).set(data);
  } else {
    await db.doc(collection).create(data);
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
