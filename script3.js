const filterContainer = document.getElementById("filterContainer");
const bigSearchMobile = document.getElementById("bigSearchMobile");
const bigSearchHeader = document.getElementById("bigSearchHeader");
const bigSearchInp = document.getElementById("bigSearchInp");
const searchPart = document.getElementById("searchPart");
const bigSearchRes = document.getElementById("bigSearchRes");
const filtersMobile = document.getElementById("filtersMobile");
const filtersExit = document.getElementById("filtersExit");
const resetButton = document.getElementById("resetButton");
const markalarMob = document.getElementById("markalarMob");
const driveTypeBtns = document.getElementById("driveTypeBtns");
const additionalFilters = document.getElementById("additionalFilters");
const priceInpMob = document.getElementById("priceInpMob");
const odominInp = document.getElementById("odominInp");
const odomaxInp = document.getElementById("odomaxInp");
const littleSelectOption = document.getElementById("littleSelectOption");
const mainSelect = document.getElementById("nese");
const more = document.getElementById("more");
const bottomLinks = document.getElementById("bottomLinks");
const cityBtn = document.getElementById("cityBtn");
const mainFilters = document.getElementById("mainFilters");
const brandDiv = document.getElementById("brandDiv");
const modelDiv = document.getElementById("modelDiv");
const cityDiv = document.getElementById("cityDiv");
const banDiv = document.getElementById("banTypeDiv");
const currencyDiv = document.getElementById("currencyDiv");
const yearMin = document.getElementById("yearMin");
const yearMax = document.getElementById("yearMax");
const carsGrid = document.getElementById("carsGrid");

let filters = {
  brand: null,
  model: [],
  banType: [],
  odometerMin: null,
  odometerMax: null,
  priceMin: null,
  priceMax: null,
  currency: "AZN",
  yearMin: null,
  yearMax: null,
  credit: false,
  barter: false,
  city: [],
  new: true,
  driven: true,
  engine: 1.5,
};

let definition = {
  brand: "Marka",
  model: "Model",
  city: "Şəhər",
  banType: "Ban",
  yearMin: "İl, min",
  yearMax: "max",
  currency: "AZN",
};

function getData(key, array, filters) {
  const uniqueValues = [];

  if (key === "model" && filters && filters.brand) {
    array.forEach((item) => {
      if (item.brand === filters.brand) {
        if (!uniqueValues.includes(item.model)) {
          uniqueValues.push(item.model);
        }
      }
    });
  } else {
    array.forEach((item) => {
      const value = item[key];
      if (!uniqueValues.includes(value)) {
        uniqueValues.push(value);
      }
    });
  }

  return uniqueValues;
}

let brands = getData("brand", cars);
let models = getData("model", cars);
let bans = getData("banType", cars);
let cities = getData("city", cars);
let currencys = getData("currency", cars);
let years = [];
for (let i = new Date().getFullYear(); i >= 1994; i--) {
  years.push(i);
}

console.log(brands, models, bans, cities, years);

const updateSearchField = function (fType, div) {
  if (fType.includes("year") || fType.includes("curr")) {
    const par = div.querySelector("p");
    par.innerHTML = filters[fType] ? filters[fType] : definition[fType];
  } else {
    const searchDiv = div.querySelector(".valueChoosen");
    const input = searchDiv.querySelector("input");
    const infoDiv = searchDiv.querySelector("div");
    const ul = div.querySelector("ul");

    if (
      filters[fType] &&
      filters[fType].length > 0 &&
      !ul.classList.contains("visible")
    ) {
      input.style.display = "none";
      infoDiv.style.display = "block";
      infoDiv.querySelector("h4").innerText = definition[fType];
      infoDiv.querySelector("p").innerText = filters[fType];
    } else {
      input.style.display = "block";
      infoDiv.style.display = "none";
      input.placeholder =
        filters[fType] && filters[fType].length > 0
          ? filters[fType]
          : definition[fType];
    }
  }
};

const updateResultField = function (fType, div, arr, resultType) {
  const myUl = div.querySelector("ul");
  let txt =
    fType != "currency"
      ? `<li><button onclick="changeFilter('removeSingle','${fType}', null)">Sıfırla</button></li>`
      : "";

  myUl.innerHTML = arr.reduce((acc, item) => {
    let isSelected = false;
    if (Array.isArray(filters[fType])) {
      isSelected = filters[fType].includes(item);
    } else if (filters[fType] == item) {
      isSelected = true;
    }
    return (
      acc +
      `<li><button class="${
        isSelected ? "selectedDes" : ""
      }" onclick="filterHandler('${fType}', '${resultType}', '${item}')">${item} ${
        resultType == "multiple"
          ? `<input type="checkbox" ${isSelected ? "checked" : ""}>`
          : ""
      }</button></li>`
    );
  }, txt);
};

update("currency", currencyDiv, currencys, "single");
update("brand", brandDiv, brands, "single");
update("banType", banDiv, bans, "multiple");
update("city", cityDiv, cities, "multiple");
update("yearMin", yearMin, years, "single");
update("yearMax", yearMax, years, "single");

