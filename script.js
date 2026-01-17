const API_URL = "https://api.frankfurter.app/latest";

const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const amountEl = document.getElementById("amount");
const taxRateEl = document.getElementById("taxRate");
const convertedResult = document.getElementById("convertedResult");
const taxResult = document.getElementById("taxResult");
const trendIndicator = document.getElementById("trendIndicator");

let lastRate = null;

// Load currencies
async function loadCurrencies() {
    const res = await fetch(API_URL);
    const data = await res.json();
    const currencies = Object.keys(data.rates);

    currencies.unshift("USD");

    currencies.forEach(cur => {
        fromCurrency.innerHTML += `<option>${cur}</option>`;
        toCurrency.innerHTML += `<option>${cur}</option>`;
    });

    fromCurrency.value = "USD";
    toCurrency.value = "EUR";
}

loadCurrencies();

// Convert currency
async function convertCurrency() {
    const amount = parseFloat(amountEl.value);
    const taxRate = parseFloat(taxRateEl.value);
    const from = fromCurrency.value;
    const to = toCurrency.value;

    const res = await fetch(`${API_URL}?from=${from}&to=${to}`);
    const data = await res.json();

    const rate = data.rates[to];
    const converted = amount * rate;
    const tax = converted * (taxRate / 100);
    const total = converted + tax;

    convertedResult.textContent = `Converted Amount: ${converted.toFixed(4)} ${to}`;
    taxResult.textContent = `With Tax (${taxRate}%): ${total.toFixed(4)} ${to}`;

    updateTrend(rate);
}

// Trend logic
function updateTrend(currentRate) {
    if (lastRate === null) {
        trendIndicator.textContent = "No previous data";
        lastRate = currentRate;
        return;
    }

    const change = ((currentRate - lastRate) / lastRate) * 100;

    if (change > 0) {
        trendIndicator.textContent = `🔼 Rising by ${change.toFixed(2)}%`;
        trendIndicator.style.color = "green";
    } else if (change < 0) {
        trendIndicator.textContent = `🔽 Falling by ${Math.abs(change).toFixed(2)}%`;
        trendIndicator.style.color = "red";
    } else {
        trendIndicator.textContent = "No change";
        trendIndicator.style.color = "gray";
    }

    lastRate = currentRate;
}

document.getElementById("convertBtn").addEventListener("click", convertCurrency);
