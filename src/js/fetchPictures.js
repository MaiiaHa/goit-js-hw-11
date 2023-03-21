const options = {
  key: '34588497-3719c03793052fb5df7f8aa6e',
  q: 'cat',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  page: 1,
  per_page: 5,
};
const BASE_URL = 'https://pixabay.com/api/';

function fetchPictures(picture) {
  return fetch(
    `${BASE_URL}?key=${options.key}&q=${options.q}&image_type=${options.image_type}&orientation=${options.orientation}&page=${options.page}&per_page=${options.per_page}`
  ).then(responce => {
    if (!responce.ok) {
      throw new Error(responce.status);
    }
    return responce.json();
    // console.log(responce.json());
  });
  // .then(countries => {
  //   console.log(countries);
  // })
  // .catch(error => {
  //   console.log(error);
  // });
}

export default { fetchPictures };
