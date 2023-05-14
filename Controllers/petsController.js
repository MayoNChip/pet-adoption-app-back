const ErrorHandler = require("../libs/errorHandling.lib");
const petService = require("../services/pets.service");
const userService = require("../services/users.service");

const getPets = async (req, res, next) => {
	const petsListRes = await petService.getAll(req.query);

	console.log(petsListRes);
	res.send(petsListRes);
};

const getById = async (req, res) => {
	const petId = req.params.petId;
	const pet = await petService.getById(petId);
	res.send({ status: "Success", data: pet });
};

const addNew = async (req, res, next) => {
	try {
		const newPetId = await petService.add(req.body);
		res.send({ success: true, petId: newPetId });
	} catch (err) {
		next({ success: false, Error: err });
	}
};

const changePetStatus = async (req, res, next) => {
	try {
		const petId = req.pet._id;
		const updatePetAdopted = await petService.updateCol(
			petId,
			"petStatus",
			"adopted"
		);

		res.send(updatePetAdopted);
	} catch (error) {
		console.log("change pet status error", error);
	}
};

const update = async (req, res, next) => {
	const petId = req.pet;
	const user = req.user;
	try {
		const response = await petService.update(petId, req.body);

		res.send({ succes: true, updatedPet: response });
	} catch (err) {
		console.log("update pet failed ", err);
	}
};

const updateCol = (req, res) => {
	const data = req.body;
	const petId = req.pet._id;
	petService.updateCol(petId, data.key, data.value);
	res.send(`Pet ${data.key} updated!`);
};

const updatePetStatus = async (req, res) => {
	const petId = req.pet._id;
	const user = req.user;
	const type = req.body.petStatus;

	if (type) {
		const setPetToUserRes = await userService.setPetToUser(
			user._id,
			type,
			petId
		);
		if (setPetToUserRes.success === false) {
			next({ status: 201, msg: setPetToUserRes.msg });
			return;
		}

		/// update pet status to new status

		const response = await petService.update(petId, req.body);

		res.send({ success: true, updatedPet: response });
	}
};

const deletePet = (req, res) => {
	const petId = req.params.petId;
	petService.deletePet(petId);
	res.send(`Pet ${petId} Deleted`);
};

const getPetsByFilter = async (req, res) => {
	const body = req.body;
	const fullQuery = {};
	let sorting = {};

	for (var query in body) {
		if (!body[query].value) {
			delete body[query];
		}
	}

	const getSort = (key) => {
		return key === "weight" ? { weight: -1 } : { height: -1 };
	};

	body.map((query) => {
		switch (query.operator) {
			case "eq":
				fullQuery[query.key] = { $eq: query.value };
				break;
			case "regex":
				fullQuery[query.key] = { $regex: query.value, $options: "i" };
				break;
			case "sort":
				sorting = { sorting: getSort(query.key) };
				break;
		}
	});

	// const sortedQuery = { ...fullQuery, ...sorting };

	const findRes = await petService.findByFilter(fullQuery, sorting);

	res.send(findRes);
};

module.exports = {
	getPets,
	getById,
	addNew,
	update,
	updateCol,
	deletePet,
	updatePetStatus,
	// getReqPet,
	changePetStatus,
	getPetsByFilter,
};
