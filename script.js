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
// const nese = document.getElementById("nese");
// const nese = document.getElementById("nese");
// const nese = document.getElementById("nese");
// const nese = document.getElementById("nese");
// const nese = document.getElementById("nese");
// const nese = document.getElementById("nese");
// const nese = document.getElementById("nese");
// const nese = document.getElementById("nese");
// const nese = document.getElementById("nese");

function getData(type) {
  let datas = [];
  if (type == "model") {
    datas = cars
      .filter((item) => item.brand == filters.marka)
      .map((item2) => item2.model);
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
  city: null,
  marka: null,
  model: null,
  ban: null,
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

    updateSearchResult(updateDiv, updateArr, filterType);
  } else if (name == "Filter") {
    filtersMobile.style.display = "initial";
  }

  document.body.style.overflow = "hidden";
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

function updateSearchResult(div, arr, type) {
  div.innerHTML = arr.reduce(
    (acc, item) =>
      acc +
      `<button onclick="addFilter('${type}', '${item}')">${item}
          ${
            filters[type] == item
              ? `<div>
              <span></span>
            </div>`
              : ""
          }
      </button>`,
    ``
  );
}

function addFilter(prop, value) {
  filters[prop] = value;
  if (prop == "marka") filters.model = null;
  isFiltering = true;
  bigSearchMobile.style.display = "none";
  document.body.style.overflow = "visible";
  updateHomeButtons();
}

function searchResult(name) {
  let arr;
  let toBeChecked;

  if (name === "Marka") {
    arr = getData("brand");
    toBeChecked = "brand";
  } else if (name === "Model") {
    arr = getData("model");
    toBeChecked = "model";
  } else if (name === "Şəhər") {
    arr = getData("city");
    toBeChecked = "city";
  }

  let txt = document.getElementById("bigSearchInp").value;
  let updatedArr = arr.filter((item) => item.includes(txt));
  updateSearchResult(bigSearchRes, updatedArr, toBeChecked);
}

function updateHomeButtons() {
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
                        ${filters.model ? `<p>${filters.model}</p>` : ""}
                    </div>
                    ${
                      filters.model
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
  
  
  if (!checkFilters()) {
    isFiltering = false;
  }

  updateHomeButtons();
}

function checkFilters() {
  for (const key in filters) {
    if (filters[key] && key != "model") {
      return true;
    }
  }

  return false;
}

function resetFilters() {
  filters = {
    city: null,
    marka: null,
    model: null,
    ban: null,
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
}

function updateFilterSection() {
  if (!checkFilters()) resetButton.style.color = "rgba(255, 0, 0, .5)"
}
