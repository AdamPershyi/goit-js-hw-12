import axios from 'axios';

const API_KEY = '55713445-fbda8ed7255a2117e2c0a47fe';

export async function getImagesByQuery(query, page = 1) {
  console.log('🟣 Запит до API:', { query, page });

  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page, 
        per_page: 15,
      },
    });

    console.log('🟣 Відповідь API:', response.data);
    return response.data;
  } catch (error) {
    console.error('Помилка API:', error);
    throw error;
  }
}
