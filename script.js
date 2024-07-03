"use strict";

const incomeValue = document.querySelector(".income__value");
const returnValue = document.querySelector("#return");
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
