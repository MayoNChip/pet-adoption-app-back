const authRegisterSchema = {
  type: "object",
  properties: {
    firstname: { type: "string" },
    lastname: { type: "string" },
    email: { type: "string", format: "email" },
    password: { type: "string" },
    repassword: { type: "string" },
    phonenumber: { type: "string" },
  },
  required: ["firstname", "lastname", "email", "password", "repassword"],
  additionalProperties: false,
};

module.exports = authRegisterSchema;
