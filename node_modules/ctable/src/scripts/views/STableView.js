let _model, _options, _res;

let $table, $tr, $th, $td, $thead, $tbody;

const STableView = {
    init: (model, options) => {
        _model = model;
        _options = options;

        $table = document.createElement('table');
        $tr = document.createElement('tr');
        $th = document.createElement('th');
        $td = document.createElement('td');
        $thead = document.createElement('thead');
        $tbody = document.createElement('tbody');

        render();
    }
};

function render(orderBy) {
    $table.classList.add('CeleraOne-table');

    _model.get(_options.url, orderBy).then((response) => {
        _res = response;
        let table = buildTable(_res);

        _options.el.innerHTML = '';
        _options.el.appendChild(table);
    });

    document.querySelector('body').addEventListener('click', triggerSortItems);
}

function buildTable(list) {
    let table = $table.cloneNode(false);
    let tbody = $tbody.cloneNode(false);
    let columns = addColumnHeaders(list, table);

    list.forEach((item, rowIndex) => {
        let tr = $tr.cloneNode(false);

        if (rowIndex % 2 === 0) {
            tr.classList.add('even');
        } else {
            tr.classList.add('odd');
        }

        columns.forEach((col, columnIndex) => {
            let td = $td.cloneNode(false);
            let cellValue = list[rowIndex][columns[columnIndex]];

            td.appendChild(document.createTextNode(cellValue || ''));
            tr.appendChild(td);
            tbody.appendChild(tr);
        });

        table.appendChild(tbody);

    });

    return table;
}

function addColumnHeaders(list, table) {
    let columnSet = [];
    let thead = $thead.cloneNode(false);
    let tr = $tr.cloneNode(false);

    for (let i = 0, l = list.length; i < l; i++) {
        for (let key in list[i]) {
            let k = key.replace(/_/g, ' ');

            if (list[i].hasOwnProperty(key) && columnSet.indexOf(key) === -1) {
                columnSet.push(key);
                let th = $th.cloneNode(false);

                th.appendChild(document.createTextNode(k));
                tr.appendChild(th);
                thead.appendChild(tr);
            }
        }
    }

    table.appendChild(thead);

    return columnSet;
}

function triggerSortItems(event) {
    if (event.target.tagName.toLowerCase() === 'th') {
        render(event.target.textContent.replace(/ /g, '_'));
    }

    event.preventDefault();
}

module.exports = STableView;

