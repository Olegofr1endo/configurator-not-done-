import { nanoid } from "https://cdn.jsdelivr.net/npm/nanoid/nanoid.js";

const pointTemplate = document.querySelector("#point");
const taxPointTemplate = document.querySelector("#taxare-point");
const list = document.querySelector(".list__list");
const searchInput = document.querySelector(".list__input");
const initialTaxe = { opened: false, base_cost: 0, taxes: [] };
let id = 0;
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
  const currentData = data.find(({ id: dataId }) => {
    return id === dataId;
  });

  baseCostInput.addEventListener("change", (e) => {
    currentData.taxe["base_cost"] = e.target.value;
    renderList();
  });

  addButton.addEventListener("click", (e) => {
    element.querySelector(".city-container__taxare-container").style.display =
      "flex";
    addButton.classList.add("city-container__button_removed");
    removeButton.classList.remove("city-container__button_removed");
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
    currentData.taxe = { ...initialTaxe };
    renderList();
  });

  addTuxButton.addEventListener("click", (e) => {
    const curId = nanoid();
    const taxe = {
      id: curId,
      additionalPrice: null,
      startWeight: null,
      endWeight: null,
    };
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

    const baseCost = currentData.taxe.base_cost
      ? currentData.taxe.base_cost
      : 0;

    finalCostString.textContent = `Итоговая стоимость: ${baseCost} Р`;

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
      const index = currentData.taxe.taxes.findIndex((item) => {
        return item.id === curId;
      });
      console.log(index);
      currentData.taxe.taxes = [
        ...currentData.taxe.taxes.slice(0, index),
        ...currentData.taxe.taxes.slice(index + 1),
      ];
    });

    taxContainer.appendChild(taxElement);
  });
}

async function renderList(search = "") {
  list.innerHTML = "";
  data = data ? data : await getData();
  const filteredData = data.filter((item) => {
    return item.name.indexOf(search) === 0;
  });
  filteredData.forEach(({ id, name, taxe }, dataIndex) => {
    const element = pointTemplate.content
      .cloneNode(true)
      .querySelector(".city-container");
    const taxesList = element.querySelector(".city-container__taxare-list");
    const addButton = element.querySelector(".city-container__button");
    const removeButton = element.querySelector(
      ".city-container__button-remove"
    );
    const baseCostInput = element.querySelector(
      ".city-container__taxare-input"
    );
    if (taxe.opened) {
      addButton.classList.add("city-container__button_removed");
      element.querySelector(".city-container__taxare-container").style.display =
        "flex";
    } else {
      removeButton.classList.add("city-container__button_removed");
    }

    const baseCost = taxe.base_cost ? taxe.base_cost : 0;

    baseCostInput.value = baseCost;

    if (taxe && taxe.taxes) {
      taxe.taxes.forEach((item, taxeIndex) => {
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
          +baseCost + +item.additionalPrice
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
          const removeIndex = taxe.taxes.findIndex((foundItem) => {
            return foundItem.id === item.id;
          });
          data = [
            ...data.slice(0, dataIndex),
            {
              id: id,
              name: name,
              taxe: {
                ...taxe,
                taxes: [
                  ...taxe.taxes.slice(0, removeIndex),
                  ...taxe.taxes.slice(removeIndex + 1),
                ],
              },
            },
            ...data.slice(dataIndex + 1),
          ];
        });
        console.log(data);

        taxesList.appendChild(taxElement);
      });
    }

    element.querySelector(".city-container__name").textContent = name;
    element.id = id;

    addListeners(element, id);

    list.appendChild(element);
  });
}

searchInput.addEventListener("input", (e) => {
  renderList(e.target.value);
});

renderList();
