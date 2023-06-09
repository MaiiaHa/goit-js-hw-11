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
import Notiflix from 'notiflix'; // all modules
// Описаний в документації
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';
import API from './js/components/api-service';
//=======================================

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  sentinel: document.querySelector('#sentinel'),
  // btnLoadMore: document.querySelector('.load-more'),
};
//=======================================
const lightbox = new SimpleLightbox('.gallery a', {
  animationSlide: false,
  captionsData: 'alt',
  captionDelay: '250ms',
});

refs.form.addEventListener('submit', onSubmitForm);
// refs.btnLoadMore.addEventListener('click', onLoadMorePictures);

const itemPerPage = 40;
let currentPage = null;
let totalHits = null;
let searchInput = '';

// refs.btnLoadMore.style.display = 'none';

async function onSubmitForm(e) {
  e.preventDefault();
  deleteCardContainer();
  refs.sentinel.style.display = 'none'; // перешкоджає повторному запиту на АРІ

  currentPage = 1;
  // refs.btnLoadMore.style.display = 'none';

  searchInput = e.currentTarget.elements.searchQuery.value
    .trim()
    .split(' ')
    .join('+'); // string 'word+word' format
  // console.log(searchInput); // введені дані користувачем

  if (searchInput === '') {
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

    totalHits = responce.data.totalHits;
    const cardsData = responce.data.hits;
    // console.log(cardsData); //massive of objects [{},{},{}]
    // console.log('~ totalHits:', totalHits);

    if (totalHits === 0) {
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
    }

    if (cardsData.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    refs.form.reset(); // закоментовано оскільки інпут використовується для лоадмор завантаження

    createGalleryCard(cardsData);
    // refs.btnLoadMore.style.display = '';
    refs.sentinel.style.display = 'block'; // перешкоджає повторному запиту на АРІ
    // observer.observe(refs.sentinel);
    // console.log(responce.data); // {total: 19417, totalHits: 500, hits: Array(40)}
  } catch (error) {
    Notiflix.Notify.failure('Sorry, somethig was wrong. Please try again.');
    console.error(error);
  }
}

async function onLoadMorePictures() {
  // if (currentPage){ observer.unobserve(refs.sentinel)}

  currentPage += 1;

  if (Math.ceil(totalHits / itemPerPage) < currentPage) {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
    return;
  }

  try {
    const responce = await API.fetchInput(
      searchInput,
      currentPage,
      itemPerPage
    );
    const cardsData = responce.data.hits;
    // console.log(cardsData); //massive of objects [{},{},{}]

    // refs.btnLoadMore.style.display = '';
    // observer.observe(refs.sentinel);

    createGalleryCard(cardsData);
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
//===============Прокручування сторінки==================
//Зробити плавне прокручування сторінки після запиту і відтворення кожної наступної групи зображень. Ось тобі код-підказка, але розберися у ньому самостійно.
// https://www.youtube.com/watch?v=B0vwmjOznEI&t=510s
// function lightScroll() {
//   const { height: cardHeight } =
//     refs.gallery.firstElementChild.getBoundingClientRect();

//   window.scrollBy({
//     top: cardHeight * 2,
//     behavior: 'smooth',
//   });
// }
//=============== intersection observer ================
const onEntry = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && searchInput !== '') {
      // console.log('пора грузить ФОТКИ');
      // if (currentPage ===1){return;} else{.... onLoadAdditionalFetch}
      onLoadMorePictures();
    }
  });
};
const options = {
  rootMargin: '500px',
  // threshold: 0,
};
const observer = new IntersectionObserver(onEntry, options);
observer.observe(refs.sentinel);

//======================= btn up =======================
const string = '<div id="triangle" class="btn-up btn-up_hide"></div>';

refs.gallery.insertAdjacentHTML('afterend', string);

const btnUp = {
  el: document.querySelector('.btn-up'),
  show() {
    this.el.classList.remove('btn-up_hide');
  },
  hide() {
    this.el.classList.add('btn-up_hide');
  },
  addEventListener() {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      scrollY > 400 ? this.show() : this.hide();
    });
    document.querySelector('.btn-up').onclick = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    };
  },
};

btnUp.addEventListener();
