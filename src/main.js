import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.getElementById('search-form');
const loadMoreBtn = document.getElementById('load-more-btn');

let currentQuery = '';
let currentPage = 1;
let totalHits = 0;

function smoothScroll() {
  const galleryItem = document.querySelector('.gallery-item');
  if (!galleryItem) return;

  const cardHeight = galleryItem.getBoundingClientRect().height;
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function checkEndOfCollection() {
  const maxPages = Math.ceil(totalHits / 15);
  if (currentPage >= maxPages) {
    hideLoadMoreButton();
    iziToast.info({
      title: 'Info',
      message: "We're sorry, but you've reached the end of search results.",
      position: 'topRight',
    });
  }
}

async function searchImages(isNewSearch = true) {
  if (isNewSearch) {
    currentPage = 1;
    hideLoadMoreButton();
    clearGallery();
  }

  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    totalHits = data.totalHits;

    if (data.hits.length === 0 && currentPage === 1) {
      iziToast.error({
        title: 'Error',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      return;
    }

    createGallery(data.hits, isNewSearch);

    const hasMoreImages = currentPage * 15 < totalHits;
    if (data.hits.length > 0 && hasMoreImages) {
      showLoadMoreButton();
    } else if (currentPage * 15 >= totalHits) {
      checkEndOfCollection();
    }

    if (!isNewSearch) {
      smoothScroll();
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again later.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  const searchQuery = form.elements.searchQuery.value.trim();

  if (!searchQuery) {
    iziToast.warning({
      title: 'Warning',
      message: 'Please enter a search term',
      position: 'topRight',
    });
    return;
  }

  currentQuery = searchQuery;
  await searchImages(true);
  form.reset();
});

loadMoreBtn.addEventListener('click', async () => {
  currentPage++;
  await searchImages(false);
});
