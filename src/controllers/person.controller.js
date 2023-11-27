import responseHandler from "../handlers/response.handler.js";
import { tmdbApi, tmdbApiPerson } from "../tmdb/tmdb.api.js";

const getPeople = async (req, res) => {
  try {
    const { type } = req.params;
    const { page } = req.query;

    const response = await tmdbApiPerson.mediaPeople({
      type,
      page,
    });

    return responseHandler.ok(res, response);
  } catch {
    responseHandler.error(res);
  }
};
const getPeopleDetails = async (req, res) => {
  try {
    const { item, id } = req.params;
    console.log(item);
    const response = await tmdbApi.mediaDetails({
      item,
      id,
    });

    return responseHandler.ok(res, response);
  } catch {
    responseHandler.error(res);
  }
};
const getPeopleDetailsOptions = async (req, res) => {
  try {
    const { item, id, option } = req.params;

    const response = await tmdbApi.mediaDetailsOptions({
      item,
      id,
      option,
    });

    return responseHandler.ok(res, response);
  } catch {
    responseHandler.error(res);
  }
};

export default {
  getPeople,
  getPeopleDetails,
  getPeopleDetailsOptions,
};
