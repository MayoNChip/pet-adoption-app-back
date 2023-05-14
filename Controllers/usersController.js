const userService = require("../services/users.service");
const petService = require("../services/pets.service");

const getUsers = async (req, res) => {
  const users = await userService.getAll();
  res.send(users);
};

const getById = async (req, res) => {
  const user = await userService.getById(req.params.userId);
  res.send({ success: true, data: user });
};

const getMe = (req, res) => {
  const user = req.user;
  const userPermission = userService.getById();
  delete user.password;
  res.send(user);
};

const addNew = (req, res) => {
  const newUserId = userService.add(req.body);
  res.send(`New User Created': ${newUserId}`);
};

const update = async (req, res, next) => {
  try {
    const updateUserRes = await userService.update(req.params.userId, req.body);
    if (updateUserRes.success === false) {
      next({ status: 201, msg: updateUserRes.msg });
    }
    res.send({ success: true, message: "user updated" });
  } catch (error) {
    next({ success: false, error });
  }
};

const updateCol = (req, res) => {
  const data = req.body;
  const userId = req.params.userId;
  // userService.updateCol(userId, data.key, data.value);
  res.send(`User ${data.key} updated!`);
};

const deleteUser = (req, res) => {
  const userId = req.params.userId;
  userService.deleteUser(userId);
  res.send(`User ${userId} Deleted`);
};

const updatePassword = async (req, res, next) => {
  try {
    const changePasswordRes = await userService.changePassword(
      req.user._id,
      req.body
    );
    if (changePasswordRes.success === false) {
      next({ status: 201, msg: changePasswordRes.msg });
    }
    res.send(changePasswordRes);
  } catch (error) {
    console.log("change password error");
  }
};

const addSavedPet = async (req, res, next) => {
  const petId = req.params.petId;
  const userId = req.user._id;
  const addSavedPetRes = await userService.updateSavedPets(userId, petId);
  res.send(addSavedPetRes);
};

const getMyPets = async (req, res) => {
  const userId = req.user._id;

  const petsResponse = await userService.getMyPets(userId);
  res.send({ success: true, data: petsResponse });
};

const getPetsByUser = async (req, res) => {
  const userId = req.params.userId;

  const user = await userService.getById(userId);

  // const petArray = [
  //   ...user.adoptedPets,
  //   ...user.fosteredPets,
  //   ...user.savedPets,
  // ];
  // const fullPetArray = petArray.map(async (id) => {
  //   const pet = await petService.getById(id);
  //   return pet;
  // });
  let userPets = {};
  const fosteredPetsArray = user.fosteredPets.map(async (id) => {
    const pet = await petService.getById(id);
    return pet;
  });

  const fosteredResult = await Promise.all(fosteredPetsArray);

  const adoptedPetsArray = user.adoptedPets.map(async (id) => {
    const pet = await petService.getById(id);
    return pet;
  });

  const adoptedResult = await Promise.all(adoptedPetsArray);

  const savedPetsArray = user.savedPets.map(async (id) => {
    const pet = await petService.getById(id);
    return pet;
  });

  const savedResult = await Promise.all(savedPetsArray);

  userPets = {
    fosteredPets: fosteredResult,
    adoptedPets: adoptedResult,
    savedPets: savedResult,
  };
  res.send({ success: true, data: userPets });
};

module.exports = {
  getUsers,
  getById,
  addNew,
  update,
  updateCol,
  deleteUser,
  getMe,
  updatePassword,
  getMyPets,
  addSavedPet,
  getPetsByUser,
};
