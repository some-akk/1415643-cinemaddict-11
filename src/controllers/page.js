import Films from "../components/films";
import FilmsExtra from "../components/film-extra";
import FooterStat from "../components/footer-stat";
import NoFilms from "../components/no-films";
import MoreButton from "../components/more-button";
import Sort from "../components/sort";
import {EXTRA_FILM_COUNT, SHOWING_FILM_COUNT_BY_BUTTON, SHOWING_FILM_COUNT_ON_START, SortType} from "../const";
import {remove, render, RENDER_AFTER} from "../utils/render";
import MovieController from "./movie";
import Statistics from "../components/statistics";
import UserRank from "../components/user-rank";

/**
 * @param {Element} listElement
 * @param {array} filmsList
 * @param {function} onDataChange
 * @param {function} onViewChange
 * @return {MovieController[]}
 */
const renderFilms = (listElement, filmsList, onDataChange, onViewChange) => {
  return filmsList.map((film) => {
    const movieController = new MovieController(listElement, onDataChange, onViewChange);
    movieController.render(film);
    return movieController;
  });
};


/**
 * @param {Element} container
 * @param {string} componentName
 * @param {array} filmsList
 * @param {function} onDataChange
 * @param {function} onViewChange
 * @return {MovieController[]}
 */
const renderExtraFilms = (container, componentName, filmsList, onDataChange, onViewChange) => {
  const component = new FilmsExtra(componentName);
  const mostCommentedList = component.getElement().querySelector(`.films-list__container`);
  const renderedFilms = renderFilms(mostCommentedList, filmsList, onDataChange, onViewChange);
  render(container, component, RENDER_AFTER);
  return renderedFilms;
};


/**
 * @param {Object[]} filmsList
 * @param {string} sortType
 * @param {number} start
 * @param {number} end
 * @return {array}
 */
const getSortedFilms = (filmsList, sortType, start, end) => {
  const filmsDefaultOrder = filmsList.slice();
  let sortedFilms = [];
  switch (sortType) {
    case SortType.DEFAULT:
    default:
      sortedFilms = filmsDefaultOrder;
      break;
    case SortType.DATE:
      sortedFilms = filmsDefaultOrder.sort((a, b) => b.release.getTime() - a.release.getTime());
      break;
    case SortType.RATING:
      sortedFilms = filmsDefaultOrder.sort((a, b) => b.rating - a.rating);
      break;
    case SortType.COMMENTS:
      sortedFilms = filmsDefaultOrder.sort((a, b) => b.comments.length - a.comments.length);
      break;
  }

  return sortedFilms.slice(start, end);
};


export default class PageController {

  /**
   * @param {Element} container
   * @param {Movies} movies
   */
  constructor(container, movies) {
    this._container = container;
    this._filmsComponent = new Films();
    this._footerStatComponent = new FooterStat(movies);
    this._moreButtonComponent = new MoreButton();
    this._noFilmsComponent = new NoFilms();
    this._sortComponent = new Sort();
    this._statisticsComponent = new Statistics(movies);
    this._userRankComponent = new UserRank(movies);
    this._moviesModel = movies;
    this._filmsControllers = [];
    this._filmsExtraControllers = [];
    this._showingFilmCount = SHOWING_FILM_COUNT_ON_START;
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._moviesModel.setFilterChangeHandler(this._onFilterChange);
  }

  hideStatistic() {
    this._statisticsComponent.hide();
    this._sortComponent.show();
    this._filmsComponent.show();
  }

  showStatistic() {
    this._sortComponent.hide();
    this._filmsComponent.hide();
    this._statisticsComponent.show();
  }

