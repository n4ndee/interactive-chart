"use strict";

///////////////////////////////////////
// Inputs

const incomeValue = document.querySelector(".form__income--value");
const depositValue = document.querySelector(".form__deposit--value");
const inputReturn = document.querySelector(".form__input--return");
const inputDeposit = document.querySelector(".form__input--deposit");

let returnPercent;

const calcIncome = function () {
  returnPercent = inputReturn.value / 100;

  depositValue.textContent = inputDeposit.value;
  incomeValue.textContent = Math.trunc(inputDeposit.value * returnPercent);
};
calcIncome();

///////////////////////////////////////
// Logic

const years = 10;
const MONTHS = 12;

let data1 = [+inputDeposit.value];
let data2 = [+incomeValue.textContent];

const updateDataset = function (arr, percentage, years) {
  for (let i = 0; i < years; i++) {
    arr.push(Math.trunc(arr[i] + arr[i] * percentage * MONTHS));
  }
};

updateDataset(data1, returnPercent, years);
updateDataset(data2, returnPercent, years);

///////////////////////////////////////
// Chart setup

const labels = [
  "Beginning",
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

const colors = {
  color1: "cornflowerblue",
  color2: "mediumspringgreen",
};

const data = {
  labels: labels,
  datasets: [
    {
      label: "Balance",
      data: data1,
      borderColor: colors.color1,
      backgroundColor: colors.color1,
    },
    {
      label: "Profit",
      data: data2,
      borderColor: colors.color2,
      backgroundColor: colors.color2,
    },
  ],
};

///////////////////////////////////////
// Chart config

const config = {
  type: "line",
  data: data,
  options: {
    responsive: true,
    maintainAspectRatio: false,
    pointRadius: 5,
    pointHoverRadius: 10,
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
        text: `Based on previous years' avg. performance of ${
          inputReturn.value
        }% / month (${inputReturn.value * 12}% / yr)`,
      },
      tooltip: {
        backgroundColor: "gray",
        padding: 12,
        titleFont: { size: "16" },
        position: "average",
        yAlign: "bottom",
        caretSize: 0,
      },
    },
  },
};

///////////////////////////////////////
// Chart display

const chartEl = document.getElementById("chart");
const chart = new Chart(chartEl, config);

const updateChart = function () {
  data1.length = 1;
  data2.length = 1;

  data1[0] = +inputDeposit.value;
  data2[0] = +incomeValue.textContent;

  updateDataset(data1, returnPercent, years);
  updateDataset(data2, returnPercent, years);

  chart.update();
};

inputDeposit.addEventListener("input", function () {
  calcIncome();
  inputReturn.blur();
});

inputDeposit.addEventListener("change", function () {
  updateChart();
});

inputReturn.addEventListener("input", function () {
  calcIncome();
  updateChart();
});
