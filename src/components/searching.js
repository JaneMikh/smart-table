import {rules, createComparison} from "../lib/compare.js";


export function initSearching(searchField) {
    // Настроить компаратор
    const compare = createComparison(
        ['skipEmptyTargetValues'], 
        [rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false)]
    )
    
    // Применить компаратор
    return function filterData(data, state, action) {
      // Получить значение поиска из состояния
        const searchValue = state[searchField] || '';
           // Если поисковый запрос пустой - возвратить все данные
        if (!searchValue.trim()) {
            return data;
        }
        // Создать объект для сравнения
        const searchObject = { [searchField]: searchValue };
        return data.filter(item => compare(item, searchObject));
    }
}
