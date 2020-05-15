import AbstractComponent from "./abstract-component";
import {DATE_FORMAT, DESCRIPTION_LENGTH} from "../const";
import {formatDateByMask, getFormatDateDuration} from "../utils/common";

const descriptionCut = (text) => {
  return text.length > DESCRIPTION_LENGTH ? text.slice(0, DESCRIPTION_LENGTH - 1) + `…` : text;
};

/**
 *
 * @param {Film} film
 * @return {string}
 */
const createFilmTemplate = (film) => {
  const {title, poster, description, comments, rating, release, duration, genre, inWatchList, inWatched, inFavorite} = film;
  const commentsCount = comments ? comments.length : 0;
  const descriptionText = descriptionCut(description);
  const watchListActiveClass = inWatchList ? `film-card__controls-item--active` : ``;
  const watchedActiveClass = inWatched ? `film-card__controls-item--active` : ``;
  const favoriteActiveClass = inFavorite ? `film-card__controls-item--active` : ``;
  const year = formatDateByMask(release, DATE_FORMAT.YEAR);
  const durationHuman = getFormatDateDuration(duration);
  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${year}</span>
        <span class="film-card__duration">${durationHuman}</span>
        <span class="film-card__genre">${genre}</span>
      </p>
      <img src="./images/posters/${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${descriptionText}</p>
      <a class="film-card__comments">${commentsCount} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${watchListActiveClass}">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${watchedActiveClass}">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite ${favoriteActiveClass}">Mark as favorite</button>
      </form>
    </article>`
  );
};

export default class Film extends AbstractComponent {

  constructor(film) {
    super();
    this._film = film;
  }

  setClickCommentsHandler(handler) {
    this.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, handler);
  }

  setClickPosterHandler(handler) {
    this.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, handler);
  }

  setClickTitleHandler(handler) {
    this.getElement().querySelector(`.film-card__title`).addEventListener(`click`, handler);
  }

  setFavoritesButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, handler);
  }

  setWatchedButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, handler);
  }

  setWatchlistButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, handler);
  }

  getTemplate() {
    return createFilmTemplate(this._film);
  }
}
