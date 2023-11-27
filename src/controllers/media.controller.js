import responseHandler from "../handlers/response.handler.js";
import { tmdbApi } from "../tmdb/tmdb.api.js";

const getTrending = async (req, res) => {
  try {
    const { item, time } = req.params;

    const response = await tmdbApi.mediaTrending({ item, time });

    return responseHandler.ok(res, response);
  } catch {
    responseHandler.error(res);
  }
};
const getGenres = async (req, res) => {
  try {
    const { item } = req.params;

    const response = await tmdbApi.mediaGenres({ item });

    return responseHandler.ok(res, response);
  } catch {
    responseHandler.error(res);
  }
};
const getMain = async (req, res) => {
  try {
    const { item } = req.params;
    const { page } = req.query;

    const response = await tmdbApi.mediaMain({ item, page });

    return responseHandler.ok(res, response);
  } catch {
    responseHandler.error(res);
  }
};
const getDiscover = async (req, res) => {
  try {
    const { item } = req.params;
    const { with_genres, with_keywords, page } = req.query;
    const response = await tmdbApi.mediaDiscover({
      item,
      with_genres,
      with_keywords,
      page,
    });

    return responseHandler.ok(res, response);
  } catch {
    responseHandler.error(res);
  }
};
const getDetails = async (req, res) => {
  try {
    const { item, id } = req.params;

    const response = await tmdbApi.mediaDetails({
      item,
      id,
    });

    return responseHandler.ok(res, response);
  } catch {
    responseHandler.error(res);
  }
};
const getDetailsOptions = async (req, res) => {
  try {
    const { item, id, option } = req.params;
    const { page } = req.query;

    const response = await tmdbApi.mediaDetailsOptions({
      item,
      id,
      option,
      page,
    });

    return responseHandler.ok(res, response);
  } catch {
    responseHandler.error(res);
  }
};
const getCollections = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await tmdbApi.mediaCollections({
      id,
    });

    responseHandler.ok(res, response);
  } catch {
    responseHandler.error(res);
  }
};
const getSeason = async (req, res) => {
  try {
    const { id, number } = req.params;

    const response = await tmdbApi.mediaSeason({
      id,
      number,
    });

    responseHandler.ok(res, response);
  } catch {
    responseHandler.error(res);
  }
};
const search = async (req, res) => {
  try {
    const { item } = req.params;
    const { query, page } = req.query;

    const response = await tmdbApi.mediaSearch({
      item: item === "people" ? "person" : item,
      query,
      page,
    });

    responseHandler.ok(res, response);
  } catch {
    responseHandler.error(res);
  }
};

export default {
  getGenres,
  search,
  getTrending,
  getMain,
  getDiscover,
  getDetails,
  getDetailsOptions,
  getCollections,
  getSeason,
};
