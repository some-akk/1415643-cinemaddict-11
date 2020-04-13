import {getRandomBoolean, getRandomIntegerNumber} from "../utils.js";
import {getRandomArrayItem} from "../utils";

const titleOriginal = `The Great Flamarion`;
const director = `Anthony Mann`;
const country = `USA`;
const writers = `Anne Wigton, Heinz Herald, Richard Weil`;
const actors = `Erich von Stroheim, Mary Beth Hughes, Dan Duryea`;
const category = `18+`;
const genres = [
  `Drama`,
  `Film-Noir`,
  `Mystery`,
];

const getReleaseDate = (year) => {
  const releaseDate = new Date();
  const releaseDay = getRandomIntegerNumber(1, 364);
  releaseDate.setFullYear(year);
  releaseDate.setDate(releaseDay);
  return releaseDate.toLocaleString(`en-GB`, {year: `numeric`, month: `long`, day: `2-digit`});
};

const getGenres = () => {
  return getRandomBoolean() ? Array(getRandomArrayItem(genres)) : genres;
};

const generatePopup = (film) => {
  const popupInfo = {
    titleOriginal,
    genres: getGenres(),
    director,
    release: getReleaseDate(film.year),
    country,
    writers,
    actors,
    category: getRandomBoolean() ? category : ``,
  };
  return Object.assign({}, film, popupInfo);
};

export {generatePopup};
