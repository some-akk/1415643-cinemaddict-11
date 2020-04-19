import {RENDER_AFTER_BEGIN, RENDER_BEFORE_END} from "./const";

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

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const render = (container, element, place = RENDER_BEFORE_END) => {
  switch (place) {
    case RENDER_AFTER_BEGIN:
      container.prepend(element);
      break;
    case RENDER_BEFORE_END:
      container.append(element);
      break;
  }
};
