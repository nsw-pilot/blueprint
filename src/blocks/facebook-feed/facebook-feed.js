import 'nsw-design-system/src/components/card/_card.scss';
import { fetchPlaceholders } from '../../scripts/aem.js';
import './facebook-feed.scss';

const FB_PLACEHOLDER_KEY = 'facebookapi';
const LOCAL_DUMMY_JSON = '/src/blocks/facebook-feed/fbApi.json';

// The API temporarily requires a bearer token to access the Facebook API.
// In the future, it will require no authentication
const FB_HEADERS = {
  headers: {
    Authorization: 'Bearer ZmFjZWJvb2stc3dzLWF1dGhvcml6ZXItc3dzLWNsb3VkOktlbm5ldGhTV1M=',
    'Content-Type': 'application/json',
  },
};

async function getFacebookApiPath() {
  const isLocalhost = window.location.hostname === 'localhost';

  try {
    const response = await fetchPlaceholders();

    if (isLocalhost && (!response || !response[FB_PLACEHOLDER_KEY])) {
      return LOCAL_DUMMY_JSON;
    }

    return response[FB_PLACEHOLDER_KEY];
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching placeholders:', error);
    return undefined;
  }
}

async function fetchFacebookPosts() {
  return new Promise((resolve) => {
    // Resolve immediately with null to prevent blocking
    resolve(null);
    
    // Start the fetch process asynchronously
    (async () => {
      const fbApi = await getFacebookApiPath();
      
      if (!fbApi) {
        return;
      }
      
      try {
        const fbResponse = await fetch(fbApi, {
          method: 'GET',
          ...FB_HEADERS,
        });
        
        if (!fbResponse.ok) {
          throw new Error(`Facebook API request failed: ${fbResponse.statusText}`);
        }
        
        const fbPosts = await fbResponse.json();
        
        if (!fbPosts || !fbPosts.length || !fbPosts[0].posts) {
          throw new Error('No Facebook posts found');
        }
        
        const posts = JSON.parse(fbPosts[0].posts);
        
        const top3PostsWithImage = [];
        for (let i = 0; i < posts.length; i += 1) {
          const item = posts[i];
          if (item.full_picture && item.message) {
            top3PostsWithImage.push(item);
            if (top3PostsWithImage.length === 3) break;
          }
        }
        
        // Update the UI with the fetched posts
        updateFacebookFeed(top3PostsWithImage);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching Facebook API:', error);
      }
    })();
  });
}

// New function to update the Facebook feed with posts
function updateFacebookFeed(posts) {
  if (!posts || !posts.length) return;
  
  const block = document.querySelector('.facebook-feed');
  if (!block) return;
  
  const fbPostsEl = posts.map((post) => `<div class = 'nsw-col nsw-col-md-6 nsw-col-lg-4'>
      <div class = 'nsw-card nsw-card--highlight'>
        <div class="nsw-card__image">
        <img src="${post.full_picture}" alt="Facebook post image">
        </div>
        <div class="nsw-card__content">
          <div class="nsw-card__copy">
            <p>
              <a href='https://www.facebook.com/${post.id}'>${post.message}</a>
            </p>
          </div>
          <div class='card-icon'>
            <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fill="#1578f2" d="M32 16.098C32 7.207 24.837 0 16 0S0 7.207 0 16.098C0 24.133 5.851 30.793 13.5 32V20.751H9.437v-4.653H13.5v-3.547c0-4.035 2.389-6.263 6.043-6.263 1.751 0 3.582.314 3.582.314v3.962h-2.018c-1.988 0-2.607 1.241-2.607 2.514v3.02h4.438l-.709 4.653h-3.728V32c7.649-1.208 13.5-7.867 13.5-15.902z"/></svg>
          </div>
          <span class="material-icons nsw-material-icons" focusable="false" aria-hidden="true">east</span>
        </div>
      </div>
    </div>`);
  
  const nswGrid = document.createElement('div');
  nswGrid.classList.add('nsw-grid');
  nswGrid.innerHTML = fbPostsEl.join('');
  
  // Clear and update the block
  block.textContent = '';
  block.append(nswGrid);
}

export default async function decorate(block) {
  // Add a class to the block for easy identification
  block.classList.add('facebook-feed');
  
  // Create a loading state or placeholder
  const loadingEl = document.createElement('div');
  loadingEl.classList.add('nsw-grid');
  loadingEl.innerHTML = `<div class="nsw-col nsw-col-md-12">
    <p>Loading Facebook posts...</p>
  </div>`;
  
  block.textContent = '';
  block.append(loadingEl);
  
  // Fetch posts asynchronously (this will return immediately)
  await fetchFacebookPosts();
}
