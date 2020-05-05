import {getRandomIntegerNumber} from "../utils/common";

const generateUserRank = () => {
  return {
    rank: getRandomIntegerNumber(0, 50),
    avatar: `bitmap@2x.png`,
  };
};

export {generateUserRank};
