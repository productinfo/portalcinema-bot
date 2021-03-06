import requestPromise from 'request-promise';
import { PORTAL_URL } from '../constants/index';

const makeRequest = (method = 'get', path = '', options = {}) => (
  requestPromise[method](`${PORTAL_URL}${path}`, {
    timeout: 2e4,
    ...options
  })
);

const fetchFilms = () => {
  console.log('fetch', String(new Date));
  return makeRequest()
    .then(getFilmsId)
    .then(getFilmsInfo)
    .catch(error => {
      console.error(error);
      return fetchFilms();
    });
};

const getFilmsId = html => {
  const re = /load_film_info\((\d+)(?:,\s'(anonce)')?\)/g;
  const filmsId = new Set();
  let matches = [];

  do {
    matches = re.exec(html);
    if (matches && matches.length > 1) {
      filmsId.add(matches[1]);
    }
  } while (matches);

  return [...filmsId];
};

const fetchFilm = film => (
  makeRequest(
    'post',
    'products/index/getInfo',
    { form: { film } }
  ).then(
    JSON.parse
  ).catch(error => {
    console.error(error);
    return fetchFilm(film);
  })
);

const getFilmsInfo = filmsId => (
  Promise.all(
    filmsId.map(fetchFilm)
  )
);

let filmsPromise = null;

const reFetch = () => {
  filmsPromise = null;
  getFilms();
};

const getFilms = () => (
  filmsPromise = (
    filmsPromise
    || fetchFilms().then(films => {
      console.log('completed');
      setTimeout(reFetch, 9e5); // 15 minutes
      return films;
    })
  )
);
getFilms();

export default () => filmsPromise;

export const getPoster = imageId => (
  `${PORTAL_URL}uploads/products/main/${imageId}`
);
