import {GENRE} from "../const.js";
import {getRandomArrayItem, getRandomBoolean, getRandomIntegerNumber} from "../utils.js";
import {generateComments} from "./comment.js";

const posters = [
  `the-dance-of-life.jpg`,
  `sagebrush-trail.jpg`,
  `the-man-with-the-golden-arm.jpg`,
  `santa-claus-conquers-the-martians.jpg`,
  `popeye-meets-sinbad.png`,
];

const titles = [
  `The Dance of Life`,
  `Sagebrush Trail`,
  `The Man with the Golden Arm`,
  `Santa Claus Conquers the Martians`,
  `Popeye the Sailor Meets Sindbad the Sailor`,
];

const descriptionText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

const getRandomTitle = () => {
  return getRandomArrayItem(titles);
};

const getRandomPoster = () => {
  return getRandomArrayItem(posters);
};

const getRandomDescription = () => {
  const sentenceLength = getRandomIntegerNumber(1, 5);
  const descriptions = descriptionText.split(`. `).map((el) => {
    if (el.substr(-1) !== `.`) {
      el += `.`;
    }
    return el;
  });
  return descriptions.sort(() => Math.random() - 0.5).slice(0, sentenceLength).join(` `);
};

const getRandomRating = () => {
  const integer = getRandomIntegerNumber(1, 9);
  const sign = getRandomBoolean() ? 1 : -1;
  const rating = integer + Math.random() * sign;
  return rating.toFixed(1);
};

const getRandomYear = () => {
  const start = new Date(`1930-10-10`);
  const year = start.getFullYear();
  const sign = getRandomBoolean() ? 1 : -1;
  return year + sign * getRandomIntegerNumber(0, 20);
};

const getRandomDuration = () => {
  const hours = getRandomIntegerNumber(0, 5);
  const minutes = getRandomIntegerNumber(0, 59);
  return (hours ? `${hours}h ` : ``) + `${minutes}m`;
};

const director = `Anthony Mann`;
const country = `USA`;
const writers = `Anne Wigton, Heinz Herald, Richard Weil`;
const actors = `Erich von Stroheim, Mary Beth Hughes, Dan Duryea`;
const category = `18+`;

const getReleaseDate = (year) => {
  const releaseDate = new Date();
  const releaseDay = getRandomIntegerNumber(1, 364);
  releaseDate.setFullYear(year);
  releaseDate.setDate(releaseDay);
  return releaseDate.toLocaleString(`en-GB`, {year: `numeric`, month: `long`, day: `2-digit`});
};

const getGenres = () => {
  const slice = getRandomIntegerNumber(1, (GENRE.length - 1)) * (getRandomBoolean() ? -1 : 1);
  return getRandomBoolean() ? Array(getRandomArrayItem(GENRE)) : GENRE.slice(slice);
};

const generateFilm = () => {
  const comments = getRandomBoolean() ? generateComments(getRandomIntegerNumber(1, 5)) : [];
  const title = getRandomTitle();
  const year = getRandomYear();
  const genres = getGenres();
  return {
    title,
    poster: getRandomPoster(),
    description: getRandomDescription(),
    rating: getRandomRating(),
    year,
    duration: getRandomDuration(),
    genre: getRandomArrayItem(genres),
    comments,
    inWatchList: getRandomBoolean(),
    inWatched: getRandomBoolean(),
    inFavorite: getRandomBoolean(),
    titleOriginal: title,
    director,
    release: getReleaseDate(year),
    genres,
    country,
    writers,
    actors,
    category: getRandomBoolean() ? category : ``,
  };
};

const generateFilms = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateFilm);
};

export {generateFilms};
