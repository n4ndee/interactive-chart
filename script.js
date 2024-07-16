"use strict";

const incomeValue = document.querySelector(".form__income .form-value");
const depositValue = document.querySelector(".form__deposit .form-value");
const inputReturn = document.querySelector(".form__return .form-input");
const inputDeposit = document.querySelector(".form__deposit .form-input");
const checkboxInflation = document.querySelector(
  ".form__inflation .form-input"
);

// Calculate income

let returnPercent;

const calcIncome = function () {
  if (!inputReturn.checkValidity()) return;

  returnPercent = inputReturn.value / 100;

  depositValue.textContent = inputDeposit.value;
  incomeValue.textContent = Math.trunc(inputDeposit.value * returnPercent);
};
calcIncome();

// Update dataset

const years = 10;
const MONTHS = 12;
let inflation = 1;

let data1 = [+inputDeposit.value];
let data2 = [+incomeValue.textContent];

const updateDataset = function (arr, percentage, years) {
  for (let i = 0; i < years; i++) {
    arr.push(Math.trunc(arr[i] + arr[i] * percentage * MONTHS * inflation));
  }
};
updateDataset(data1, returnPercent, years);
updateDataset(data2, returnPercent, years);

// Update chart

const updateChart = function () {
  if (!inputReturn.checkValidity()) return;

  data1.length = 1;
  data2.length = 1;

  data1[0] = +inputDeposit.value;
  data2[0] = +incomeValue.textContent;

  updateDataset(data1, returnPercent, years);
  updateDataset(data2, returnPercent, years);

  chart.update();
};

///////////////////////////////////////
// Chart setup

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

const root = document.documentElement;

const colors = {
  primary: getComputedStyle(root).getPropertyValue("--primary"),
  secondary: getComputedStyle(root).getPropertyValue("--secondary"),
  font: getComputedStyle(root).getPropertyValue("--font"),
  gray: getComputedStyle(root).getPropertyValue("--gray"),
  grayMedium: getComputedStyle(root).getPropertyValue("--gray-medium"),
  grayDark: getComputedStyle(root).getPropertyValue("--gray-dark"),
};

const data = {
  labels: labels,
  datasets: [
    {
      label: "Balance",
      data: data1,
      borderColor: colors.primary,
      backgroundColor: colors.primary,
    },
    {
      label: "Profit",
      data: data2,
      borderColor: colors.secondary,
      backgroundColor: colors.secondary,
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
        text: `Based on previous years' avg. performance of ${
          inputReturn.value
        }% / month (${Math.trunc(inputReturn.value * 12)}% / yr)`,
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
        bodyFont: { size: 14 },
        boxPadding: 6,
        multiKeyBackground: "none",
      },
    },
  },
};

///////////////////////////////////////
// Chart display

const chartEl = document.getElementById("chart");
const chart = new Chart(chartEl, config);

inputDeposit.addEventListener("input", function () {
  calcIncome();
  inputReturn.blur();
});

checkboxInflation.addEventListener("change", function () {
  inflation = this.checked ? 0.97 : 1;
  updateChart();
});

inputDeposit.addEventListener("change", function () {
  updateChart();
});

inputReturn.addEventListener("input", function () {
  calcIncome();
  updateChart();
});
