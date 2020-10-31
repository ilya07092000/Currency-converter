import './styles/styles.scss'

function getData() {
    return fetch('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5')
    .then(response => {
        return response.json()
    })
}

async function showCurrency() {
    let data = await getData();
    let tableBody = document.querySelector('tbody');
    let date = new Date();
    data.forEach(item => {
        if (item.ccy !== "BTC") {
            let line = `
            <tr>
                <td>${item.ccy}</td>
                <td>${date.toLocaleDateString()}</td>
                <td>${Number(item.buy).toFixed(2)}</td>
                <td>${Number(item.buy).toFixed(2)}</td>
            </tr>
        `
        tableBody.insertAdjacentHTML('beforeEnd', line);
        }
    })

    console.log(data);

}
showCurrency()
