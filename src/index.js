// =========================== work 1var ==========================================
// import './css/styles.css';
// //========
// import Notiflix from 'notiflix'; // all modules
// import SimpleLightbox from 'simplelightbox'; // Описаний в документації
// import 'simplelightbox/dist/simple-lightbox.min.css'; // Додатковий імпорт стилів
// import InputApiService from './js/components/api-service';
// //========

// const refs = {
//   form: document.querySelector('#search-form'),
//   gallery: document.querySelector('.gallery'),
//   btnLoadMore: document.querySelector('.load-more'),
//   // btnSearch: document.querySelector('type=[submit]'),
// };

// const inputApiService = new InputApiService();

// refs.form.addEventListener('submit', onSubmitForm);
// refs.btnLoadMore.addEventListener('click', onLoadMorePictures);

// refs.btnLoadMore.style.display = 'none';

// function onSubmitForm(e) {
//   e.preventDefault();

//   inputApiService.input = e.currentTarget.elements.searchQuery.value
//     .split(' ')
//     .join('+'); // string 'word+word' format

//   if (inputApiService.input === '') {
//     return Notiflix.Notify.info(
//       'Sorry, there are no images matching your search query. Please try again.'
//     ); // when input will be zero
//   }

//   refs.btnLoadMore.style.display = '';

//   inputApiService.resetPage();
//   inputApiService.fetchInput().then(hits => {
//     deleteCardContainer();
//     createGalleryCard(hits);
//   });
// }

// function onLoadMorePictures() {
//   inputApiService.fetchInput().then(createGalleryCard);
// }

// function createGalleryCard(hits) {
//   const markup = hits
//     .map(
//       hit => `
//       <div class="photo-card">
//         <img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" />
//         <div class="info">
//           <p class="info-item">${hit.likes}
//           <b>Likes</b>
//           </p>
//           <p class="info-item">${hit.views}
//           <b>Views</b>
//           </p>
//           <p class="info-item">${hit.comments}
//           <b>Comments</b>
//           </p>
//           <p class="info-item">${hit.downloads}
//           <b>Downloads</b>
//           </p>
//         </div>
//       </div>`
//     )
//     .join('');

//   refs.gallery.insertAdjacentHTML('beforeend', markup);
// }
// function deleteCardContainer() {
//   refs.gallery.innerHTML = '';
// }
// //=================
// function messageContainer(totalHits) {
//   inputApiService.fetchInput().then(console.log(totalHits));
// }
// ========================= work 1var ===========================

import './css/styles.css';
//========
import Notiflix from 'notiflix'; // all modules
// Описаний в документації
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';
import API from './js/components/api-service';
//========

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('.load-more'),
};

const lightbox = new SimpleLightbox('.gallery a', {
  animationSlide: false,
  captionsData: 'alt',
  captionDelay: '250ms',
});

refs.form.addEventListener('submit', onSubmitForm);
refs.btnLoadMore.addEventListener('click', onLoadMorePictures);

const itemPerPage = 40;
let currentPage = null;

refs.btnLoadMore.style.display = 'none';

async function onSubmitForm(e) {
  e.preventDefault();
  deleteCardContainer();

  currentPage = 1;
  refs.btnLoadMore.style.display = 'none';

  const searchInput = e.currentTarget.elements.searchQuery.value
    .split(' ')
    .join('+'); // string 'word+word' format
  // console.log(searchInput); // введені дані користувачем

  if (!searchInput) {
    return Notiflix.Notify.info(
      'There are too much images matching your search query. Please try again.'
    ); // when input will be zero
  }

  try {
    const responce = await API.fetchInput(
      searchInput,
      currentPage,
      itemPerPage
    );
    const totalHits = responce.data.totalHits;
    const cardsData = responce.data.hits;
    console.log(cardsData); //massive of objects [{},{},{}]
    console.log('~ totalHits:', totalHits);

    if (totalHits === 0) {
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else if (totalHits <= itemPerPage) {
      Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
      refs.form.reset(); // закоментовано оскільки інпут використовується для лоадмор завантаження
      refs.btnLoadMore.style.display = 'none';
    } else {
      Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
    }

    // refs.form.reset(); // закоментовано оскільки інпут використовується для лоадмор завантаження

    createGalleryCard(cardsData);
    refs.btnLoadMore.style.display = '';

    // console.log(responce.data); // {total: 19417, totalHits: 500, hits: Array(40)}
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    console.error(error);
  }
}

async function onLoadMorePictures() {
  searchInput = refs.form.searchQuery.value;
  currentPage += 1;

  try {
    const responce = await API.fetchInput(
      searchInput,
      currentPage,
      itemPerPage
    );
    const totalHits = responce.data.totalHits;
    const cardsData = responce.data.hits;
    console.log(cardsData); //massive of objects [{},{},{}]
    // console.log(searchInput);

    createGalleryCard(cardsData);
    refs.btnLoadMore.style.display = '';

    if (Math.ceil(totalHits / itemPerPage) < currentPage) {
      return Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }

    // console.log(responce.data); // {total: 19417, totalHits: 500, hits: Array(40)}
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    console.error(error);
  }
}

async function createGalleryCard(hits) {
  const markup = await hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
      <div class="photo-card">
       <a href="${largeImageURL}">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
       </a> 
        <div class="info">
          <p class="info-item">${likes}
          <b>Likes</b>
          </p>
          <p class="info-item">${views}
          <b>Views</b>
          </p>
          <p class="info-item">${comments}
          <b>Comments</b>
          </p>
          <p class="info-item">${downloads}
          <b>Downloads</b>
          </p>
        </div>
      </div>`
    )
    .join('');

  refs.gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}
function deleteCardContainer() {
  refs.gallery.innerHTML = '';
}
//Прокручування сторінки
//Зробити плавне прокручування сторінки після запиту і відтворення кожної наступної групи зображень. Ось тобі код-підказка, але розберися у ньому самостійно.

// function lightScroll() {
//   const { height: cardHeight } =
//     refs.gallery.firstElementChild.getBoundingClientRect();

//   window.scrollBy({
//     top: cardHeight * 2,
//     behavior: 'smooth',
//   });
// }

// плавний скрол
window.addEventListener('scroll', () => {
  const documentRect = document.documentElement.getBoundingClientRect();
  // console.log('top', documentRect.top);
  // console.log('bottom', documentRect.bottom);
  if (documentRect.bottom < document.documentElement.clientHeight + 1) {
    // console.log('done');
    // currentPage += 1;
    refs.btnLoadMore.style.display = 'none';
    onLoadMorePictures();
  }
});
