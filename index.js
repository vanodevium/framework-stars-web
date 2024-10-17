const languages = {
  node: {
    name: "Node.js",
    link: "https://raw.githubusercontent.com/vanodevium/node-framework-stars/main/README.MD",
  },
  php: {
    name: "PHP",
    link: "https://raw.githubusercontent.com/vanodevium/php-framework-stars/main/README.MD",
  },
  golang: {
    name: "Golang",
    link: "https://raw.githubusercontent.com/vanodevium/go-framework-stars/main/README.MD",
  },
};

async function loadLanguageContent(url) {
  if (!url) return;
  fetch(url)
    .then((response) => response.text())
    .catch((err) => console.error(err))
    .then((text) => {
      try {
        const parsingOptions = { headerIds: false, mangle: false };
        const parsed = marked.parse(text, parsingOptions);
        renderReadmeContent(parsed);
      } catch (error) {
        renderReadmeContent(`<p>README parsing error =(</p>`);
      }
    });
}

function renderReadmeContent(html) {
  document.getElementById("readme_content").innerHTML = html;
}

function renderLanguagesList() {
  let html = "";
  Object.entries(languages).forEach((entry) => {
    const [key, data] = entry;
    html += `<li>
              <a
                href="#${key}"
                class="languages-list-button"
                data-language="${key}"
              >
                ${data.name}
              </a>
            </li>`;
  });
  document.getElementById("languages_list").innerHTML = html;
}

function addLanguagesListListeners() {
  getLanguageListButtons().forEach((btn) =>
    btn.addEventListener("click", (event) => {
      const { language } = event.target.dataset;
      if (!languages[language]) {
        console.error(`Key ${languages[language]} not found`);
      }
      loadLanguageContent(languages[language].link);
    }),
  );
}

function getLanguageListButtons() {
  return [...document.querySelectorAll(".languages-list-button")];
}

function getActiveLanguage() {
  return location.hash.slice(1);
}
function setActiveLanguageButton() {
  const activeClass = "languages-list-button--current";
  document.querySelector(`.${activeClass}`)?.classList?.remove(activeClass);

  const activeLanguage = getActiveLanguage();
  if (!languages[activeLanguage]) {
    const button = document.querySelector(".languages-list-button");
    button.classList.add(activeClass);
    location.hash = `#${button.dataset.language}`;
    return;
  }

  document
    .querySelector(`.languages-list-button[data-language="${activeLanguage}"]`)
    .classList.add(activeClass);
}

function initHashChangeHandling() {
  window.addEventListener("hashchange", hashChangeHandler, false);
}

function hashChangeHandler() {
  setActiveLanguageButton();
  loadLanguageContent(languages[getActiveLanguage()]?.link);
}

function initLanguagesList() {
  renderLanguagesList();
  initHashChangeHandling();
  addLanguagesListListeners();
}

initLanguagesList();
hashChangeHandler();
