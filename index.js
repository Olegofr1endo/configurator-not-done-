const pointTemplate = document.querySelector("#point");
const taxPointTemplate = document.querySelector("#taxare-point");
const list = document.querySelector(".list__list");
const searchInput = document.querySelector(".list__input");
const initialTaxe = { opened: false, base_cost: 0, taxes: [] };
let data;

async function getData() {
  let data = await fetch("./data.JSON").then((data) => data.json());
  data = data.map((item) => {
    return { ...item, taxe: { opened: false, base_cost: 0, taxes: [] } };
  });
  return data;
}

function addListeners(element, id) {
  const taxContainer = element.querySelector(".city-container__taxare-list");
  const addButton = element.querySelector(".city-container__button");
  const removeButton = element.querySelector(".city-container__button-remove");
  const addTuxButton = element.querySelector(".add-tax");
  const baseCostInput = element.querySelector(".city-container__taxare-input");

  baseCostInput.addEventListener("change", (e) => {
    const currentData = data.find(({ id: dataId }) => {
      return id === dataId;
    });
    currentData.taxe["base_cost"] = e.target.value;
    renderList();
  });

  addButton.addEventListener("click", (e) => {
    element.querySelector(".city-container__taxare-container").style.display =
      "flex";
    addButton.classList.add("city-container__button_removed");
    removeButton.classList.remove("city-container__button_removed");
    const currentData = data.find(({ id: dataId }) => {
      return id === dataId;
    });
    currentData.taxe = {
      ...currentData.taxe,
      base_cost: 0,
      opened: true,
    };
  });

  removeButton.addEventListener("click", (e) => {
    element.querySelector(".city-container__taxare-container").style.display =
      "none";
    addButton.classList.remove("city-container__button_removed");
    removeButton.classList.add("city-container__button_removed");
    const currentData = data.find(({ id: dataId }) => {
      return id === dataId;
    });
    currentData.taxe = { ...initialTaxe };
    renderList();
  });

  addTuxButton.addEventListener("click", (e) => {
    const taxe = { additionalPrice: null, startWeight: null, endWeight: null };
    const taxElement = taxPointTemplate.content
      .cloneNode(true)
      .querySelector(".city-container__taxare-point");
    const removeButton = taxElement.querySelector(".city-container__button");
    const finalCostString = taxElement.querySelector(
      ".city-container__taxare-cost"
    );
    const taxInputElements = taxElement.querySelectorAll(
      ".city-container__taxare-input"
    );
    const firstWeightInput = taxInputElements[0];
    const secondWeightInput = taxInputElements[1];
    const taxPriceInput = taxInputElements[2];

    finalCostString.textContent = `Итоговая стоимость: ${baseCostInput.value} Р`;

    const currentData = data.find(({ id: dataId }) => {
      return id === dataId;
    });
    currentData.taxe.taxes.push(taxe);

    firstWeightInput.addEventListener("change", (e) => {
      taxe.startWeight = e.target.value;
    });

    secondWeightInput.addEventListener("change", (e) => {
      taxe.endWeight = e.target.value;
    });

    taxPriceInput.addEventListener("change", (e) => {
      taxe.additionalPrice = e.target.value;
      renderList();
    });

    removeButton.addEventListener("click", (e) => {
      taxElement.remove();
    });

    taxContainer.appendChild(taxElement);
  });
}

async function renderList(search = "") {
  list.innerHTML = "";
  data = data ? data : await getData();
  const filteredData = data.filter(({ name }) => {
    return name.indexOf(search) === 0;
  });
  filteredData.forEach(({ id, name, taxe }) => {
    const element = pointTemplate.content
      .cloneNode(true)
      .querySelector(".city-container");
    const taxesList = element.querySelector(".city-container__taxare-list");
    const baseCostInput = element.querySelector(
      ".city-container__taxare-input"
    );
    const addButton = element.querySelector(".city-container__button");
    const removeButton = element.querySelector(
      ".city-container__button-remove"
    );
    if (taxe.opened) {
      addButton.classList.add("city-container__button_removed");
      element.querySelector(".city-container__taxare-container").style.display =
        "flex";
    } else {
      removeButton.classList.add("city-container__button_removed");
    }

    taxe ? (baseCostInput.value = taxe.base_cost) : (baseCostInput.value = 0);

    if (taxe && taxe.taxes) {
      taxe.taxes.forEach((item) => {
        const taxElement = taxPointTemplate.content
          .cloneNode(true)
          .querySelector(".city-container__taxare-point");
        const removeButton = taxElement.querySelector(
          ".city-container__button"
        );
        const finalCostString = taxElement.querySelector(
          ".city-container__taxare-cost"
        );
        const taxInputElements = taxElement.querySelectorAll(
          ".city-container__taxare-input"
        );
        const firstWeightInput = taxInputElements[0];
        const secondWeightInput = taxInputElements[1];
        const taxPriceInput = taxInputElements[2];

        firstWeightInput.value = item.startWeight;
        secondWeightInput.value = item.endWeight;
        taxPriceInput.value = item.additionalPrice;

        finalCostString.textContent = `Итоговая стоимость: ${
          +baseCostInput.value + +item.additionalPrice
        } Р`;

        firstWeightInput.addEventListener("change", (e) => {
          item.startWeight = e.target.value;
        });

        secondWeightInput.addEventListener("change", (e) => {
          item.endWeight = e.target.value;
        });

        taxPriceInput.addEventListener("change", (e) => {
          item.additionalPrice = e.target.value;
          renderList();
        });

        removeButton.addEventListener("click", (e) => {
          taxElement.remove();
        });

        taxesList.appendChild(taxElement);
      });
    }

    element.querySelector(".city-container__name").textContent = name;
    element.id = id;

    addListeners(element, id);

    list.appendChild(element);
    console.log(data);
  });
}

searchInput.addEventListener("input", (e) => {
  renderList(e.target.value);
});

renderList();
