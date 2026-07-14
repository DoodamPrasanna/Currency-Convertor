const countryList = {
  USD: "US",
  INR: "IN",
  EUR: "EU",
  GBP: "GB",
  JPY: "JP",
  AUD: "AU",
  CAD: "CA",
  CHF: "CH",
  CNY: "CN",
  SGD: "SG",
  NZD: "NZ",
  AED: "AE",
  SAR: "SA",
  KRW: "KR",
  BRL: "BR",
};

const dropdowns = document.querySelectorAll(".dropdown select");

const btn = document.querySelector(".Ex-btn");

const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");

const msg = document.querySelector(".msg");

for (let select of dropdowns) {

  for (let currCode in countryList) {

    let option = document.createElement("option");

    option.innerText = currCode;
    option.value = currCode;

    if (select.name === "from" && currCode === "USD") {
      option.selected = true;
    }

    if (select.name === "to" && currCode === "INR") {
      option.selected = true;
    }

    select.append(option);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
    updateExchangeRate();
  });
}

const updateFlag = (element) => {

  const currCode = element.value;

  const countryCode = countryList[currCode];

  const img =
    element.parentElement.querySelector("img");

  img.src =
    `https://flagcdn.com/64x48/${countryCode.toLowerCase()}.png`;
};

const updateExchangeRate = async () => {

  let amount =
    document.querySelector(".amount input");

  let amtVal = amount.value;

  if (amtVal === "" || amtVal <= 0) {
    amtVal = 1;
    amount.value = 1;
  }

  msg.innerText = "Converting...";

  try {

    const response =
      await fetch(
        `https://open.er-api.com/v6/latest/${fromCurr.value}`
      );

    const data = await response.json();

    const rate =
      data.rates[toCurr.value];

    const finalAmount =
      (amtVal * rate).toFixed(2);

    msg.innerHTML =
      `<strong>${amtVal} ${fromCurr.value}</strong>
       = 
       <strong>${finalAmount} ${toCurr.value}</strong>`;

    addHistory(
      amtVal,
      fromCurr.value,
      finalAmount,
      toCurr.value
    );

  } catch {

    msg.innerText =
      "Failed to fetch exchange rates";
  }
};

const addHistory = (
  amount,
  from,
  result,
  to
) => {

  const historyList =
    document.getElementById("historyList");

  const li =
    document.createElement("li");

  li.textContent =
    `${amount} ${from} → ${result} ${to}`;

  historyList.prepend(li);

  if (
    historyList.children.length > 5
  ) {
    historyList.removeChild(
      historyList.lastChild
    );
  }
};

document
.querySelector(".Eamt")
.addEventListener(
  "input",
  updateExchangeRate
);

btn.addEventListener(
  "click",
  updateExchangeRate
);

document
.querySelector(".swap")
.addEventListener(
  "click",
  () => {

    let temp = fromCurr.value;

    fromCurr.value = toCurr.value;

    toCurr.value = temp;

    updateFlag(fromCurr);
    updateFlag(toCurr);

    updateExchangeRate();
  }
);

window.addEventListener(
  "load",
  updateExchangeRate
);
