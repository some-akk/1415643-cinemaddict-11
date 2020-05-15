import AbstractSmartComponent from "./abstract-smart-component";
import {StatisticsFilter} from "../const";
import {getRankTitle} from "../utils/common";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

const filterNames = [
  {type: StatisticsFilter.ALL_TIME, name: `All time`},
  {type: StatisticsFilter.TODAY, name: `Today`},
  {type: StatisticsFilter.WEEK, name: `Week`},
  {type: StatisticsFilter.MONTH, name: `Month`},
  {type: StatisticsFilter.YEAR, name: `Year`},
];

function createStatisticsFilterTemplate(filter, isChecked) {
  const checked = isChecked ? `checked` : ``;
  return (
    `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${filter.type}" value="${filter.type}" ${checked}>
    <label for="statistic-${filter.type}" class="statistic__filters-label">${filter.name}</label>`
  );
}

function createStatisticsTemplate(statistics, statisticsFilter) {
  const filters = filterNames.map((it) => createStatisticsFilterTemplate(it, it.type === statisticsFilter)).join(`\n`);
  const {count, duration, genres} = statistics;
  const userRank = getRankTitle(count);
  const durationHours = Math.floor(duration / 60);
  const durationMinutes = (duration % 60);
  const topGenre = genres.length ? genres[0].title : ``;

  return (
    `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${userRank}</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>
      ${filters}
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${count} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${durationHours} <span class="statistic__item-description">h</span> ${durationMinutes} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`
  );
}

function renderGenresChart(genres) {

  const BAR_HEIGHT = 50;
  const statisticCtx = document.querySelector(`.statistic__chart`);

  statisticCtx.height = BAR_HEIGHT * genres.length;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: genres.map((it) => it.title),
      datasets: [{
        data: genres.map((it) => it.count),
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
}

export default class Statistics extends AbstractSmartComponent {

  constructor(movies) {
    super();
    this._moviesModel = movies;
    this._statisticFilter = StatisticsFilter.ALL_TIME;
  }

  getTemplate() {
    const statistics = this._moviesModel.getStatistics();
    return createStatisticsTemplate(statistics, this._statisticFilter);
  }

  recoveryListeners() {

  }

  rerender() {
    super.rerender();
    this._chart = this._renderChart();
  }

  show() {
    super.show();
    this.rerender();
  }

  _renderChart() {
    this._resetCharts();
    const {genres} = this._moviesModel.getStatistics();
    if (genres.length > 0) {
      renderGenresChart(genres);
    }
  }

  _resetCharts() {
    if (this._chart) {
      this._chart.destroy();
      this._chart = null;
    }
  }

}
