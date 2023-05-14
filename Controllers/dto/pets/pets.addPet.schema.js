const postPetSchema = {
  type: "object",
  properties: {
    petType: { type: "string" },
    breed: { type: "string" },
    petStatus: { type: "string" },
    height: { type: "integer" },
    weight: { type: "integer" },
    color: { type: "string" },
    petBio: { type: "string" },
    name: { type: "string" },
    diet: { type: "string" },
    hypoallergenic: { type: "boolean" },
  },
  required: [
    "petType",
    "breed",
    "petStatus",
    "height",
    "weight",
    "color",
    "petBio",
    "name",
    "diet",
    "hypoallergenic",
  ],
};

module.exports = postPetSchema;
