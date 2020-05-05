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
