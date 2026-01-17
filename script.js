const API_KEY = "5e3d33b51eb979213c03015f";
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`;

// Elements
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const amountEl = document.getElementById("amount");
const taxRateEl = document.getElementById("taxRate");
const convertedResult = document.getElementById("convertedResult");
const taxResult = document.getElementById("taxResult");
const convertBtn = document.getElementById("convertBtn");

// Populate currency selectors
async function loadCurrencies() {
    const res = await fetch(`${BASE_URL}/latest/USD`);
    const data = await res.json();
    const currencies = Object.keys(data.conversion_rates);

    currencies.forEach(cur => {
        fromCurrency.innerHTML += `<option>${cur}</option>`;
        toCurrency.innerHTML += `<option>${cur}</option>`;
    });

    fromCurrency.value = "USD";
    toCurrency.value = "EUR";
}

loadCurrencies();

// Convert & display
convertBtn.addEventListener("click", convertCurrency);

async function convertCurrency() {
    const amount = parseFloat(amountEl.value);
    const taxRate = parseFloat(taxRateEl.value);
    const from = fromCurrency.value;
    const to = toCurrency.value;

    const res = await fetch(`${BASE_URL}/latest/${from}`);
    const data = await res.json();

    const rate = data.conversion_rates[to];
    const converted = amount * rate;
    const taxAmount = converted * (taxRate / 100);
    const totalWithTax = converted + taxAmount;

    convertedResult.textContent = `Converted Amount: ${converted.toFixed(4)} ${to}`;
    taxResult.textContent = `With Tax (${taxRate}%): ${totalWithTax.toFixed(4)} ${to}`;

    drawTrendChart(from, to);
}

// Chart
let chart = null;

async function drawTrendChart(from, to) {
    // Grab a simple trend (last 7 days)
    const trendRes = await fetch(`${BASE_URL}/history/${from}/${to}/7`); 
    // *API-dependent — some providers structured differently
    const trendData = await trendRes.json();

    const labels = Object.keys(trendData.conversion_rates);
    const rates = Object.values(trendData.conversion_rates);

    const ctx = document.getElementById("rateChart").getContext("2d");

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [{
                label: `${from}/${to} Trend`,
                data: rates,
                borderColor: "#007bff",
                fill: false
            }]
        }
    });
}
