const inputBox = document.getElementById("kanjiInput");
const clearBtn = document.getElementById("clearBtn");
const pasteBtn = document.getElementById("pasteBtn");
updateResultsFromUrl();

function lookupKanjiString(str) {
  const result = [];

  for (const char of str) {
    if (index[char]) {
      result.push({ kanji: char, ...index[char] });
    }
  }

  return result;
}

function displayKanjiResults(results, divId) {
  const container = document.getElementById(divId);
  container.innerHTML = "";

  results.forEach((entry) => {
    const line = document.createElement("div");
    line.classList.add("result");
    line.innerHTML = `
        <div class='row'>
          <a class='title' target='_blank' href='https://jisho.org/search/${entry.kanji}%20%23kanji'>${entry.kanji}</a>
          <div class='column'>
            <span class="num">${entry.id.toString().padStart(4, "0")}</span>
            <a class='keyword' target='_blank' href='https://wordnik.com/words/${entry.keyword}'>${entry.keyword}</a>
          </div>
        </div>
        <div class="components">${entry.components}</div>
      `;
    container.appendChild(line);
  });
}

function updateButtonVisibility(textInput) {
  const text = textInput || inputBox.value;
  if (text.length > 0) {
    clearBtn.classList.add("visible");
    pasteBtn.classList.add("hidden");
  } else {
    clearBtn.classList.remove("visible");
    pasteBtn.classList.remove("hidden");
  }
}

function updateResultsFromUrl() {
  inputBox.value = new URLSearchParams(window.location.search).get("t") || '';
  updateResults(inputBox.value);
}

function updateResults(text, updateUrl) {
  const lookupResult = lookupKanjiString(text);
  displayKanjiResults(lookupResult, "kanjiOutput");
  updateButtonVisibility(text);

  if (!updateUrl) return;

  const url = new URL(window.location);
  if (text != null && text.trim() !== "") {
    url.searchParams.set("t", text);
  } else {
    url.searchParams.delete("t");
  }
  window.history.pushState({}, "", url);
}

window.addEventListener("popstate", (event) => {
  updateResultsFromUrl();
});

inputBox.addEventListener("input", (event) => {
  const text = event.target.value;
  updateResults(text, true);
});

inputBox.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    inputBox.blur();
  }
});

clearBtn.addEventListener("click", () => {
  inputBox.value = "";
  displayKanjiResults([], "kanjiOutput");
  updateButtonVisibility("");
  inputBox.focus();
});

pasteBtn.addEventListener("click", async () => {
  try {
    const text = await navigator.clipboard.readText();
    inputBox.value = text;
    inputBox.dispatchEvent(new Event("input"));
  } catch (err) {
  }
});

window.addEventListener("DOMContentLoaded", updateButtonVisibility);
