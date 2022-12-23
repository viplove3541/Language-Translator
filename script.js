const fromText = document.querySelector('.from-text'),
  toText = document.querySelector('.to-text'),
  exchageIcon = document.querySelector('.exchange'),
  selectTag = document.querySelectorAll('select'),
  icons = document.querySelectorAll('.row i');
translateBtn = document.querySelector('button');

selectTag.forEach((tag, id) => {
  for (const country_code in countries) {
    //Selecting english by default from ENGLISH to Hindi.
    let selected;
    if (id == 0 && country_code == 'en-GB') {
      selected = 'selected';
    } else if (id == 1 && country_code == 'hi-IN') {
      selected = 'selected';
    }
    let option = `<option value="${country_code}" ${selected}>${countries[country_code]}</option>`;
    tag.insertAdjacentHTML('beforeend', option); //adding option tag inside select tag.
  }
});

//exchanging textarea and select tag value
exchageIcon.addEventListener('click', () => {
  let tempText = fromText.value,
    tempLang = selectTag[0].value;
  fromText.value = toText.value;
  toText.value = tempText;
  selectTag[0].value = selectTag[1].value;
  selectTag[1].value = tempLang;
});

fromText.addEventListener('keyup', () => {
  if (!fromText.value) {
    toText.value = '';
  }
});

translateBtn.addEventListener('click', () => {
  let text = fromText.value.trim(),
    translateFrom = selectTag[0].value, //getting fromSelect tag value.
    translateTo = selectTag[1].value; //getting toSelect tag value.
  if (!text) return;
  toText.setAttribute('placeholder', 'Translating...');
  let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
  //fetching Api response nd returning it with parsing into js object.
  //nd in other then method receiving that object.
  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      toText.value = data.responseData.translatedText;
      data.matches.forEach((data) => {
        if (data.id === 0) {
          toText.value = data.translation;
        }
      });
      toText.setAttribute('placeholder', 'Translation');
    });
});

icons.forEach((icon) => {
  icon.addEventListener('click', ({ target }) => {
    if (!fromText.value || !toText.value) return;
    if (target.classList.contains('fa-copy')) {
      //if clicked icon has from id, copy the fromTextarea value else copy toTextarea value.
      if (target.id == 'from') {
        navigator.clipboard.writeText(fromText.value);
      } else {
        navigator.clipboard.writeText(toText.value);
      }
    } else {
      let utterance;
      //if clicked icon has from id, speak the fromTextarea value else speak toTextarea value.
      if (target.id == 'from') {
        utterance = new SpeechSynthesisUtterance(fromText.value);
        utterance.lang = selectTag[0].value; //setting utterance lang to fromSelect tag value.
      } else {
        utterance = new SpeechSynthesisUtterance(toText.value);
        utterance.lang = selectTag[1].value; //setting utterance lang to toSelect tag value.
      }
      speechSynthesis.speak(utterance); //speak the passed utterance.
    }
  });
});
