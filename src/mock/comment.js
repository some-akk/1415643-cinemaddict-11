import {getRandomArrayItem} from "../utils.js";
import {EMOTIONS} from "../const.js";

const authors = [
  `Tim Macoveev`,
  `John Doe`,
];

const comments = [
  `Interesting setting and a good cast`,
  `Booooooooooring`,
  `Very very old. Meh`,
  `Almost two hours? Seriously?`,
];

const getRandomDate = () => {
  const start = new Date(`2020-01-01`);
  return new Date(+start + Math.random() * (new Date() - start));
};

const generateComment = () => {
  return {
    emotion: getRandomArrayItem(EMOTIONS),
    date: getRandomDate(),
    author: getRandomArrayItem(authors),
    text: getRandomArrayItem(comments),
  };
};

const generateComments = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateComment);
};

export {generateComments};
