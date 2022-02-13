let _res;

const STableModel = {
    get: (url, orderBy) => {
        return new Promise(function(resolve, reject) {
            let request = null;

            if (window.XMLHttpRequest) {
                request = new window.XMLHttpRequest();
            } else {
                request = new window.ActiveXObject('Microsoft.XMLHTTP');
            }

            request.open('GET', url);

            request.onload = function() {
                if (request.status === 200) {
                    _res = JSON.parse(request.response);

                    sortItems(orderBy);

                    resolve(_res);
                } else {
                    reject(new Error(request.statusText));
                }
            };

            request.onerror = function() {
                reject(new Error('Network error'));
            };

            request.send();
        });
    }
};

function sortItems(_orderBy) {
    _res.sort((a, b) => {
        let tempA, tempB;

        if (_orderBy === 'price' || _orderBy === 'phone') {
            tempA = parseInt(a[_orderBy], 10);
            tempB = parseInt(b[_orderBy], 10);

            return tempB - tempA;
        } else if (_orderBy === 'fda_date_approved') {
            tempA = (typeof a[_orderBy] !== 'undefined') ? a[_orderBy].split('/').reverse().join() : '';
            tempB = (typeof b[_orderBy] !== 'undefined') ? b[_orderBy].split('/').reverse().join() : '';
        } else {
            tempA = (typeof a[_orderBy] !== 'undefined') ? a[_orderBy].toLowerCase() : '';
            tempB = (typeof b[_orderBy] !== 'undefined') ? b[_orderBy].toLowerCase() : '';
        }

        if (tempA > tempB) {
            return -1;
        }

        if (tempA < tempB) {
            return 1;
        }

        return 0;
    });
}

module.exports = STableModel;

