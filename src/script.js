import './styles/styles.scss'

// BTNS WIDTH CURRENT CURRENCY
let exchangeBtn = document.querySelectorAll('.exchange__btn');
let fromBtn = exchangeBtn[0];
let toBtn = exchangeBtn[1];
// INPUTS
let inputs = [...document.querySelectorAll('input')];
let from = inputs[0];
let to = inputs[1];

// FETCHING
function getData() {
    return fetch('https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11')
    .then(response => {
        return response.json()
    })
}

// FETCH DATA AND INSERT IT IN TABLE
async function showCurrency() {
    let data = await getData();
    let tableBody = document.querySelector('tbody');
    let date = new Date();
    data.forEach(item => {
            let line = `
            <tr>
                <td>${item.ccy}</td>
                <td>${date.toLocaleDateString()}</td>
                <td>${Number(item.buy).toFixed(2)}</td>
                <td>${Number(item.sale).toFixed(2)}</td>
            </tr>
        `
        tableBody.insertAdjacentHTML('beforeEnd', line);
    })
    console.log(data);
}
showCurrency()

// MODAL WINDOW WITH CURRENCY
let modalContent = document.querySelector('.box');
let modal = document.querySelector('.modal__overlay');

// OPEN MODAL
window.addEventListener('click', modalOpen);
async function modalOpen(event) {
    let btn = event.target.dataset.modal;
    if(!btn) return;

    modal.classList.add('active-modal');

    let data = await getData();
    insertModalContent(data, btn);
}

function insertModalContent(data, btn) {
    let title = `<p class="modal__title">${btn}</p>`;
    let content = '';
    
    content += `<p class="box__item" data-${btn}="UAH">UAH</p>`
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
    let fromCurrency = from.dataset.input;
    let toCurrency = to.dataset.input;

    if(fromCurrency == toCurrency) {
        alert('Change currency')
    } else {
        if(from.value > 0) {
            to.removeAttribute('disabled')
            let data = await getData();
    
            let fromCurrencyData = data.find(item => item.ccy == fromCurrency);
    
            if(fromCurrency == 'UAH') {
                let toCurrencyData = data.find(item => item.ccy == toCurrency);
                to.value = (+from.value / +toCurrencyData.buy).toFixed(2);
            }
            else if(toCurrency !== 'UAH') {
                let toCurrencyData = data.find(item => item.ccy == toCurrency);
                let uahCourse = data.find(item => item.ccy == fromCurrency);
                to.value = ((+uahCourse.buy / +toCurrencyData.buy) * +from.value).toFixed(2)
            } else {
                to.value = (+from.value * +fromCurrencyData.buy).toFixed(2);
            }
        } else if (from.value < 0) {
            from.value = 0;
        }
        else {
            to.setAttribute('disabled', 'disabled');
            to.value = 0;
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


