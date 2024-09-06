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

function getData(type) {
  console.log(filters);
  let datas = [];
  if (type === "model") {
    let allModels = cars
      .filter((car) => !filters.marka || car.brand === filters.marka)
      .filter((car) => !filters.brand || car.brand === filters.brand)
      .map((car) => car.model);

    allModels.forEach((model) => {
      if (!datas.includes(model)) {
        datas.push(model);
      }
    });

    console.log(datas);
  } else {
    let mixeddatas = cars.map((item) => item[type]);

    mixeddatas.forEach((item1) => {
      let found = false;
      datas.forEach((item2) => (item1 == item2 ? (found = true) : ""));
      if (!found) datas.push(item1);
    });
  }

  datas = datas.sort();

  return datas;
}

let searchedData = [];

let filters = {
  city: [],
  marka: null,
  model: [],
  brand : null,
  ban: [],
  odomin: null,
  odomax: null,
  yearmin: null,
  yearmax: null,
  eMin: null,
  eMax: null,
  priceMin: null,
  priceMax: null,
  driveType: null,
  currency: null,
  kredOrBar: null,
};

let isFiltering,
  filterData = [],
  navData = "main";

function handleBottomLinks(type) {
  navData = type;
  updateBottomLinks();
}

function updateBottomLinks() {
  bottomLinks.innerHTML = `
                    <ul>
                        <li><button ${
                          navData == "main" ? 'class="bottomActive"' : ""
                        } onclick="handleBottomLinks('main')"><i class="fa-solid fa-house"></i>ƏSAS</button></li>
                        <li><button ${
                          navData == "fav" ? 'class="bottomActive"' : ""
                        } onclick="handleBottomLinks('fav')"><i class="fa-regular fa-heart"></i>SEÇİLMİŞLƏR</button></li>
                        <li id="newElan"><button ${
                          navData == "new" ? 'class="bottomActive"' : ""
                        } onclick="handleBottomLinks('new')"><span>+</span>YENİ ELAN</button></li>
                        <li><button ${
                          navData == "user" ? 'class="bottomActive"' : ""
                        } onclick="handleBottomLinks('user')"><i class="fa-solid fa-user"></i>KABİNET</button></li>
                        <li><button ${
                          navData == "moreList" ? 'class="bottomActive"' : ""
                        } onclick="handleBottomLinks('moreList')"><i class="fa-solid fa-bars"></i>DAHA ÇOX</button></li>
                    </ul>
                `;
}

updateBottomLinks();
updateHomeButtons();

function handlePopups(name, type) {
  if (type == "big") {
    bigSearchMobile.style.display = "initial";
    bigSearchHeader.innerHTML = `
        <div>
          <button onclick="closePopups('big')" id="bigSearchExit" class="fa-solid fa-chevron-left"></button>
        </div>
        <h2>${name}</h2>
        <div></div>
      `;

    searchPart.innerHTML = `
        <i class="fa-solid fa-magnifying-glass"></i>
        <input oninput="searchResult('${name}')" id="bigSearchInp" type="text" placeholder="${name} daxil edin">
      `;

    let updateDiv, updateArr, filterType;
    updateDiv = bigSearchRes;

    if (name == "Marka") {
      updateArr = [...getData("brand")];
      filterType = "marka";
    } else if (name == "Model") {
      updateArr = [...getData("model")];
      filterType = "model";
    } else if (name == "Şəhər") {
      updateArr = [...getData("city")];
      filterType = "city";
    }

    updateSearchResult(updateDiv, updateArr, filterType, name);
  } else if (name == "Filter") {
    filtersMobile.style.display = "initial";
  }

  document.body.style.overflow = "hidden";
}

function updateSearchResult(div, arr, type, fromDesk) {
  console.log(div,arr,type,fromDesk);
  
  if (fromDesk) {
    if (type == "brand") {
      div.innerHTML = arr.reduce((acc, item) =>
        acc +
          `
          <li><button onclick="addFilter('${type}', '${item}', true)">${item}</button></li>
        `, ''
      );
    } else {
      div.innerHTML = arr.reduce((acc, item) => 
        acc +
          `
          <li><button onclick="toggleFilter('${type}', '${item}', this)">${item} <input type="checkbox"></li>
        `, ''
      );
    }
  } else if (type === "marka") {
    div.innerHTML = arr.reduce((acc, item) => {
      return (
        acc +
        `<button onclick="addFilter('${type}', '${item}')">${item}
          ${
            filters[type] == item
              ? `<div>
              <span></span>
            </div>`
              : ""
          }
      </button>`
      );
    }, "");
  } else {
    div.innerHTML = arr.reduce((acc, item) => {
      return (
        acc +
        `<label class="checkboxContainer">
            <input type="checkbox" onchange="toggleFilter('${type}', '${item}')" ${
          filters[type] && filters[type].includes(item) ? "checked" : ""
        }>
            <span>${item}</span>
          </label>`
      );
    }, "");
  }
}

function closePopups(type) {
  if (type == "big") {
    bigSearchMobile.style.display = "none";
  } else if (type == "Filter") {
    filtersMobile.style.display = "none";
  }
  document.getElementById("bigSearchInp").value = "";
  document.body.style.overflow = "visible";
}

