const pointTemplate = document.querySelector("#point");
const taxPointTemplate = document.querySelector("#taxare-point");
const list = document.querySelector(".list__list");
const searchInput = document.querySelector(".list__input");
let data;

async function getData() {
  let data = await fetch("./data.JSON").then((data) => data.json());
  return data;
}

function addListeners(element) {
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
      base_cost: 0,
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
    currentData.taxe = null;
    renderList();
  });

  addTuxButton.addEventListener("click", (e) => {
    const taxElement = taxPointTemplate.content
      .cloneNode(true)
      .querySelector(".city-container__taxare-point");
    const removeButton = taxElement.querySelector(".city-container__button");
    const finalCostString = taxElement.querySelector(
      ".city-container__taxare-cost"
    );
    finalCostString.textContent = `Итоговая стоимость: ${baseCostInput.value} Р`;

    removeButton.addEventListener("click", (e) => {
      taxElement.remove();
    });

    taxContainer.appendChild(taxElement);
    const currentData = data.find(({ id: dataId }) => {
      return id === dataId;
    });
    currentData.taxe = {
      ...currentData.taxe,
      taxes: [...currentData.taxe.taxes, { additionalPrice: 0 }],
    };
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
    const taxContainer = element.querySelector(".city-container__taxare-list");
    const addButton = element.querySelector(".city-container__button");
    const removeButton = element.querySelector(
      ".city-container__button-remove"
    );
    const addTuxButton = element.querySelector(".add-tax");
    const baseCostInput = element.querySelector(
      ".city-container__taxare-input"
    );

    taxe ? (baseCostInput.value = taxe.base_cost) : (baseCostInput.value = 0);

    element.querySelector(".city-container__name").textContent = name;
    element.id = id;

    addListeners(element);

    list.appendChild(element);
  });
}

searchInput.addEventListener("input", (e) => {
  renderList(e.target.value);
});

renderList();
