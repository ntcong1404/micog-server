import tmdbConfig from "./tmdb.config.js";

const tmdbEndpoints = {
  mediaTrending: ({ item, time }) =>
    tmdbConfig.getUrl(`trending/${item}/${time}`),

  mediaSearch: ({ item, query, page }) =>
    tmdbConfig.getUrl(`search/${item}`, { query, page }),

  mediaGenres: ({ item }) => tmdbConfig.getUrl(`genre/${item}/list`),
  mediaMain: ({ item, page }) =>
    tmdbConfig.getUrl(`${item}/now_playing`, { page }),

  mediaDiscover: ({ item, with_genres, with_keywords, page }) =>
    tmdbConfig.getUrl(`discover/${item}`, {
      with_genres,
      with_keywords,
      page,
    }),

  mediaDetails: ({ item, id }) => tmdbConfig.getUrl(`${item}/${id}`),
  mediaDetailsOptions: ({ item, id, option }) =>
    tmdbConfig.getUrl(`${item}/${id}/${option}`),
  mediaCollections: ({ id }) => tmdbConfig.getUrl(`collection/${id}`),
  mediaSeason: ({ id, number }) =>
    tmdbConfig.getUrl(`tv/${id}/season/${number}`),
};

const tmdbEndpointsPerson = {
  mediaPeople: ({ type, page }) =>
    tmdbConfig.getUrl(`person/${type}`, { page }),
};

export { tmdbEndpointsPerson, tmdbEndpoints };
