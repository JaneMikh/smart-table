import {rules, createComparison} from "../lib/compare.js";


export function initSearching(searchField) {
    // @todo: #5.1 — настроить компаратор
    const compare = createComparison(
        ['skipEmptyTargetValues'], 
        [rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false)]
    )

    // @todo: #5.2 — применить компаратор
    return function filterData(data, state, action) {
        return data.filter(row => compare(row, state));
    };
}
