import { apiUrl } from "./properties.mjs";

const container = document.querySelector(".container");
const searchInput = container.querySelector("input");
const volume = container.querySelector(".word i");
const infoText = container.querySelector(".info-text");
const synonyms = container.querySelector(".synonyms .list");
const removeIcon = container.querySelector(".search span");
let audio;

searchInput.addEventListener("keyup", (e) => {
  let word = e.target.value;
  if (e.key == "Enter" && word) {
    fetchApi(word);
  }
});

async function fetchApi(word) {
  container.classList.remove("active");
  infoText.style.color = "black";
  infoText.innerHTML = `Searching the meaning of <span>"${word}"</span>`;
  // link to get this api: https://dictionatyapi.dev/
  let fullUrl = apiUrl + word;

  try {
    fetch(fullUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.title) {
          infoText.innerHTML = `Unable to find the meaning of the world <span>"${word}"</span>. Please, search for another word.`;
        } else {
          container.classList.add("active");
          let definitions = data[0].meanings[0].definitions[0];
          let phonetics = `${data[0].meanings[0].partOfSpeech}  /${data[0].phonetics[0].text}/`;

          document.querySelector(
            ".word p"
          ).innerText = `Word : ${data[0].word}`;
          document.querySelector(".word span").innerText = phonetics;
          document.querySelector(".meaning span").innerText =
            definitions.definition;
          document.querySelector(
            ".source span"
          ).innerHTML = `<a href="${data[0].sourceUrls[0]}" target="_blank">${data[0].sourceUrls[0]}</a>`;
          audio = new Audio(data[0].phonetics[0].audio);
          if (data[0].meanings[0].synonyms[0] === undefined) {
            synonyms.innerHTML = "NA";
          } else {
            synonyms.innerHTML = "";
            for (let i = 0; i < 5; i++) {
              let tag = `<span>${data[0].meanings[0].synonyms[i]},</span>`;
              synonyms.insertAdjacentHTML("beforeend", tag);
            }
          }
        }
      });
  } catch {
    infoText.innerHTML = `Unable to find the meaning of the world <span>"${word}"</span>. Please, search for another word.`;
  }
}

volume.addEventListener("click", () => {
  volume.style.color = "red";
  audio.play();
  setTimeout(() => {
    volume.style.color = "gray";
  }, 800);
});

removeIcon.addEventListener("click", () => {
  searchInput.value = "";
  searchInput.focus();
  container.classList.remove("active");
  infoText.style.color = "black";
  infoText.innerHTML = "Type a word & click 'ENTER' to get the results.";
});
