// =========================== work 1var ==========================================
// import Notiflix from 'notiflix';

// const API_KEY = '34588497-3719c03793052fb5df7f8aa6e';
// const BASE_URL = 'https://pixabay.com/api/';

// const options = {
//   key: API_KEY,
//   image_type: 'photo',
//   orientation: 'horizontal',
//   safesearch: true,
//   per_page: 40,
// };

// export default class ApiService {
//   constructor() {
//     this.searchInput = '';
//     this.page = 1;
//   }

//   fetchInput() {
//     console.log(this);

//     // works:
//     return fetch(
//       `${BASE_URL}?key=${API_KEY}&q=${this.searchInput}&image_type=${options.image_type}&orientation=${options.orientation}&page=${this.page}&per_page=${options.per_page}`
//     )
//       .then(responce => {
//         // if (!responce.ok) {
//         //   throw new Error(responce.status);
//         // }
//         return responce.json();
//       })
//       .then(({ hits }) => {
//         this.incrementPage();
//         return hits;
//       })
//       .catch(error => {
//         return Notiflix.Notify.failure(
//           'Sorry, there are no images matching your search query. Please try again.'
//         );
//       });
//   }

//   incrementPage() {
//     this.page += 1;
//   }

//   resetPage() {
//     this.page = 1;
//   }

//   get input() {
//     return this.searchInput;
//   }

//   set input(NewInput) {
//     this.searchInput = NewInput;
//   }
// }
// =========================== work 1var ==========================================

import axios from 'axios';

const KEY = '34588497-3719c03793052fb5df7f8aa6e';
const URL = 'https://pixabay.com/api/';

async function fetchInput(searchInput, currentPage, itemPerPage) {
  const options = {
    params: {
      q: searchInput,
      page: currentPage,
      key: KEY,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: itemPerPage,
    },
  };
  try {
    const response = await axios.get(URL, options);
    // console.log(response); //{data: {…}, status: 200, statusText: '', headers: AxiosHeaders, config: {…}, …}
    return response;
  } catch (error) {
    console.error(error.message);
  }
}

export default { fetchInput };
