require("dotenv").config();
const AsyncHandler = require("express-async-handler");

const createGroup = AsyncHandler(async (req, res) => {});

const editGroup = AsyncHandler(async (req, res) => {});

const deleteGroup = AsyncHandler(async (req, res) => {});

const addUserGroup = AsyncHandler(async (req, res) => {});

const removeUserGroup = AsyncHandler(async (req, res) => {});

module.exports = {
  createGroup,
  editGroup,
  deleteGroup,
  addUserGroup,
  removeUserGroup,
};
