const PetsDB = require("../models/pet");
const { uuid } = require("uuidv4");
const { ObjectId } = require("mongodb");
const { parse } = require("dotenv");

const getAll = async (filter) => {
	try {
		if (filter) {
			const getPetByFilter = await PetsDB.find(filter);
			if (getPetByFilter.length === 0) {
				// { success: false, message: "no pets found by this filter" };
				return await PetsDB.find();
			}
			return { success: true, message: getPetByFilter };
		}
		const pets = await PetsDB.find();
		console.log("pets in service", pets);
		return pets;
	} catch (err) {
		console.log("get all pets error=>", err);
		return err;
	}
};

const getById = async (id) => {
	try {
		const pet = await PetsDB.findOne({ _id: id }).lean();
		return pet;
	} catch (err) {
		console.log("get pet by ID Error =>", err);
		return err;
	}
};

const add = async (petObj) => {
	const updatedPet = { ...petObj, lcName: petObj.name.toLowerCase() };
	const pet = new PetsDB(updatedPet);

	try {
		const newPet = await pet.save();
		return newPet?._id;
	} catch (err) {
		console.log("add new pet DB error", err);
		return "error", err;
	}
};

const update = async (id, body) => {
	try {
		const newPet = await PetsDB.updateOne({ _id: id }, { $set: body });
		return newPet;
	} catch (err) {
		console.log("update doc error ==>", err);
		return err;
	}
};

const updateCol = async (id, key, value) => {
	try {
		const newKey = { key: value };
		const newPet = await PetsDB.updateOne({ _id: id }, { $set: newKey });
		return newPet;
	} catch (err) {
		console.log("update key of pet Error =>", err);
		return err;
	}
};

const deleteUser = (id) => {
	users.delete(id);
};

const findByEmail = async (email) => {
	try {
		const user = await UserDB.find({ email });
		return user;
	} catch (err) {
		console.log("login DB error ==>", err);
		return err;
	}
};

const findByFilter = async (query, sorting) => {
	const test = { petType: { $eq: "dog" } };
	const sort = { weight: -1 };
	const getPetByFilter = await PetsDB.find(query).sort(sorting.sorting);

	if (getPetByFilter.length === 0) {
		return { success: false, message: "No pets found by this filter" };
	}
	return { success: true, message: getPetByFilter };
};

module.exports = {
	getAll,
	add,
	getById,
	update,
	updateCol,
	deleteUser,
	findByEmail,
	// getPetsByUser,
	findByFilter,
};
