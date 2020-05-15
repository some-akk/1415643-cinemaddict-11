import FilterController from "./controllers/filter";
import Movies from "./models/movies";
import PageController from "./controllers/page";
import {generateFilms} from "./mock/film";
import {FILM_COUNT} from "./const";

const siteMainElement = document.querySelector(`.main`);
const films = generateFilms(FILM_COUNT);
const moviesModel = new Movies();
moviesModel.setFilms(films);

const filterController = new FilterController(siteMainElement, moviesModel);
filterController.render();

const page = new PageController(siteMainElement, moviesModel);
page.render();
