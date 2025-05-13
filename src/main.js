const dialog = document.getElementById('popup-dialog')
const characterTitle = document.getElementById('character-title')
const dialogContent = document.getElementById('dialog-content')
const closeDialogButton = document.getElementById('close-dialog')

// Getting the search input
const searchInput = document.getElementById('search-input')

// Adding an event listener that listens to whenever the user types something into the search bar
searchInput.addEventListener('input', function (e) {
  // Get the value of the input
  const input = e.target.value
  console.log(input)
  // searchForCharacter(input)
  debouncedCharacterSearch(input)
})

const results = document.getElementById('results')

function debounce (func, wait) {
  let timeout

  return function (...args) {
    const context = this

    clearTimeout(timeout)

    timeout = setTimeout(() => {
      func.apply(context, args)
    }, wait)
  }
}

document.addEventListener('DOMContentLoaded', function () {
  fetch(`https://swapi.py4e.com/api/people`)
    .then(resp => resp.json())
    .then(data => {
      console.log(data)
      displayCharacters(data.results)

      // const listOfCharacterNames = data.results.map(character => {
      //   return `<li>${character.name}</li>`
      // })
      // const characterNamesString = listOfCharacterNames.join(' ')
      // results.innerHTML = `<ul class="characters">${characterNamesString}</ul>`
    })
    .catch(e => {
      console.log(e)
      results.innerText = 'The characters you seek are not here'
    })
})

async function searchForCharacter (query) {
  const characterData = await fetch(
    `https://swapi.py4e.com/api/people?search=${query}`
  ).then(resp => resp.json())

  console.log(characterData)
  displayCharacters(characterData.results)
}

const debouncedCharacterSearch = debounce(searchForCharacter, 500)

function displayCharacters (characters) {
  // const listOfCharacterNames = characters
  //   .map(character => {
  //     return `<li>${character.name}</li>`
  //   })
  //   .join(' ')

  const listOfNames = characters
    .map(character => {
      return `<li><a data-url="${character.url}">${character.name}</a></li>`
    })
    .join(' ')

  results.innerHTML = `<ul class="characters">${listOfNames}</ul>`

  // Get all the characters in the Characters list (as created above)
  const links = document.querySelectorAll('.characters a')
  // For each link, lets add an event listener that listens for the click event.
  links.forEach(link => {
    link.addEventListener('click', () => {
      const characterUrl = link.getAttribute('data-url')
      // console.log(characterUrl)
      openCharacterDialog(characterUrl);
    })
  })
}

function openCharacterDialog (characterApiUrl) {
  // Open the dialog
  dialog.showModal()

  fetch(characterApiUrl)
    .then(resp => resp.json())
    .then(data => {
      characterTitle.innerText = data.name
      dialogContent.innerHTML = `
        <p><strong>Height:</strong> ${data.height}</p>
        <p><strong>Mass:</strong> ${data.mass}</p>
        <p><strong>Gender:</strong> ${data.gender}</p>
      `
    })
    .catch(err => {
      console.log(err)
      // If the fetch fails overall, then we will display this message
      dialogContent.innerHTML = 'Failed to load data.'
    })
}

// Close the dialog when clicking outside of it
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) {
    dialog.close();
  }
});

//When the dialog closes, we reset it back to it's original state
dialog.addEventListener("close", () => {
  characterTitle.innerText = "";
  dialogContent.innerHTML = "Loading...";
})

// Close the dialog when the close button is clicked within the dialog element
closeDialogButton.addEventListener('click', () => {
  dialog.close();
});

