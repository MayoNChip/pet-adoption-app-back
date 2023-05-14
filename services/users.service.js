const DB = require("../Controllers/db");
const ROLES = require("../libs/permissions.lib");
const UserDB = require("../models/user");
const PetDB = require("../models/pet");
const permissionDB = require("../models/permission");
const { v4: uuidv4 } = require("uuid");
const authService = require("./auth.service");
const users = new DB("users");

const getAll = async () => {
  try {
    const users = await UserDB.find();
    return users;
  } catch (err) {
    console.log("get all users error", err);
    return err;
  }
};

const getById = async (id) => {
  try {
    const user = await UserDB.findById(id);
    return user;
  } catch (err) {
    console.log("get by ID Error =>", err);
    return err;
  }
};

const add = async (userObj) => {
  const newUser = { _id: uuidv4(), ...userObj };
  const user = new UserDB(newUser);

  try {
    const newUser = await user.save();
    try {
      const permission = new permissionDB({
        userId: newUser._id,
        permission: ROLES.USER,
        _id: uuidv4(),
      });
      const res = await permission.save();
    } catch (err) {
      console.log("add user permissions error", err);
      return err;
    }
    return newUser?._id;
  } catch (err) {
    console.log("error adding user", err);
    return "error";
  }
};

const update = async (id, body) => {
  try {
    const newUser = body;
    const checkIfExists = await UserDB.find({ email: newUser.email });
    if (checkIfExists.length !== 0) {
      return { success: false, msg: "User with this email already exists" };
    }

    const res = await UserDB.findByIdAndUpdate(id, body);
    return res;
  } catch (error) {
    console.log("update user details error", error);
  }
};

const updateCol = async (id, col, value) => {
  const updateObj = { col: value };
  try {
    const response = await UserDB.updateOne(
      { _id: id },
      { $set: { key: value } }
    );
  } catch (error) {}
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
  // return users.find((user) => user.email === email)
};

const setPetToUser = async (userId, type, petId) => {
  try {
    switch (type) {
      case "fostered":
        const checkFosteredPets = await UserDB.find({
          _id: userId,
          fosteredPets: petId,
        });
        if (checkFosteredPets.length !== 0) {
          return { success: false, msg: "already fostered by user" };
          // const ownerId = checkFosteredPets[0]._id;
          // const removeFoseredPet = await UserDB.updateOne(
          //   { _id: ownerId },
          //   { $pull: { fosteredPets: petId } }
          // );
        }
        const fosteredResponse = await UserDB.findOneAndUpdate(
          { _id: userId },
          { $push: { fosteredPets: petId } }
        );
        return fosteredResponse;
      case "adopted":
        const checkFostered = await UserDB.find({
          fosteredPets: petId,
        });
        if (checkFostered.length !== 0) {
          const ownerId = checkFostered[0]._id;
          const removeFoseredPet = await UserDB.updateOne(
            { _id: ownerId },
            { $pull: { fosteredPets: petId } }
          );
        }
        const adoptedResponse = await UserDB.findOneAndUpdate(
          { _id: userId },
          { $push: { adoptedPets: petId } },
          { new: true }
        );
        return adoptedResponse;
      case "not-adopted":
        const isFosteredOrAdoptedResponse = await UserDB.find({
          $or: [{ fosteredPets: petId }, { adoptedPets: petId }],
        });
        if (isFosteredOrAdoptedResponse[0].fosteredPets !== 0) {
          const ownerId = isFosteredOrAdoptedResponse[0]._id;
          if (isFosteredOrAdoptedResponse[0].fosteredPets !== 0) {
            const removePetFromUser = await UserDB.updateOne(
              { _id: ownerId },
              { $pull: { fosteredPets: petId } }
            );
          }
          if (isFosteredOrAdoptedResponse[0].adoptedPets !== 0) {
            const removePetFromUser = await UserDB.updateOne(
              { _id: ownerId },
              { $pull: { adoptedPets: petId } }
            );
          }
        }
        return isFosteredOrAdoptedResponse;
    }
  } catch (error) {
    console.log("set pet to user error", error);
    return error;
  }
};

const updateSavedPets = async (userId, petId) => {
  try {
    const user = await UserDB.find({ _id: userId, savedPets: petId });
    if (user.length !== 0) {
      const removeSavedPetRes = await UserDB.findOneAndUpdate(
        { _id: userId, savedPets: petId },
        { $pull: { savedPets: petId } },
        { new: true }
      );
      return { success: true, data: removeSavedPetRes };
    }
    const addSavedPetRes = await UserDB.findOneAndUpdate(
      { _id: userId },
      { $push: { savedPets: petId } },
      { new: true }
    );
    return { success: true, data: addSavedPetRes };
  } catch (error) {
    console.log("add to saved pets error", error);
    return { success: false, error };
  }
};

const changePassword = async (userId, newPassOBJ) => {
  try {
    const user = await UserDB.find({ _id: userId });
    // const hashedOldPassword = authService.generateHash(newPassOBJ.oldPassword);
    const valid = authService.validateLogin(
      newPassOBJ.oldPassword,
      user[0]?.password
    );

    if (!valid) {
      return { success: false, msg: "Current password is incorrect" };
    }
    const hashedNewPassword = authService.generateHash(newPassOBJ.newPassword);
    const updatePassword = await UserDB.findOneAndUpdate(
      { _id: userId },
      { password: hashedNewPassword }
    );
    return { success: true, data: "Password changed" };
  } catch (error) {
    console.log("change password user service error", error);
  }
};

const getMyPets = async (userId) => {
  try {
    const userPets = await UserDB.findOne({ _id: userId });
    const fosteredAndAdoptedPetsArray = [];
    fosteredAndAdoptedPetsArray.push(
      ...userPets.fosteredPets,
      ...userPets.adoptedPets
    );
    const adoptedFosteredPets = await PetDB.find({
      _id: { $in: fosteredAndAdoptedPetsArray },
    });

    const savedPetsArray = [];
    savedPetsArray.push(...userPets.savedPets);

    const savedPetByUser = await PetDB.find({
      _id: { $in: savedPetsArray },
    });

    const allUserPets = {
      adoptedFosteredPets: adoptedFosteredPets,
      savedPets: savedPetByUser,
    };
    return allUserPets;
  } catch (err) {
    console.log("get all pets error=>", err);
    return err;
  }
};

module.exports = {
  getAll,
  add,
  getById,
  update,
  updateCol,
  deleteUser,
  findByEmail,
  setPetToUser,
  changePassword,
  getMyPets,
  updateSavedPets,
};
