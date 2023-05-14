const Ajv = require("ajv");
const addFormats = require("ajv-formats");

const ajv = new Ajv({ allerrors: true });
addFormats(ajv);

// ajv.addFormats("pass", (value) => {
//   if (value.length < 6) {
//     return false;
//   }
//   return true;
// });

module.exports = ajv;
