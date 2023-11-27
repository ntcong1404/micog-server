const baseUrl = process.env.TMDB_BASE_URL;
const key = process.env.TMDB_KEY;

const getUrl = (endpoint, params) => {
  const qs = new URLSearchParams(params);

  return `https://api.themoviedb.org/3/${endpoint}?api_key=d7093f7fe5865f10600b25d45f4f93f3&${qs}`;
};

export default { getUrl };
