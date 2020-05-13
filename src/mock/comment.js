import {EMOTIONS} from "../const";
import {getRandomDate, getRandomArrayItem, getUniqueId} from "../utils/common";

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


const generateComment = () => {
  return {
    id: getUniqueId(),
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
