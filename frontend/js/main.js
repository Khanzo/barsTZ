var db = null;

var modal = document.getElementById("rowModal");
var modalFullNameValue = document.getElementById('fullNameValue');
var modalAddressValue = document.getElementById('addressValue');
var modalPhoneValue = document.getElementById('phoneValue');
var close_x = document.getElementsByClassName("close")[0];

close_x.onclick = function () {
    modal.style.display = "none";
};

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

var template = Twig.twig({
    id: 'row',
    href: "./twigs/row.twig?v=0.1",
    async: false
});

const bases = function () {
    let module = this;
    this.allRow = 0;
    this.storage = window.localStorage;

    //получаем все строки
    this.getRows = function () {
        let rows = [];

        for (let i = 0; i < module.localStorage.length; i++) {
            let id = module.localStorage.key(i);
            rows[id] = module.getRow(id);
        }

        //сортируем по ключу
        let rowsSort = [];
        Object.keys(rows).sort().forEach(function (key) {
            rowsSort[key] = rows[key];
        });

        return rowsSort;
    };

    //получаем строку по id
    this.getRow = function (id) {
        return id.indexOf('id') === 0 ? JSON.parse(module.storage.getItem(id)) : JSON.parse(module.storage.getItem('id' + id));
    };

    //добавление строки
    this.setRow = function (row) {
        module.allRow = module.storage.length + 1;
        module.storage.setItem('id' + module.allRow, JSON.stringify(row));
    };

    //существование ключа
    this.existsKey = function (id) {
        return module.storage.getItem(id) ? true : false;
    };

    //удалить все
    this.deleteAll = function () {
        module.storage.clear();
    };

    //удаление строки
    this.deleteRow = function (id) {
        id.indexOf('id') === 0 ? module.storage.removeItem(id) : module.storage.removeItem('id' + id);
        module.allRow = module.storage.length;
    };

    //редактирование строки 
    this.editRow = function (id, row) {
        module.deleteRow(id);
        module.setRow(row);
    };

    return module;
};

//получение данных
function getDates() {
    return new Promise(function (resolve, reject) {
        resolve(db.getRows());
    }).catch(function (err) {
        console.error(err);
    });
}

//render таблицы
function renderTables(data) {
    var table = document.getElementById('dataTable');
    table.innerHTML = '';

    Object.keys(data).map(function (objectKey, index) {
        let value = data[objectKey];
        var table_row = document.createElement('tr');
        table_row.setAttribute("id", objectKey);
        table_row.innerHTML = template.render({key: objectKey, data: value});
        table.appendChild(table_row);
    });
}

//первичные данные
function init() {
    db.setRow({full_name: 'Школа №34', address: 'Москва, ул. Гагарина, д.23', phone: '+7 919 123 45 67'});
    db.setRow({full_name: 'Аптека Ветеренар №1', address: 'Челябинск, ул. Космонавтов, д.11', phone: '+7 951 234 55 77'});
    db.setRow({full_name: 'Столовая № 33', address: 'Казань, 3 м-н, д.17', phone: '+7 459 100 55 88'});
    db.setRow({full_name: 'Кремлевский дворец', address: 'Казань, пр. Гагарина, д.11', phone: '+7 523 333 44 66'});
}

//reload
function reload() {
    getDates()
        .then(function (result) {
            renderTables(result);
        });
}

//очистка модалки
function clearModal() {
    modalFullNameValue.value = '';
    modalAddressValue.value = '';
    modalPhoneValue.value = '';
    modal.setAttribute("data-id", 0);
    modalFullNameValue.classList.remove("red");
}

//события
window.onload = function () {
    db = bases();
    reload();
};

//добавление строки данных
addRow.onclick = function () {
    clearModal();
    modal.style.display = "block";
};

//добавление строк данных
addRows.onclick = function () {
    init();
    reload();
};

//удаление строк данных
delRows.onclick = function () {
    db.deleteAll();
    reload();
};

cancelBtn.onclick = function () {
    clearModal();
    modal.style.display = "none";
};

okBtn.onclick = function () {
    let full_name = modalFullNameValue.value.trim();
    let address = modalAddressValue.value.trim();
    let phone = modalPhoneValue.value.trim();
    let key = modal.getAttribute("data-id");

    modalFullNameValue.classList.remove("red");

    if (full_name.length == 0) {
        modalFullNameValue.classList.add("red");
        modalFullNameValue.focus();
        return;
    }

    let row = {full_name: full_name, address: address, phone: phone};

    if (key == 0) {
        //новая запись
        db.setRow(row);
    } else {
        db.editRow(key, row)
    }

    clearModal();
    modal.style.display = "none";
    reload();
};

//удаление строки (кнопка)
function deleteRow_btn(key) {
    if (db.existsKey(key)) {
        document.getElementById(key).remove();
        db.deleteRow(key);
    }
}

//редактирование строки (кнопка)
function editRow_btn(key) {
    if (db.existsKey(key)) {
        modal.setAttribute("data-id", key);
        let row = db.getRow(key);
        modalFullNameValue.value = row.full_name;
        modalAddressValue.value = row.address;
        modalPhoneValue.value = row.phone;
        modal.style.display = "block";
    }
}
