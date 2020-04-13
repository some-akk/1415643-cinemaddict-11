const filterNames = [
  `all`, `overdue`, `today`, `favorites`, `repeating`, `archive`
];

const generateFilters = () => {
  return filterNames.map((it) => {
    return {
      title: it,
      count: Math.floor(Math.random() * 10),
    };
  });
};

export {generateFilters};
