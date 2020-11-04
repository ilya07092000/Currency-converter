import './styles/styles.scss'

// BTNS WIDTH CURRENT CURRENCY
let exchangeBtn = document.querySelectorAll('.exchange__btn');
let fromBtn = exchangeBtn[0];
let toBtn = exchangeBtn[1];
// INPUTS
let inputs = [...document.querySelectorAll('input')];
let from = inputs[0];
let to = inputs[1];
// MODAL
let modalContent = document.querySelector('.box');
let modal = document.querySelector('.modal__overlay');

// FETCHING
function getData() {
    return fetch('https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11')
    .then(response => {
        return response.json()
    })
}

// FETCH DATA AND INSERT IT IN TABLE
(async function showCurrency() {
    let data = await getData();
    let tableBody = document.querySelector('tbody');
    let date = new Date();
    data.forEach(item => {
            let line = `
            <tr>
                <td aria-label="Сurrency">${item.ccy}</td>
                <td aria-label="Date">${date.toLocaleDateString()}</td>
                <td aria-label="Buy">${Number(item.buy).toFixed(2)}</td>
                <td aria-label="Sale">${Number(item.sale).toFixed(2)}</td>
            </tr>
        `
        tableBody.insertAdjacentHTML('beforeEnd', line);
    })
    console.log(data);
})()

// OPEN MODAL
window.addEventListener('click', modalOpen);
async function modalOpen(event) {
    let btn = event.target.dataset.modal;
    if(!btn) return;

    modal.classList.add('active-modal');

    let data = await getData();
    insertModalContent(data, btn);
}

// ADD CONTENT TO MODAL
function insertModalContent(data, btn) {
    let title = `<p class="modal__title">${btn}</p>`;
    let content = '';

    content += `<p class="box__item" data-${btn}="UAH">UAH</p>`;
    data.forEach(item => content += `<p class="box__item" data-${btn}="${item.ccy}">${item.ccy}</p>`);

    modalContent.innerHTML = title;
    modalContent.innerHTML += content;
}

// CLOSE MODAL
window.addEventListener('click', modalClose);
function modalClose(event) {
    if(event.target.classList.contains('modal__close') || event.target.classList.contains('modal__overlay')) {
        modal.classList.remove('active-modal');
    }
}

// CURRENCY CALCULATOR
inputs.forEach(item => item.addEventListener('input', updateValues));
async function updateValues(event) {
    let fromCurrency = from.dataset.input; // data-input - current currency
    let toCurrency = to.dataset.input; // data-input - current currency

    if(fromCurrency == toCurrency) { // PREVENT SAME CURRENCY
        alert('The same currency, change one of them'); 
    } else {
        if(from.value > 0) {
            let data = await getData();
    
            if(fromCurrency == 'UAH') { // DEDICATED CALCULATION TO CONVERT FROM UAH
                let toCurrencyData = data.find(item => item.ccy == toCurrency); // WHAT CURRENCY TO CONVERT
                to.value = (+from.value / +toCurrencyData.buy).toFixed(2); // CALCULATE AND INSERT VALUE
            }
            else if(toCurrency !== 'UAH') { // DEDICATED CALCULATION TO ANOTHER CURRENCY 
                let toCurrencyData = data.find(item => item.ccy == toCurrency); // IN WHAT CURRENCY TO CONVERT
                let uahCourse = data.find(item => item.ccy == fromCurrency); // FIND UAH COURSE IN CURRENT VALUE
                to.value = ((+uahCourse.buy / +toCurrencyData.buy) * +from.value).toFixed(2) // CALCULATE AND INSERT VALUE
            } else { // USUAL CASE
                let fromCurrencyData = data.find(item => item.ccy == fromCurrency); // FIND CURRENCY COURSE IN ARRAY
                to.value = (+from.value * +fromCurrencyData.buy).toFixed(2);
            }
        } else if (from.value < 0) {
            from.value = 0;
        }
    }
}

// CHANGE CURRENCY
window.addEventListener('click', changeCurrency)

function changeCurrency(event) {
    let btn = event.target.dataset.from || event.target.dataset.to;
    if(!btn) return;
    let action = Object.keys(event.target.dataset);
    if(action == 'from') {
        from.dataset.input = btn;
        fromBtn.textContent = btn;
    } else {
        to.dataset.input = btn;
        toBtn.textContent = btn;
    }
    modal.classList.remove('active-modal');
    updateValues();
}


