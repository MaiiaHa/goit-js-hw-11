import './css/styles.css';
//========
// import Notiflix from 'notiflix';
// import debounce from 'lodash.debounce';
import API from './js/fetchCountries';
//========
const DEBOUNCE_DELAY = 300;

const refs = {
  form: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.form.addEventListener('input', debounce(onSubmitForm, DEBOUNCE_DELAY));

function onSubmitForm(e) {
  e.preventDefault();

  const countryName = e.target.value.trim();
  if (!countryName) {
    deleteCountriesInfo();
    return;
  }
  // console.log(countryName); // counntry entered in field
  // API.fetchCountries(countryName); // передаємо назву країни з інпут на бекенд

  API.fetchCountries(countryName)
    .then(countries => {
      // console.log(countries); // massive of objects [{},{},{}]
      const countryList = countries.map(country => country.name.official);
      // console.log(countryList); // massive official names of countries [UA, UK, JU]

      if (countryList.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        ); // do not perform function fetchCountries
        return;
      } else if (countryList.length === 1) {
        createCountryCard(countries); // show card
      } else if (countryList.length >= 2 && countryList.length <= 10) {
        createCountryList(countries); // show list of countries
      }
    })
    .catch(error => {
      if (error.message === '404') {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      }
      // console.dir(error);
    });

  deleteCountriesInfo();
}

function createCountryCard(countries) {
  const markup = countries
    .map(
      countryItem => `
      <div class='card'>
        <div class='card-title'>
          <img class='card-img' src='${countryItem.flags.svg}' alt='${
        countryItem.name.official
      }' height="20px" width="40px" />
          <h2 class='card-country-name'>${countryItem.name.official}</h2>
        </div>
        <ul class='card-body'>
          <li class=''>
          <p><span class='card-description'>Capital:</span> ${
            countryItem.capital
          }</p>
          </li>
          <li class=''>
          <p><span class='card-description'>Population:</span> ${
            countryItem.population
          }</p>
                </li>
           <li class=''>
          <p><span class='card-description'>Languages:</span> ${Object.values(
            countryItem.languages
          ).join(', ')}</p>
            </li>
           </ul>
         </div>`
    )
    .join('');

  refs.countryInfo.insertAdjacentHTML('beforeend', markup);
}
function createCountryList(countries) {
  const markup = countries
    .map(
      countryItem => `
        <div class='card-title'>
          <img class='card-img' src='${countryItem.flags.svg}' alt='${countryItem.name.official}' height="20px" width="40px" />
          <h2 class='card-country-name'>${countryItem.name.official}</h2>
        </div>`
    )
    .join('');
  refs.countryList.insertAdjacentHTML('beforeend', markup);
}
function deleteCountriesInfo() {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
}
