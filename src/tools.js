const selectedColorText = document.getElementById("selectedColor");
const buttonery = document.getElementById("buttonery");
const selectedClassName = "current";
const originalColor =
  document.getElementsByTagName("body")[0].style.backgroundColor;

function setPageBackground() {
  chrome.storage.sync.get("color", ({ color }) => {
    document.body.style.backgroundColor = color;
  });
}

async function onClick(event) {
  const current = event.target.parentElement.querySelector(
    `.${selectedClassName}`
  );
  if (current && current !== event.target)
    current.classList.remove(selectedClassName);
  const color = event.target.dataset.color;
  event.target.classList.add(selectedClassName);
  if (selectedColorText != null) selectedColorText.innerHTML = color;
  chrome.storage.sync.set({ color });
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  chrome.scripting.executeScript({
    target: {
      tabId: tab.id,
    },
    func: setPageBackground,
  });
}

async function constructOptions(
  buttonColors = [
    "#000000",
    "#ff0000",
    "#ffff00",
    "#00ff00",
    "#00ffff",
    "#0000ff",
    "#ff00ff",
    "#ffffff",
  ]
) {
  chrome.storage.sync.get("color", (data) => {
    if (buttonery == null) return;
    const currentColor = data.color;
    for (const buttonColor of buttonColors) {
      const button = document.createElement("button");
      button.dataset.color = buttonColor;
      button.style.backgroundColor = buttonColor;
      if (buttonColor === currentColor) button.classList.add(selectedClassName);
      button.addEventListener("click", (e) => {
        onClick(e);
      });
      buttonery.appendChild(button);
    }
    const button = document.createElement("button");
    button.dataset.color = originalColor;
    button.innerHTML = "RESET";
    if (originalColor === currentColor) button.classList.add(selectedClassName);
    button.addEventListener("click", (e) => {
      onClick(e);
    });
    buttonery.appendChild(button);
    if (selectedColorText != null) selectedColorText.innerHTML = currentColor;
  });
}