function update(fType, div, arr, resultType) {
  updateSearchField(fType, div);
  updateResultField(fType, div, arr, resultType);
}

function openTexts(inp, type, fType) {
  const label = inp.parentElement.parentElement.querySelector("label");
  const button = inp.nextElementSibling;

  if (type === "on") {
    label.classList.add("labelUp");
    button.classList.add("visible");
  } else {
    if (!inp.value) {
      label.classList.remove("labelUp");
    }
    button.classList.remove("visible");
  }
}

function closeAllLists(exceptUl) {
  const filtersContainer = document.querySelector("#mainFilters");

  const allDropdowns = filtersContainer.querySelectorAll(
    ".selectWithSearch, .normalSelect"
  );

  allDropdowns.forEach((dropdown) => {
    const ul = dropdown.querySelector("ul");
    if (ul !== exceptUl && ul.classList.contains("visible")) {
      ul.classList.remove("visible");
      const input = dropdown.querySelector("input");
      if (input) {
        input.value = "";
        input.blur();
      }
    }
  });

  update("currency", currencyDiv, currencys, "single");
  update("yearMax", yearMax, years, "single");
  update("yearMin", yearMin, years, "single");

  update("brand", brandDiv, brands, "single");
  update("banType", banDiv, bans, "multiple");
  update("city", cityDiv, cities, "multiple");
}

function toggleList(div, type) {
  const ul = div.querySelector("ul");
  const input = div.querySelector("input");

  event.stopPropagation();
  event.stopImmediatePropagation();

  if (div.id === "modelDiv" && !filters.brand) {
    return;
  }

  closeAllLists(ul);

  if (ul.classList.contains("visible") && event.target == input) return;

  ul.classList.toggle("visible");

  !div.className.includes("normal")
    ? updateSearchField(div.id.slice(0, -3), div)
    : updateSearchField(type, div);

  if (div.id == "brandDiv") {
    console.log("a1");
    if (filters.brand) {
      console.log("a2", getData("model", cars, filters));
      modelDiv.classList.remove("disabledDiv");
    } else {
      modelDiv.classList.add("disabledDiv");
    }
    update("model", modelDiv, getData("model", cars, filters), "multiple");
    modelDiv.querySelector("input").value = "";
    filters.model = [];
  }

  if (ul.classList.contains("visible")) {
    input && input.focus();
  } else {
    input && input.blur();
    input && (input.value = "");
  }
}

function handleWrittenFilter(fType, value) {
  filterHandler(fType, value.value);
}

function filterHandler(filterType, divType, value) {
  let btn = event.target;
  if (divType == "multiple") {
    event.stopPropagation();
    let checkbox = btn.querySelector("input");
    checkbox.checked = !checkbox.checked;
    changeFilter("updateOrAdd", filterType, value);
  } else {
    changeFilter("add", filterType, value);
  }
  btn.classList.toggle("selectedDes");
}

function changeFilter(type, prop, value) {
  if (type == "add") {
    filters[prop] = value;
  } else if (type == "updateOrAdd") {
    let found = false,
      i;
    filters[prop].forEach((item, index) => {
      if (item == value) {
        found = true;
        i = index;
      }
    });
    if (found) filters[prop].splice(i, 1);
    else filters[prop].push(value);

    let updateDiv = document.getElementById(`${prop}Div`);
    if (updateDiv) {
      let inp = updateDiv.querySelector("input");
      if (inp) {
        inp.placeholder =
          filters[prop] && filters[prop].length > 0
            ? filters[prop]
            : definition[prop];
      }
    }
  } else {
    if (Array.isArray(filters[prop])) {
      filters[prop] = [];
    } else {
      filters[prop] = null;
    }

    let updateDiv = document.getElementById(`${prop}Div`);
    if (updateDiv) {
      let inp = updateDiv.querySelector("input");
      if (inp) {
        inp.placeholder = definition[prop];
      }
    }
  }
  console.log(filters);

  updateResetButtonOpacity();
}

function handleSearch(fType, resType) {
  let initData = getData(fType, cars);
  let updatedData = initData.filter((item) =>
    item.toLowerCase().includes(event.target.value.toLowerCase())
  );
  updateResultField(
    fType,
    event.target.closest(`#${fType}Div`),
    updatedData,
    resType
  );
}

function kredBarterHandler(type) {
  event.preventDefault();
  event.target.classList.toggle("selectedTransparent");
  filters[type] = !filters[type];
}

