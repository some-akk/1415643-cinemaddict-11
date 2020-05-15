import AbstractSmartComponent from "./abstract-smart-component";
import {getRankTitle} from "../utils/common";

const createUserRankTemplate = (rank) => {
  return (
    `<section class="header__profile profile">
    <p class="profile__rating">${getRankTitle(rank)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
  );
};

export default class UserRank extends AbstractSmartComponent {

  constructor(moviesModel) {
    super();
    this._moviesModel = moviesModel;
  }

  getTemplate() {
    return createUserRankTemplate(this._moviesModel.getWatchedCounter());
  }

  recoveryListeners() {

  }
}