  render() {
    const films = this._moviesModel.getFilms();
    this._renderHeader();
    this._renderFooter();

    if (films.length === 0) {
      render(this._container, this._noFilmsComponent);
      return;
    }

    render(this._container, this._sortComponent);
    render(this._container, this._filmsComponent);
    render(this._container, this._statisticsComponent);
    this._statisticsComponent.hide();

    const filmsList = this._filmsComponent.getElement().querySelector(`.films-list`);

    this._renderMovies(films.slice(0, this._showingFilmCount));

    const topCommentFilms = getSortedFilms(films, SortType.COMMENTS, 0, EXTRA_FILM_COUNT);
    let renderedExtraFilms = renderExtraFilms(filmsList, `Most commented`, topCommentFilms, this._onDataChange, this._onViewChange);

    const topRatingFilms = getSortedFilms(films, SortType.RATING, 0, EXTRA_FILM_COUNT);
    renderedExtraFilms = renderedExtraFilms.concat(renderExtraFilms(filmsList, `Top rated`, topRatingFilms, this._onDataChange, this._onViewChange));
    this._filmsExtraControllers = this._filmsControllers.concat(renderedExtraFilms);

    this._renderShowMoreButton();
  }

  _onDataChange(movieController, oldData, newData) {
    const isUpdated = this._moviesModel.updateFilm(oldData.id, newData);
    if (isUpdated) {
      this._userRankComponent.rerender();
      movieController.render(newData);
      const updatedFilmControllers = [].concat(this._filmsExtraControllers, this._filmsControllers)
        .filter((it) => it._filmId === newData.id && it !== movieController);
      updatedFilmControllers.forEach((it) => {
        if (it._filmId === newData.id) {
          it.render(newData);
        }
      });
    }
  }

  _onFilterChange() {
    if (this._moviesModel.isStatisticsFilter()) {
      this.showStatistic();
    } else {
      this.hideStatistic();
      this._updateMovies(SHOWING_FILM_COUNT_ON_START);
    }
  }

  _onSortTypeChange(sortType) {
    this._showingFilmCount = SHOWING_FILM_COUNT_ON_START;
    this._removeMovies();
    const sortedFilms = getSortedFilms(this._moviesModel.getFilms(), sortType, 0, this._showingFilmCount);
    this._renderMovies(sortedFilms);
    this._renderShowMoreButton();
  }

  _onViewChange() {
    this._filmsControllers.forEach((it) => it.setDefaultView());
    this._filmsExtraControllers.forEach((it) => it.setDefaultView());
  }

  _renderHeader() {
    const siteHeaderElement = document.querySelector(`.header`);
    render(siteHeaderElement, this._userRankComponent);
  }
  _renderFooter() {
    const siteFooterStatElement = document.querySelector(`.footer__statistics`);
    render(siteFooterStatElement, this._footerStatComponent);
  }

  _removeMovies() {
    this._filmsControllers.forEach((movieController) => movieController.destroy());
    this._filmsControllers = [];
  }

  _renderMovies(films) {
    const siteFilmsListElement = this._filmsComponent.getElement().querySelector(`.films-list__container`);
    const renderedFilms = renderFilms(siteFilmsListElement, films, this._onDataChange, this._onViewChange);
    this._filmsControllers = this._filmsControllers.concat(renderedFilms);
    this._showingFilmCount = this._filmsControllers.length;
  }

  _renderShowMoreButton() {
    remove(this._moreButtonComponent);

    if (this._showingFilmCount >= this._moviesModel.getFilms().length) {
      return;
    }

    const filmsList = this._filmsComponent.getElement().querySelector(`.films-list`);
    render(filmsList, this._moreButtonComponent);

    this._moreButtonComponent.setClickHandler(() => {
      const prevFilmsCount = this._showingFilmCount;
      this._showingFilmCount = this._showingFilmCount + SHOWING_FILM_COUNT_BY_BUTTON;
      const sortedFilms = getSortedFilms(this._moviesModel.getFilms(), this._sortComponent.getSortType(), prevFilmsCount, this._showingFilmCount);
      this._renderMovies(sortedFilms);
      if (this._showingFilmCount >= this._moviesModel.getFilms().length) {
        remove(this._moreButtonComponent);
      }
    });
  }

  _updateMovies(count) {
    this._sortComponent.reset();
    this._removeMovies();
    this._renderMovies(this._moviesModel.getFilms().slice(0, count));
    this._renderShowMoreButton();
  }
}
