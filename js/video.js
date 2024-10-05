const loadCategories = () => {
  fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    .then((res) => res.json())
    .then((data) => displayCategories(data.categories))
    .catch((err) => console.log(err));
};

const loadVideos = (searchText = "") => {
  fetch(
    `https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`
  )
    .then((res) => res.json())
    .then((data) => displayVideos(data.videos))
    .catch((err) => console.log(err));
};

const getTime = (time) => {
  const hour = parseInt(time / 3600);
  let remainingSecond = time % 3600;
  const min = parseInt(remainingSecond / 60);
  remainingSecond = remainingSecond % 60;
  return `${hour} hour ${min} minute ${remainingSecond} second`;
};

const loadDetails = async (videoID) => {
  const res = await fetch(
    `https://openapi.programming-hero.com/api/phero-tube/video/${videoID}`
  );
  const data = await res.json();
  displayDetails(data.video);
};

const displayDetails = (video) => {
  const modalContainer = document.getElementById("modal-container");
  modalContainer.innerHTML = `
  <img class="w-full" src="${video.thumbnail}"/>
  <h2 class="font-bold text-xl text-center py-2">${video.title}</h2>
  <p>${video.description}</p>
  `;
  document.getElementById("my-modal").showModal();
};

const displayVideos = (videos) => {
  const videoContainer = document.getElementById("video-container");
  videoContainer.innerHTML = "";
  if (videos.length == 0) {
    videoContainer.classList.remove("grid");
    videoContainer.innerHTML = `
    <div class="h-64 mt-28 flex flex-col justify-center items-center gap-5">
      <img class="h-full" src="./assets/Icon.png" />
      <h2 class="text-xl font-bold">No Content here</h2>
    </div>
    `;
  } else {
    videoContainer.classList.add("grid");
  }
  videos.forEach((items) => {
    console.log(items);
    const card = document.createElement("div");
    card.innerHTML = `
        <figure class="h-60 relative">
          <img
            class="w-full h-full rounded-lg object-cover"
            src=${items.thumbnail}
            alt="Shoes"
          />
          ${
            items.others.posted_date.length == 0
              ? ""
              : `<span class="absolute right-2 bottom-2 text-white text-xs bg-black p-1 rounded-md">
                ${getTime(items.others.posted_date)}
              </span>`
          }
          
        </figure>
        <div class="flex items-center gap-3 p-4">
           <div>
              <img class="w-10 h-10 rounded-full object-cover" src=${
                items.authors[0].profile_picture
              }/>  
           </div>
           <div>
              <h1 class="font-bold">${items.title}</h1>
              <div class="flex gap-3">
                 <p class="text-gray-400">${items.authors[0].profile_name}</p>
                 ${
                   items.authors[0].verified === true
                     ? '<img class="w-5 object-cover" src="https://img.icons8.com/?size=48&id=D9RtvkuOe31p&format=png"/>'
                     : ""
                 }
              </div>
              <p class="text-gray-400">${items.others.views} views</p>
              <div>
                <p>
                 <button onclick="loadDetails('${
                   items.video_id
                 }')" class="btn btn-sm btn-error">Details</button>
                </p>
              </div>
           </div>
        </div>
        `;
    videoContainer.appendChild(card);
  });
};

const removeActiveClass = () => {
  const buttons = document.getElementsByClassName("category-btn");
  console.log(buttons);
  for (const btn of buttons) {
    btn.classList.remove("active");
  }
};

const loadcategoryVideo = (id) => {
  fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
    .then((res) => res.json())
    .then((data) => {
      removeActiveClass();

      const activeBtn = document.getElementById(`btn-${id}`);
      activeBtn.classList.add("active");
      displayVideos(data.category);
    })
    .catch((err) => console.log(err));
};

const displayCategories = (categories) => {
  const categoryContainer = document.getElementById("category-container");
  categories.forEach((items) => {
    console.log(items);
    const categorydiv = document.createElement("div");
    categorydiv.innerHTML = `
    <button id="btn-${items.category_id}" onclick="loadcategoryVideo(${items.category_id})" class="btn category-btn h-8 min-h-8">${items.category}</button>
    `;
    categoryContainer.appendChild(categorydiv);
  });
};

document.getElementById("search-input").addEventListener("keyup", (input) => {
  loadVideos(input.target.value);
});

loadCategories();
loadVideos();
