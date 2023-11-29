import responseHandler from "../handlers/response.handler.js";
import { MovieInListModel, ListModel } from "../models/list.model.js";

// list
const addList = async (req, res) => {
  try {
    const list = new ListModel({
      ...req.body,
      user: req.user.id,
    });

    await list.save();

    responseHandler.created(res, list);
  } catch {
    responseHandler.error(res);
  }
};

const removeList = async (req, res) => {
  try {
    const { listId } = req.params;

    const list = await ListModel.findOne({
      user: req.user.id,
      _id: listId,
    });
    if (!list) return responseHandler.notfound(res);

    await MovieInListModel.deleteMany({
      user: req.user.id,
      list: listId,
    });
    await list.remove();

    responseHandler.ok(res);
  } catch {
    responseHandler.error(res);
  }
};

const getListsOfUser = async (req, res) => {
  try {
    const lists = await ListModel.find({ user: req.user.id }).sort(
      "-createdAt"
    );
    responseHandler.ok(res, lists);
  } catch {
    responseHandler.error(res);
  }
};

// movies in list
const addMovieIntoList = async (req, res) => {
  try {
    const { listId } = req.params;
    const { type, mediaId } = req.body;
    const duplicate = await MovieInListModel.findOne({
      user: req.user.id,
      type: type,
      mediaId: mediaId,
      list: listId,
    });
    if (!!duplicate) return responseHandler.ok(res, "already exist");

    const movieIntoList = new MovieInListModel({
      ...req.body,
      user: req.user.id,
      list: listId,
    });

    await movieIntoList.save();

    responseHandler.created(res, movieIntoList);
  } catch {
    responseHandler.error(res);
  }
};

const removeMovieInList = async (req, res) => {
  try {
    const { movieId, listId } = req.params;
    const movieInList = await MovieInListModel.findOne({
      user: req.user.id,
      _id: movieId,
      list: listId,
    });

    if (!movieInList) return responseHandler.notfound(res);

    await movieInList.remove();

    responseHandler.ok(res);
  } catch {
    responseHandler.error(res);
  }
};

const getMovieOfList = async (req, res) => {
  try {
    const { listId } = req.params;

    const movieOfList = await MovieInListModel.find({
      user: req.user.id,
      list: listId,
    }).sort("-createdAt");
    responseHandler.ok(res, movieOfList);
  } catch {
    responseHandler.error(res);
  }
};

export default {
  addList,
  removeList,
  getListsOfUser,
  addMovieIntoList,
  removeMovieInList,
  getMovieOfList,
};
