import './css/styles.css';
//========
import Notiflix from 'notiflix'; // all modules
import SimpleLightbox from 'simplelightbox'; // Описаний в документації
import 'simplelightbox/dist/simple-lightbox.min.css'; // Додатковий імпорт стилів
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

refs.btnLoadMore.style.display = 'none';

function onSubmitForm(e) {
  e.preventDefault();

  inputApiService.input = e.currentTarget.elements.searchQuery.value
    .split(' ')
    .join('+'); // string 'word+word' format

  if (inputApiService.input === '') {
    Notiflix.Notify.info(
      'Sorry, there are no images matching your search query. Please try again.'
    ); // when input will be zero
    return;
  }

  refs.btnLoadMore.style.display = '';

  inputApiService.resetPage();
  inputApiService.fetchInput().then(hits => {
    deleteCardContainer();
    createGalleryCard(hits);
  });
}

function onLoadMorePictures() {
  inputApiService.fetchInput().then(createGalleryCard);
}

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
