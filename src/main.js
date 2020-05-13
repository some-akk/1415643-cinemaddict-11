import FooterStat from "./components/footer-stat";
import FilterController from "./controllers/filter";
import Movies from "./models/movies";
import PageController from "./controllers/page";
import UserRank from "./components/user-rank";
import {generateFilms} from "./mock/film";
import {generateUserRank} from "./mock/user-rank";
import {render} from "./utils/render";
import {FILM_COUNT} from "./const";

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterStatElement = document.querySelector(`.footer__statistics`);
const user = generateUserRank();
const films = generateFilms(FILM_COUNT);
const moviesModel = new Movies();
moviesModel.setFilms(films);

render(siteHeaderElement, new UserRank(user));

render(siteFooterStatElement, new FooterStat(moviesModel));

const filterController = new FilterController(siteMainElement, moviesModel);
filterController.render();

const page = new PageController(siteMainElement, moviesModel);
page.render();
