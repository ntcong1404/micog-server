import axiosClient from "../axios/axios.client.js";
import { tmdbEndpointsPerson, tmdbEndpoints } from "./tmdb.endpoints.js";

const tmdbApi = {
  mediaTrending: async ({ item, time }) =>
    await axiosClient.get(tmdbEndpoints.mediaTrending({ item, time })),

  mediaSearch: async ({ item, query, page }) =>
    await axiosClient.get(tmdbEndpoints.mediaSearch({ item, query, page })),

  mediaGenres: async ({ item }) =>
    await axiosClient.get(tmdbEndpoints.mediaGenres({ item })),
  mediaMain: async ({ item, page }) =>
    await axiosClient.get(tmdbEndpoints.mediaMain({ item, page })),
  mediaDiscover: async ({ item, with_genres, with_keywords, page }) =>
    await axiosClient.get(
      tmdbEndpoints.mediaDiscover({ item, with_genres, with_keywords, page })
    ),

  mediaDetails: async ({ item, id }) =>
    await axiosClient.get(tmdbEndpoints.mediaDetails({ item, id })),
  mediaDetailsOptions: async ({ item, id, option }) =>
    await axiosClient.get(
      tmdbEndpoints.mediaDetailsOptions({ item, id, option })
    ),
  mediaCollections: async ({ id }) =>
    await axiosClient.get(tmdbEndpoints.mediaCollections({ id })),
  mediaSeason: async ({ id, number }) =>
    await axiosClient.get(tmdbEndpoints.mediaSeason({ id, number })),
};
const tmdbApiPerson = {
  mediaPeople: async ({ type, page }) =>
    await axiosClient.get(tmdbEndpointsPerson.mediaPeople({ type, page })),
};
export { tmdbApi, tmdbApiPerson };
