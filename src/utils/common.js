import {DATE_FORMAT} from "../const";
import moment from "moment";
const momentDurationFormat = require(`moment-duration-format`);
momentDurationFormat(moment);

export const getRandomBoolean = () => {
  return Math.random() > 0.5;
};

export const getRandomIntegerNumber = (min, max) => {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

export const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length - 1);
  return array[randomIndex];
};

export const getRandomDate = (startYear = `2020-01-01`) => {
  const start = new Date(startYear);
  return new Date(+start + Math.random() * (new Date() - start));
};

export const getFormatDateDuration = (date) => {
  return moment.duration(date, `minutes`).format(DATE_FORMAT.DURATION);
};

export const formatDateFromNow = (date) => {
  return moment(date).fromNow();
};

export const formatDateByMask = (date, mask) => {
  return moment(date).format(mask);
};

export const getUniqueId = () => {
  return Math.random().toString().slice(2);
};

export const getRankTitle = (rank) => {
  if (!rank) {
    return ``;
  }
  if (rank >= 21) {
    return `Movie Buff`;
  }
  if (rank >= 11) {
    return `Fan`;
  }
  return `Novice`;
};
