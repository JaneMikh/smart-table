import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate);

    // @todo: #1.2 —  вывести дополнительные шаблоны до и после таблицы

    //Добавляем шаблон ДО таблицы
    before.reverse().forEach(itemId => {
        root[itemId] = cloneTemplate(itemId);

        //Сохраняю объекты, полученные после клонирования, в объекте таблицы root
        // для последующего доступа к ним
        root.container.prepend(root[itemId].container);
    });

    //Добавляем шаблон ПОСЛЕ таблицы
    after.forEach(itemId => {
        root[itemId] = cloneTemplate(itemId);
        root.container.append(root[itemId].container);
    });

    // @todo: #1.3 —  обработать события и вызвать onAction()
    root.container.addEventListener('change', () => onAction());
    root.container.addEventListener('reset', () => setTimeout(onAction));
    root.container.addEventListener('submit', (e) => {
        e.preventDefault();
        onAction(e.submitter);
    });

    const render = (data) => {
        // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
        const nextRows = data.map(item => {

            //Получаем клонированный шаблон строки
            //В row у нас шаблон, а в item — конкретная строка данных
            const row = cloneTemplate(rowTemplate); 

            //Делаем перебор по ключам данных и в колбеке присваиваем значения соответсвующим элементам
            Object.keys(item).forEach(key => {
                if (row.elements[key]) {
                   
                   //Проверяем тип тега для элемента (опционально)
                   const element = row.elements[key];
                   if (element.tagName === 'INPUT' || element.tagName === 'SELECT') { 
                      element.value = item[key];
                   } else {
                      element.textContent = item[key];
                   }
                }
            });
            //Возвращаем контейнер с со списком
            return row.container;
        });
        root.elements.rows.replaceChildren(...nextRows);
    }

    return {...root, render};
}