renderCars();
function renderCars(arr = cars) {
  carsGrid.innerHTML =
    arr.length == 0
      ? `<p>Not Found</p>`
      : arr.reduce(
          (acc, item) =>
            acc +
            `
            <div>
                <div style="background-image: url('${
                  item.images[0]
                }')" class="bgImg">
                    <div>
                        <div>
                            ${
                              item.credit
                                ? '<i class="percent fa-solid fa-percent"></i>'
                                : ""
                            }
                            ${
                              item.barter
                                ? '<i class="barter fa-solid fa-arrows-rotate"></i>'
                                : ""
                            }
                        </div>
                        <button>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"
                                fill="transparent" stroke="white" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path
                                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                        </button>
                    </div>
                    <div>
                        <span class="${
                          item.odometer == 0 ? "" : "noVisible"
                        }">${item.odometer == 0 ? "Salon" : ""}</span>
                        <div class="gemCrown">
                            <i class="crown fa-solid fa-crown"></i>
                            <i class="gem fa-solid fa-gem"></i>
                        </div>
                    </div>
                </div>
                <div>
                    <h4>${item.price} ${item.currency} ${item.odometer}${item.odometerUnit}</h4>
                    <p id="carName">${item.brand} ${item.model}</p>
                    <p>Bakı, 27.08.2024 15:13</p>
                </div>
            </div>
    `,
          ""
        );
}

function updateDriveType(type) {
  document.getElementById("hamisiBtn").classList.remove("selectedDriveType");
  document.getElementById("yeniBtn").classList.remove("selectedDriveType");
  document.getElementById("surulmusBtn").classList.remove("selectedDriveType");

  if (type === "hamisi") {
    filters.new = true;
    filters.driven = true;
    document.getElementById("hamisiBtn").classList.add("selectedDriveType");
  } else if (type === "yeni") {
    filters.new = true;
    filters.driven = false;
    document.getElementById("yeniBtn").classList.add("selectedDriveType");
  } else if (type === "surulmus") {
    filters.new = false;
    filters.driven = true;
    document.getElementById("surulmusBtn").classList.add("selectedDriveType");
  }

  console.log(filters);
}

updateDriveType("hamisi");

function resetFilters() {
  filters = {
    brand: null,
    model: [],
    banType: [],
    odometerMin: null,
    odometerMax: null,
    priceMin: null,
    priceMax: null,
    currency: "AZN",
    yearMin: null,
    yearMax: null,
    credit: false,
    barter: false,
    city: [],
    new: true,
    driven: true,
    engine: 1.5,
  };

  document
    .querySelectorAll(".selectWithSearch input, .writeNumField input")
    .forEach((input) => (input.value = ""));

  document
    .querySelectorAll(".selectWithSearch label, .writeNumField label")
    .forEach((label) => label.classList.remove("labelUp"));

  document.getElementById("hamisiBtn").classList.add("selectedDriveType");
  document.getElementById("yeniBtn").classList.remove("selectedDriveType");
  document.getElementById("surulmusBtn").classList.remove("selectedDriveType");

  document
    .querySelector("[onclick=\"kredBarterHandler('credit')\"]")
    .classList.remove("selectedTransparent");
  document
    .querySelector("[onclick=\"kredBarterHandler('barter')\"]")
    .classList.remove("selectedTransparent");

  document
    .querySelectorAll(".deskSearchDiv button")
    .forEach((btn) => btn.classList.remove("selectedDes"));

  updateResetButtonOpacity();
  renderCars(cars);
}

function updateResetButtonOpacity() {
  console.log(filters);

  let anyFiltersApplied = false;

  for (let key in filters) {
    const value = filters[key];

    if (Array.isArray(value) && value.length > 0) {
      anyFiltersApplied = true;
      break;
    } else if (value !== null && value !== false && value !== "AZN") {
      anyFiltersApplied = true;
      break;
    }
  }

  const resetButton = document.getElementById("resetButton");
  resetButton.style.opacity = anyFiltersApplied ? "1" : "0.5";
  resetButton.disabled = !anyFiltersApplied;
}

updateResetButtonOpacity();

function filterCars() {
    let updatedCars = cars.filter((item) => {
      // Check if both credit and barter filters are off
      const showAllCars = !filters.credit && !filters.barter;
  
      return (
        (!filters.brand || item.brand === filters.brand) &&
        (!filters.currency || item.currency === filters.currency) &&
        (filters.model.length === 0 || filters.model.includes(item.model)) &&
        (filters.city.length === 0 || filters.city.includes(item.city)) &&
        (filters.banType.length === 0 || filters.banType.includes(item.banType)) &&
        (filters.new && filters.driven ? true : 
         (!filters.driven || item.odometer !== 0) &&
         (!filters.new || item.odometer === 0)) &&
        (showAllCars || (filters.credit && item.credit) || (filters.barter && item.barter)) &&
        (filters.odometerMax === null || item.odometer <= filters.odometerMax) &&
        (filters.odometerMin === null || item.odometer >= filters.odometerMin) &&
        (filters.yearMax === null || item.year <= filters.yearMax) &&
        (filters.yearMin === null || item.year >= filters.yearMin) &&
        (filters.priceMax === null || item.price <= filters.priceMax) &&
        (filters.priceMin === null || item.price >= filters.priceMin)
      );
    });
  
    renderCars(updatedCars);
  }
  

filterCars();