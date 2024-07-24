"use strict";

const chartEl = document.querySelector("#chart");
const formEl = document.querySelector("form");
const formInputs = document.querySelectorAll(".form-container input");
const incomeDisplay = document.querySelector(".form__income .form-value");
const depositDisplay = document.querySelector(".form__deposit .form-value");
const inputReturn = document.querySelector(".form__fields #return-input");
const inputYears = document.querySelector(".form__fields #years-input");
const inputProtect = document.querySelector(".form__fields #protect-input");
const checkInflation = document.querySelector(".form__fields #inflation-check");
const inputDeposit = document.querySelector(".form__deposit .form-input");

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

// Validate inputs

const validateInputs = function () {
  const inputsNotInFocus = Array.from(formInputs).filter(
    (el) => document.activeElement !== el
  );

  if (!formEl.checkValidity()) {
    formEl.reportValidity();

    inputsNotInFocus.forEach((el) => {
      el.setAttribute("disabled", true);
    });

    return false;
  } else {
    inputsNotInFocus.forEach((el) => {
      el.removeAttribute("disabled");
    });
  }
};

// Calculate income

let returnPercent, depositValue, incomeValue;

const calcIncome = function () {
  if (validateInputs() === false) return;

  returnPercent = inputReturn.value;
  depositValue = inputDeposit.value;
  incomeValue = depositValue * (returnPercent / 100);

  depositDisplay.textContent = Number(depositValue).toLocaleString("en-GB");
  incomeDisplay.textContent = Number(incomeValue).toLocaleString("en-GB", {
    minimumFractionDigits: 2,
  });
};

// Create dataset

let years;

const createDataset = function (arr) {
  years = inputYears.value;
  const MONTHS = 12;
  const protectPercent = inputProtect.value;
  let inflation = checkInflation.checked ? 0.97 : 1;

  for (let i = 0; i < years; i++) {
    arr.push(
      Math.trunc(
        arr[i] +
          arr[i] *
            (returnPercent / 100) *
            (protectPercent / 100) *
            MONTHS *
            inflation
      )
    );
  }
};

// Create labels

let labels = [];

const createLabels = function (arr) {
  for (let i = 0; i < years - 1; i++) {
    arr.push(`${i + 2} Years`);
  }
};

// Update dataset

const updateDataset = function (arr, starterValue) {
  arr.length = 1;
  arr[0] = +starterValue;

  createDataset(arr);
};

// Update labels

const updateLabels = function (arr) {
  arr.length = 2;
  arr[0] = "Start";
  arr[1] = "1 Year";

  createLabels(arr);
};

// Update chart

const updateChart = function () {
  if (validateInputs() === false) return;

  updateDataset(balance, depositValue);
  updateDataset(profit, incomeValue);

  updateLabels(labels);

  chart.update();
};

///////////////////////////////////////
// Chart data

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

    scales: {
      x: {
        ticks: {
          maxRotation: 30,
        },
      },
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
        borderWidth: 1,
        borderColor: colors.grayDark,
        cornerRadius: 0,
        backgroundColor: colors.gray,
        padding: 12,
        titleFont: { size: 18 },
        titleColor: colors.font,
        titleMarginBottom: 10,
        bodyFont: { size: 14 },
        bodyColor: colors.font,
        bodySpacing: 6,
        boxPadding: 2,
        // Workaround because can't hide multiKeyBackground
        usePointStyle: true,

        callbacks: {
          labelPointStyle: () => {
            return {
              pointStyle: "rect",
            };
          },

          label: function (context) {
            let label = context.dataset.label || "";

            if (label) {
              label += ": ";
            }

            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("en-GB", {
                style: "currency",
                currency: "GBP",
              }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
  },
};

///////////////////////////////////////
// Init

const chart = new Chart(chartEl, config);

calcIncome();

createDataset(balance);
createDataset(profit);

updateChart();

///////////////////////////////////////
// Form events

inputReturn.addEventListener("input", function () {
  calcIncome();
  updateChart();
});

inputYears.addEventListener("input", updateChart);

inputProtect.addEventListener("input", updateChart);

checkInflation.addEventListener("change", updateChart);

inputDeposit.addEventListener("change", updateChart);

inputDeposit.addEventListener("input", function () {
  calcIncome();

  // Doesn't work on iOS
  // navigator.vibrate(20);
});
