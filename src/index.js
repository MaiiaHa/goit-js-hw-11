import './css/styles.css';
//========
// import Notiflix from 'notiflix'; // all modules
import { Notify } from 'notiflix/build/notiflix-notify-aio'; // one by one
import SimpleLightbox from 'simplelightbox'; // Описаний в документації
import 'simplelightbox/dist/simple-lightbox.min.css'; // Додатковий імпорт стилів
import axios from 'axios';
import InputApiService from './js/components/api-service';
//========

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('.load-more'),
  // btnSearch: document.querySelector('type=[submit]'),
};

const inputApiService = new InputApiService();

refs.form.addEventListener('submit', onSubmitForm);
refs.btnLoadMore.addEventListener('click', onLoadMorePictures);

// let searchInput = '';

function onSubmitForm(e) {
  e.preventDefault();

  inputApiService.input = e.currentTarget.elements.searchQuery.value
    .split(' ')
    .join('+'); // string 'word+word' format
  inputApiService.resetPage();
  inputApiService.fetchInput().then(hits => {
    deleteCardContainer();
    createGalleryCard(hits);
  });
  // console.log(searchInput); // counntry entered in field
  // API.fetchPictures(searchInput); // передаємо назву країни з інпут на бекенд
}

function onLoadMorePictures() {
  inputApiService.fetchInput().then(createGalleryCard);
}

/* then(hits => console.log(hits))

webformatURL; 
largeImageURL;
tags; for alt 
  likes
  views - кількість переглядів.
comments - кількість коментарів.
downloads -
*/

//   API.fetchPictures(searchInput)
//     .then(countries => {
//       // console.log(countries); // massive of objects [{},{},{}]
//       const countryList = countries.map(country => country.name.official);
//       // console.log(countryList); // massive official names of countries [UA, UK, JU]

//       if (countryList.length > 10) {
//         Notiflix.Notify.info(
//           'Sorry, there are no images matching your search query. Please try again.'
//         ); // do not perform function fetchCountries
//         return;
//       } else if (countryList.length === 1) {
//         createCountryCard(countries); // show card
//       } else if (countryList.length >= 2 && countryList.length <= 10) {
//         createCountryList(countries); // show list of countries
//       }
//     })
//     .catch(error => {
//       if (error.message === '404') {
//         Notiflix.Notify.failure('Oops, there is no country with that name');
//       }
//       // console.dir(error);
//     });

//   // deleteSearchInput();
// }

function createGalleryCard(hits) {
  const markup = hits
    .map(
      hit => `
      <div class="photo-card">
        <img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" />
        <div class="info">
          <p class="info-item">${hit.likes}
          <b>Likes</b>
          </p>
          <p class="info-item">${hit.views}
          <b>Views</b>
          </p>
          <p class="info-item">${hit.comments}
          <b>Comments</b>
          </p>
          <p class="info-item">${hit.downloads}
          <b>Downloads</b>
          </p>
        </div>
      </div>`
    )
    .join('');

  refs.gallery.insertAdjacentHTML('beforeend', markup);
}
function deleteCardContainer() {
  refs.gallery.innerHTML = '';
}

// function createCountryList(countries) {
//   const markup = countries
//     .map(
//       countryItem => `
//         <div class='card-title'>
//           <img class='card-img' src='${countryItem.flags.svg}' alt='${countryItem.name.official}' height="20px" width="40px" />
//           <h2 class='card-country-name'>${countryItem.name.official}</h2>
//         </div>`
//     )
//     .join('');
//   refs.countryList.insertAdjacentHTML('beforeend', markup);
// }
