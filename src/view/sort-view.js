import { SORTING_ITEMS } from '../const';
import AbstractView from '../framework/view/abstract-view';

function createSortItemTemplate(sortItem) {
  return (`<div class="trip-sort__item  trip-sort__item--${sortItem.type}">
    <input id="sort-${sortItem.type}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortItem.type}" ${sortItem.active ? '' : 'disabled'} ${sortItem.defaultSelected ? 'checked' : ''}>
    <label class="trip-sort__btn" for="sort-${sortItem.type}">${sortItem.type}</label>
    </div>`);
}

function createSortTemplate() {
  return (`<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${SORTING_ITEMS.map(createSortItemTemplate).join('')}
    </form>`
  );
}

export default class SortView extends AbstractView {
  get template() {
    return createSortTemplate();
  }
}
