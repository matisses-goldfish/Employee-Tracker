import STableModel from './scripts/models/STableModel';
import STableView from './scripts/views/STableView';

STableView.init(STableModel, {
    el: document.querySelector('.wrapper'),
    url: 'src/datasets/example-one.json'
});

