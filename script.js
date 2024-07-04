"use strict";

///////////////////////////////////////
// Inputs

const incomeValue = document.querySelector(".income__value");
const returnValue = document.getElementById("return-input");
const slider = document.querySelector(".slider");
const depositValue = document.querySelector(".deposit__value");

let returnPercent;

const updateValues = function () {
  returnPercent = returnValue.value / 100;

  depositValue.innerHTML = slider.value;
  incomeValue.innerHTML = Math.trunc(slider.value * returnPercent);
};
updateValues();

///////////////////////////////////////
// Logic

const years = 10;

let data1 = [+slider.value];
let data2 = [+incomeValue.innerHTML];

const updateDataset = function (arr, percentage, years) {
  for (let i = 0; i < years; i++) {
    arr.push(Math.trunc(arr[i] + arr[i] * percentage));
  }
};

updateDataset(data1, returnPercent, years);
updateDataset(data2, returnPercent, years);

///////////////////////////////////////
// Chart setup

const labels = [
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
  color1: {
    border: "cornflowerblue",
    background: "lightskyblue",
  },
  color2: {
    border: "mediumspringgreen",
    background: "palegreen",
  },
};

const data = {
  labels: labels,
  datasets: [
    {
      label: "Balance",
      data: data1,
      borderColor: colors.color1.border,
      backgroundColor: colors.color1.background,
    },
    {
      label: "Income",
      data: data2,
      borderColor: colors.color2.border,
      backgroundColor: colors.color2.background,
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
    pointHitRadius: 50,
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
        text: "Based on last year's performance of an avg. 5% / month",
      },
      tooltip: {
        backgroundColor: "gray",
        padding: 12,
        titleFont: { size: "16" },
        position: "average",
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
  updateDataset(data1, returnPercent, years);
  updateDataset(data2, returnPercent, years);

  chart.data.datasets[0].data = data1;
  chart.data.datasets[1].data = data2;
  chart.update();
};

slider.addEventListener("input", function () {
  updateValues();
  returnValue.blur();
});

slider.addEventListener("change", function () {
  data1 = [+slider.value];
  data2 = [+incomeValue.innerHTML];
  updateChart();
});

returnValue.addEventListener("input", function () {
  updateValues();
  updateChart();
});
