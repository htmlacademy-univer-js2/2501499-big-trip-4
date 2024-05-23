import { FilterTypes } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

function createFilterItemsTemplate(filter, activeFilter, checkedFilter) {
  return `<div class="trip-filters__filter">
        <input id="filter-${filter}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" data-filter-type="${filter}" value="${filter}"
        ${(checkedFilter ? 'checked' : '')} ${activeFilter ? '' : 'disabled'}>
        <label class="trip-filters__filter-label" for="filter-${filter}">${filter}</label>
      </div>`;
}

function createFilterTemplate({ activeFilters, selectedFilter }) {
  return (`<form class="trip-filters" action="#" method="get">
      ${Object.values(FilterTypes).map((filter) => createFilterItemsTemplate(filter, activeFilters.includes(filter), filter === selectedFilter)).join('')}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
}

export default class FilterView extends AbstractView {
  #activeFilters = [];
  #selectedFilter = null;
  #onFilterTypeChange = null;

  #filterTypeChangeHandler = (event) => {
    event.preventDefault();
    this.#onFilterTypeChange?.(event.target.dataset.filterType);
  };

  constructor({activeFilters, selectedFilter, onFilterTypeChange}) {
    super();
    this.#activeFilters = activeFilters;
    this.#selectedFilter = selectedFilter;

    this.#onFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFilterTemplate({
      activeFilters: this.#activeFilters,
      selectedFilter: this.#selectedFilter
    });
  }
}
