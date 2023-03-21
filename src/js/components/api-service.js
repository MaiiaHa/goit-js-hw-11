export default class ApiService {
  constructor() {
    this.searchInput = '';
    this.page = 1;
  }

  fetchInput() {
    console.log(this);
    const options = {
      key: '34588497-3719c03793052fb5df7f8aa6e',
      q: this.searchInput,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 5,
    };
    const BASE_URL = 'https://pixabay.com/api/';

    return fetch(
      `${BASE_URL}?key=${options.key}&q=${this.searchInput}&image_type=${options.image_type}&orientation=${options.orientation}&page=${this.page}&per_page=${options.per_page}`
    )
      .then(responce => {
        // if (!responce.ok) {
        //   throw new Error(responce.status);
        // }
        return responce.json();
        // console.log(responce.json());
      })
      .then(data => {
        this.incrementPage();
        return data.hits;
      })
      .catch(error => {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      });
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get input() {
    return this.searchInput;
  }

  set input(NewInput) {
    this.searchInput = NewInput;
  }
}
// if (!searchInput) {
//   // deleteSearchInput();
//   return;
// }
