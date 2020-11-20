(function(){

const state = {
  currentPage: 1,
  limit: 12,
  isFetching: false
};

const loader = document.querySelector('.loader');

//fetch users from api
const fetchItems = async (url, start, limit) => {
  const res = await fetch(`${url}?_start=${start}&_limit=${limit}`);
  const items = await res.json();
  return items;

};

//display or  hide loader based on isFetching
const setLoaderDisplay = isFetching => {
  loader.style.display = isFetching ? 'block' : 'none';
}

//initial data load
window.addEventListener('load', () => {
  state.isFetching = true;
  setLoaderDisplay(state.isFetching);
  fetchItems('https://jsonplaceholder.typicode.com/comments', (state.currentPage - 1)*state.limit, state.limit).then(res => {
    state.isFetching = false;
    setLoaderDisplay(state.isFetching);
    displayItems([...res]);
  });
})

//add new item to DOM
const displayItems = items => {
  const container = document.querySelector('.item-wrapper');
  items.forEach(item => {
    let newWrapper = document.createElement('div');
    newWrapper.className = 'item';
    let name = document.createElement('h1');
    name.innerText = item.name;
    newWrapper.appendChild(name);
    let body = document.createElement('p');
    body.innerText = item.body;
    newWrapper.appendChild(body);
    container.appendChild(newWrapper);
  });
}

//load more data when user scroll to the bottom
const handleLoadMore = () => {
  let lastPhoto = document.querySelector('.item-wrapper').lastElementChild;

  if(window.innerHeight + window.scrollY >= lastPhoto.offsetTop + lastPhoto.offsetHeight + 100){
    //last photo div is in view, get new photos
      state.isFetching = true;
      state.currentPage++;
      window.removeEventListener('scroll', handleLoadMore)
      setLoaderDisplay(state.isFetching);
      fetchItems('https://jsonplaceholder.typicode.com/comments', (state.currentPage - 1)*state.limit, state.limit).then(res => {
        displayItems([...res]);
        state.isFetching = false;
        setLoaderDisplay(state.isFetching);
        window.addEventListener('scroll',handleLoadMore);
      });
    
  }
}

window.addEventListener('scroll', handleLoadMore);
})();
