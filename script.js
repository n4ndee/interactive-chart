"use strict";

const chartEl = document.querySelector("#chart");
const formEl = document.querySelector("form");
const incomeValue = document.querySelector(".form__income .form-value");
const depositValue = document.querySelector(".form__deposit .form-value");
const inputReturn = document.querySelector(".form__return .form-input");
const inputDeposit = document.querySelector(".form__deposit .form-input");
const checkInflation = document.querySelector(".form__inflation .form-input");

const rootStyle = getComputedStyle(document.documentElement);

const colors = {
  primary: rootStyle.getPropertyValue("--primary"),
  secondary: rootStyle.getPropertyValue("--secondary"),
  font: rootStyle.getPropertyValue("--font"),
  gray: rootStyle.getPropertyValue("--gray"),
  grayMedium: rootStyle.getPropertyValue("--gray-medium"),
  grayDark: rootStyle.getPropertyValue("--gray-dark"),
};

///////////////////////////////////////
// Functions

// Calculate income

let returnPercent;

const calcIncome = function () {
  if (!inputReturn.checkValidity()) return;

  returnPercent = inputReturn.value / 100;

  depositValue.textContent = inputDeposit.value;
  incomeValue.textContent = Math.trunc(inputDeposit.value * returnPercent);
};

// Update dataset

const years = 10;
const MONTHS = 12;
let inflation = 1;

const updateDataset = function (arr) {
  for (let i = 0; i < years; i++) {
    arr.push(Math.trunc(arr[i] + arr[i] * returnPercent * MONTHS * inflation));
  }
};

// Update chart(s)

const updateChart = function (dataset, starterVal) {
  dataset.length = 1;
  dataset[0] = +starterVal;

  updateDataset(dataset, returnPercent, years);
};

const updateCharts = function () {
  if (!inputReturn.checkValidity()) {
    formEl.reportValidity();
    inputDeposit.setAttribute("disabled", true);

    return;
  } else inputDeposit.removeAttribute("disabled");

  updateChart(balance, depositValue.textContent);
  updateChart(profit, incomeValue.textContent);

  chart.update();
};

///////////////////////////////////////
// Chart data

const labels = [
  "Start",
  "1 Year",
  "2 Years",
  "3 Years",
  "4 Years",
  "5 Years",
  "6 Years",
  "7 Years",
  "8 Years",
  "9 Years",
  "10 Years",
];

let balance = [];
let profit = [];

const data = {
  labels: labels,
  datasets: [
    {
      label: "Balance",
      data: balance,
      borderColor: colors.primary,
      backgroundColor: colors.primary,
    },
    {
      label: "Profit",
      data: profit,
      borderColor: colors.secondary,
      backgroundColor: colors.secondary,
    },
  ],
};

///////////////////////////////////////
// Chart config

const chartTitle = `Based on previous years' avg. performance of ${
  inputReturn.value
}% / month (${Math.trunc(inputReturn.value * 12)}% / yr)`;

const config = {
  type: "line",
  data: data,
  options: {
    responsive: true,
    maintainAspectRatio: false,
    pointHoverRadius: 5,
    interaction: {
      intersect: false,
      mode: "index",
    },
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: chartTitle,
      },
      tooltip: {
        position: "average",
        yAlign: "bottom",
        caretSize: 0,
        backgroundColor: colors.gray,
        titleColor: colors.font,
        bodyColor: colors.font,
        borderColor: colors.grayDark,
        borderWidth: 1,
        cornerRadius: 0,
        padding: 12,
        titleFont: { size: 18 },
        titleMarginBottom: 10,
        bodyFont: { size: 14 },
        bodySpacing: 6,
        boxPadding: 6,
        multiKeyBackground: "none",
      },
    },
  },
};

///////////////////////////////////////
// Init

const chart = new Chart(chartEl, config);

calcIncome();

updateDataset(balance);
updateDataset(profit);

updateCharts();

///////////////////////////////////////
// Chart events

checkInflation.addEventListener("change", function () {
  inflation = this.checked ? 0.97 : 1;
  updateCharts();
});

inputDeposit.addEventListener("input", function () {
  calcIncome();
  inputReturn.blur();
});

inputDeposit.addEventListener("change", function () {
  updateCharts();
});

inputReturn.addEventListener("input", function () {
  calcIncome();
  updateCharts();
});
