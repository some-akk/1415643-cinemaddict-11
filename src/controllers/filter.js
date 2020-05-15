import SiteMenu from "../components/site-menu";
import {FilterType} from "../const";
import {render, replace} from "../utils/render";
import {getFilmsByFilter} from "../utils/filter";

export default class FilterController {

  /**
   * @param {Element} container
   * @param {Movies} movies
   */
  constructor(container, movies) {
    this._container = container;
    this._moviesModel = movies;

    this._activeFilterType = FilterType.ALL;
    this._siteMenuComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._moviesModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;
    const films = this._moviesModel.getFilmsAll();
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        title: filterType,
        count: getFilmsByFilter(films, filterType).length,
        checked: filterType === this._activeFilterType,
      };
    });
    const oldComponent = this._siteMenuComponent;
    this._siteMenuComponent = new SiteMenu(filters, this._moviesModel._activeFilterType);
    this._siteMenuComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._siteMenuComponent, oldComponent);
    } else {
      render(container, this._siteMenuComponent);
    }
  }

  _onFilterChange(filterType) {
    this._moviesModel.setFilter(filterType);
    this._activeFilterType = filterType;
    this.render();
  }

  _onDataChange() {
    this.render();
  }
}
