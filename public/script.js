const postsApi = new URL('api/posts', `${window.origin}`)
const submitBtn = document.querySelector('button[type=submit]');
const inputImage = document.querySelector('input[type=file]');
const gridForm = document.querySelector('.grid-form');
const gridMsg = document.querySelector('.grid-message');
const preview = document.querySelector('.preview');
const inputMsg = document.querySelector('#message');
const fileTypes = [
  "image/apng",
  "image/bmp",
  "image/gif",
  "image/jpeg",
  "image/pjpeg",
  "image/png",
  "image/svg+xml",
  "image/tiff",
  "image/webp",
  "image/x-icon"
];


renderPosts();

inputImage.addEventListener('change', updateImageDisplay);

submitBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const message = inputMsg.value;
  const imageFile = inputImage.files[0];
  const formData = new FormData();
  formData.append('file', imageFile);
  formData.append('message', message);

  if (imageFile.length===0 || message.length ===0) return
    const request = {
      'method': 'POST',
      'body': formData
    };
    submitPost(request);
});


async function renderPosts(){
  const response = await fetch(postsApi);
  const results = await response.json();
  try {
    if (results.data.length === 0) return
    results.data.forEach(post => {
      updatePosts(post);
    });
  } catch(error) {
    console.log(`Error: ${error}`);
    return
  }
};



async function submitPost(request) {
  const response = await fetch(postsApi, request);
  if (response.status === 200) {
    const result = await response.json().data;
    // update post
    updatePosts(result);
  } else {
    console.log('fail to post');
  };
};


function updatePosts(result){
  const msgItemsDiv = document.createElement('div');
  const image = document.createElement('img');
  const messageP = document.createElement('p');
  msgItemsDiv.className = 'message-items';
  messageP.textContent = result.message;
  image.src = result.url;
  msgItemsDiv.append(image, messageP);
  gridMsg.insertBefore(msgItemsDiv, gridMsg.firstChild);
};

function updateImageDisplay() {
  // empty the previous image info
  while (preview.firstChild) {
    preview.removeChild(preview.firstChild);
  }
  const curFile = inputImage.files[0];
  const p = document.createElement('p');
  if (curFile.length === 0) {   
    p.textContent = 'No files currently selected for upload';
    preview.appendChild(p);
  } else {
    const list = document.createElement('ol');
    preview.appendChild(list);
    const listItem = document.createElement('li');
    const fileInfoP = p.cloneNode();
    if (validFileType(curFile)) {
      fileInfoP.textContent = `File name ${curFile.name}, file size ${returnFileSize(curFile.size)}`;
      const img = document.createElement('img');
      img.src = URL.createObjectURL(curFile);
      listItem.append(img, fileInfoP);
    } else {
      fileInfoP.textContent = `File name ${curFile.name}: Not a valid file type. Update your selection.`;
      listItem.append(fileInfoP);
    }
    list.appendChild(listItem);
  };
};


function validFileType(file) {
  return fileTypes.includes(file.type);
};


function returnFileSize(number) {
  if (number < 1024) {
    return `${number} bytes`;
  } else if (number >= 1024 && number < 1048576) {
    return `${(number / 1024).toFixed(1)} KB`;
  } else if (number >= 1048576) {
    return `${(number / 1048576).toFixed(1)} MB`;
  };
};