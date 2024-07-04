"use strict";

const incomeValue = document.querySelector(".income__value");
const returnValue = document.querySelector("#return-input");
const slider = document.querySelector(".slider");
const depositValue = document.querySelector(".deposit__value");

let returnPercent = returnValue.value / 100;
incomeValue.innerHTML = slider.value * returnPercent;
depositValue.innerHTML = slider.value;

slider.addEventListener("input", function () {
  depositValue.innerHTML = this.value;
  incomeValue.innerHTML = Math.trunc(slider.value * returnPercent);

  returnValue.blur();
});

returnValue.addEventListener("input", function () {
  returnPercent = returnValue.value / 100;
  depositValue.innerHTML = slider.value;
  incomeValue.innerHTML = Math.trunc(slider.value * returnPercent);
});

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

const data1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const data2 = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

const data = {
  labels: labels,
  datasets: [
    {
      label: "Dataset 1",
      data: data1,
      borderColor: colors.color1.border,
      backgroundColor: colors.color1.background,
    },
    {
      label: "Dataset 2",
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
      },
    },
  },
};

///////////////////////////////////////
// Chart display

const chartEl = document.getElementById("chart");
new Chart(chartEl, config);
