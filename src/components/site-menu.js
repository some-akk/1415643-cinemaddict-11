const createFilterMarkup = (filter) => {
  const {title, count} = filter;
  return (
    `<a href="#${title.toLowerCase()}" class="main-navigation__item">${title} <span class="main-navigation__item-count">${count}</span></a>`
  );
};

export const createSiteMenuTemplate = (filters) => {
  const filtersMarkup = filters.map((it) => createFilterMarkup(it)).join(`\n`);
  return (
    `<nav class="main-navigation">
        <div class="main-navigation__items">
          <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
          ${filtersMarkup}
        </div>
        <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};