function toggleFilter(prop, value, btn = false) {
  if (!filters[prop]) {
    filters[prop] = [];
  }

  const index = filters[prop].indexOf(value);

  if (index > -1) {
    filters[prop].splice(index, 1);
  } else {
    filters[prop].push(value);
  }

  let checkbox = btn.querySelector("input");
  btn.querySelector("input").checked = checkbox.checked ? false : true;

  console.log(filters);
  updateHomeButtons();
}

function addFilter(prop, value, desktop = false) {
  filters[prop] = value;

  if (prop === "marka") {
    filters.model = [];
  }

  isFiltering = !!filters.marka;

  if (!desktop) {
    bigSearchMobile.style.display = "none";
    document.body.style.overflow = "visible";
    updateHomeButtons();
  } else {
    document.getElementById(`${prop}List`).classList.remove("visible");
    document.getElementById(`${prop}Search`).placeholder = value;
    document.getElementById(`${prop}Search`).value = '';
  }
}

function searchResult(name, typeDev = "mob") {
  let arr, type;

  if (name.toLowerCase().includes("brand")) {
    arr = getData("brand");
    type = typeDev == 'mob' ? "marka" : 'brand';
  } else if (name.toLowerCase().includes("model")) {
    arr = getData("model");
    type = "model";
  } else if (name.toLowerCase().includes("city")) {
    arr = getData("city");
    type = "city";
  }

  let inputId =
    typeDev === "mob" ? "bigSearchInp" : `${name.toLowerCase()}Search`;
  let txt = document.getElementById(inputId).value;
  let updatedArr = arr.filter((item) =>
    item.toLowerCase().includes(txt.toLowerCase())
  );

  let updateDiv =
    typeDev === "mob"
      ? bigSearchRes
      : document.getElementById(`${name.toLowerCase()}List`);
  updateSearchResult(updateDiv, updatedArr, type, true);
}

function updateHomeButtons() {
  console.log(isFiltering);
  if (isFiltering) {
    filterContainer.innerHTML = `
        <button onclick="handlePopups('Marka', 'big')" class="homeButtonPopup">
          <div>
            <div>
                <h4>Marka</h4>
                ${filters.marka ? `<p>${filters.marka}</p>` : ""}
            </div>
            ${
              filters.marka
                ? `<span onclick="removeFilter('marka')" class='scaled'>x</span>`
                : `<span id="arrow" class="fa-solid fa-chevron-down"></span>`
            }
          </div>
        </button>
        <button onclick="handlePopups('Model', 'big')" class="homeButtonPopup">
          <div>  
            <div>
                <h4>Model</h4>
                ${
                  filters.model && filters.model.length > 0
                    ? `<p>${filters.model.join(", ")}</p>`
                    : ""
                }
            </div>
            ${
              filters.model && filters.model.length > 0
                ? `<span onclick="removeFilter('model')" class='scaled'>x</span>`
                : `<span id="arrow" class="fa-solid fa-chevron-down"></span>`
            }
          </div>
        </button>
        <div id="btnsAfterFilter">
            <button><i id="arrow" class="fa-solid fa-sliders"></i>Filtrlər</button>
            <button><i class="fa-solid fa-right-left"></i>Tarixə görə</button>
        </div>
        <h2>LADA (VAZ) almaq</h2>
        <p>5270 elan</p>
      `;
  } else {
    filterContainer.innerHTML = `
        <button onclick="handlePopups('Marka', 'big')">
            <div>
                <p><i class="fa-solid fa-car"></i> Bütün markalar</p>
                <span id="arrow" class="fa-solid fa-chevron-down"></span>
            </div>
        </button>
        <button onclick="handlePopups('Filter', 'little')">
            <div>
                <p><i class="fa-solid fa-sliders"></i> Filtrlər</p>
            </div>
        </button>
      `;
  }
}

function removeFilter(prop) {
  event.stopPropagation();
  filters[prop] = null;

  isFiltering = !!filters.marka;

  updateHomeButtons();
}

function resetFilters() {
  filters = {
    city: [],
    marka: null,
    model: [],
    ban: [],
    odomin: null,
    odomax: null,
    yearmin: null,
    yearmax: null,
    eMin: null,
    eMax: null,
    priceMin: null,
    priceMax: null,
    driveType: null,
    currency: null,
    kredOrBar: null,
  };

  isFiltering = false;
  updateHomeButtons();
}

function checkFilters() {
  for (const key in filters) {
    if (filters.hasOwnProperty(key)) {
      if (
        filters[key] !== null &&
        (Array.isArray(filters[key]) ? filters[key].length > 0 : true)
      ) {
        return true;
      }
    }
  }
  return false;
}

function updateFilterSection() {
  if (!checkFilters()) resetButton.style.color = "rgba(255, 0, 0, .7)";
}

function handleDeskFilter(name, type) {
  if (name == 'model') if (!filters.brand) return;

  const list = document.getElementById(`${name}List`);

  if (type == "toggle") {
    list.classList.toggle("visible");
    console.log('test');
  } else if (!list.classList.contains("visible")) {
    list.classList.add("visible");
  }

  updateSearchResult(list, getData(`${name}`), `${name}`, true);
}
