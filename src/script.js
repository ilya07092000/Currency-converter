import './styles/styles.scss'

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

let modalContent = document.querySelector('.modal__content');
let modal = document.querySelector('.modal__overlay');

// OPEN MODAL
window.addEventListener('click', modalOpen);
async function modalOpen(event) {
    let btn = event.target.dataset.modal;
    if(!btn) return;

    modal.classList.add('active-modal');

    let data = await getData();
    let title = `<p class="modal__title">${btn}</p>`;
    let content = '';

    data.forEach(item => content += `<p>${item.ccy}</p>`);

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

let inputs = [...document.querySelectorAll('input')];
inputs.forEach(item => item.addEventListener('input', updateValues));

async function updateValues(event) {
    let from = inputs[0];
    let to = inputs[1];

    if(from.value > 0) {
        to.removeAttribute('disabled')
        let data = await getData();
        let fromCurrency = from.dataset.input;
        let toCurrency = to.dataset.input;

        let toCurrencyData = data.find(item => item.ccy == fromCurrency);
        let fromCurrencyData = data.find(item => item.ccy == toCurrency);

        to.value = (+from.value * +toCurrencyData.buy).toFixed(2);
    } else {
        to.setAttribute('disabled', 'disabled');
        to.value = 0;
    }
}


