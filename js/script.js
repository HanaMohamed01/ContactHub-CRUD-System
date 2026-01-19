var nameInput = document.getElementById("nameInput");
var phoneInput = document.getElementById("phoneInput");
var emailInput = document.getElementById("emailInput");
var addressInput = document.getElementById("addressInput");
var categoryInput = document.getElementById("categoryInput");
var notesInput = document.getElementById("notesInput");
var favoriteInput = document.getElementById("favoriteInput");
var emergencyInput = document.getElementById("emergencyInput");
var addBtn = document.getElementById("addBtn");
var contactList = document.getElementById("contactList");
var searchInput = document.getElementById("searchInput");
var emptyState = document.getElementById("emptyState");
var favoritesList = document.getElementById("favoritesList");
var emergencyList = document.getElementById("emergencyList");
var modalTitle = document.getElementById("modalTitle");
var btnText = document.getElementById("btnText");
var imageInput = document.getElementById("imageInput");
var profilePlaceholder = document.getElementById("profilePlaceholder");

var contacts = [];
var currentIndex = null;
var currentImage = "";

if (localStorage.getItem("contactsContainer") !== null) {
  contacts = JSON.parse(localStorage.getItem("contactsContainer"));
  displayContacts();
}

imageInput.addEventListener("change", function () {
  var file = imageInput.files[0];
  if (file) {
    var reader = new FileReader();
    reader.onload = function (e) {
      currentImage = e.target.result;
      profilePlaceholder.innerHTML = `<img src="${currentImage}" class="w-100 h-100 rounded-circle" style="object-fit: cover;">`;
      profilePlaceholder.classList.remove("bg-blue-vibrant", "text-white");
    };
    reader.readAsDataURL(file);
  }
});

function addContact() {
  if (validateInputs() === true) {
    if (currentIndex !== null) {
      contacts[currentIndex].name = nameInput.value;
      contacts[currentIndex].phone = phoneInput.value;
      contacts[currentIndex].email = emailInput.value;
      contacts[currentIndex].address = addressInput.value;
      contacts[currentIndex].category = categoryInput.value;
      contacts[currentIndex].notes = notesInput.value;
      contacts[currentIndex].favorite = favoriteInput.checked;
      contacts[currentIndex].emergency = emergencyInput.checked;
      contacts[currentIndex].image = currentImage;

      currentIndex = null;
      modalTitle.innerText = "Add New Contact";
      btnText.innerText = "Save Contact";
    } else {
      var contact = {
        name: nameInput.value,
        phone: phoneInput.value,
        email: emailInput.value,
        address: addressInput.value,
        category: categoryInput.value,
        notes: notesInput.value,
        favorite: favoriteInput.checked,
        emergency: emergencyInput.checked,
        image: currentImage,
      };
      contacts.push(contact);
    }

    localStorage.setItem("contactsContainer", JSON.stringify(contacts));
    displayContacts();
    clearForm();

    var modalElement = document.getElementById("addContactModal");
    var modal = bootstrap.Modal.getOrCreateInstance(modalElement);
    modal.hide();
  }
}

addBtn.addEventListener("click", function () {
  addContact();
});

function clearForm() {
  nameInput.value = "";
  phoneInput.value = "";
  emailInput.value = "";
  addressInput.value = "";
  categoryInput.value = "";
  notesInput.value = "";
  favoriteInput.checked = false;
  emergencyInput.checked = false;

  imageInput.value = "";
  currentImage = "";
  profilePlaceholder.innerHTML = '<i class="fa-solid fa-user"></i>';
  profilePlaceholder.classList.add("bg-blue-vibrant", "text-white");

  currentIndex = null;
  modalTitle.innerText = "Add New Contact";
  btnText.innerText = "Save Contact";
}

function setFormForUpdate(index) {
  currentIndex = index;
  modalTitle.innerText = "Update Contact";
  btnText.innerText = "Update";

  nameInput.value = contacts[index].name;
  phoneInput.value = contacts[index].phone;
  emailInput.value = contacts[index].email;
  addressInput.value = contacts[index].address;
  categoryInput.value = contacts[index].category;
  notesInput.value = contacts[index].notes;
  favoriteInput.checked = contacts[index].favorite;
  emergencyInput.checked = contacts[index].emergency;

  if (contacts[index].image) {
    currentImage = contacts[index].image;
    profilePlaceholder.innerHTML = `<img src="${currentImage}" class="w-100 h-100 rounded-circle" style="object-fit: cover;">`;
    profilePlaceholder.classList.remove("bg-blue-vibrant", "text-white");
  } else {
    currentImage = "";
    profilePlaceholder.innerHTML = '<i class="fa-solid fa-user"></i>';
    profilePlaceholder.classList.add("bg-blue-vibrant", "text-white");
  }

  var modalElement = document.getElementById("addContactModal");
  var modal = bootstrap.Modal.getOrCreateInstance(modalElement);
  modal.show();
}

function displayContacts() {
  renderList(contacts);
  updateCounters();
  displaySideLists();
}

function renderList(listToRender) {
  var cartona = "";
  for (var i = 0; i < listToRender.length; i++) {
    cartona += getCardHTML(listToRender[i], i);
  }

  if (listToRender.length > 0) {
    contactList.innerHTML = cartona;
    emptyState.classList.add("d-none");
  } else {
    contactList.innerHTML = "";
    emptyState.classList.remove("d-none");
  }
}

function getCardHTML(contact, index) {
  var starClass = contact.favorite
    ? "fa-solid text-warning"
    : "fa-regular text-muted";
  var heartClass = contact.emergency
    ? "fa-solid text-danger"
    : "fa-regular text-muted";

  var profileImageHTML;
  if (contact.image) {
    profileImageHTML = `<img src="${contact.image}" class="w-100 h-100 rounded-4" style="object-fit: cover;">`;
  } else {
    profileImageHTML = contact.name.charAt(0).toUpperCase();
  }

  var profileContainerStyle = contact.image
    ? "width: 80px; height: 80px; overflow: hidden;"
    : "width: 80px; height: 80px; font-size: 2rem;";

  var profileContainerClass = contact.image
    ? "rounded-4 shadow-sm flex-shrink-0"
    : "rounded-4 bg-purple-gradient d-flex align-items-center justify-content-center text-white fw-bold shadow-purple-glow flex-shrink-0";

  return `
    <div class="col-xl-6 col-md-6">
        <div class="card border-0 shadow-sm rounded-4 h-100 mb-2">
          <div class="card-body p-4">
            <div class="d-flex align-items-center gap-4 mb-4">
              <div class="${profileContainerClass}" style="${profileContainerStyle}">
                ${profileImageHTML}
              </div>
              
              <div class="flex-grow-1">
                <h4 class="fw-bold mb-2 text-truncate">${contact.name}</h4>
                <div class="d-flex align-items-center gap-2">
                    <div class="contact-card-icon bg-blue-subtle text-blue rounded-3">
                        <i class="fa-solid fa-phone fa-sm"></i>
                    </div>
                    <span class="text-secondary fw-medium">${contact.phone}</span>
                </div>
              </div>
            </div>

            <div class="d-flex flex-column gap-3">
                ${
                  contact.email
                    ? `
                <div class="d-flex align-items-center gap-3">
                    <div class="contact-card-icon bg-purple-subtle text-purple rounded-3">
                        <i class="fa-solid fa-envelope fa-sm"></i>
                    </div>
                    <span class="text-secondary text-truncate">${contact.email}</span>
                </div>`
                    : ""
                }
                
                ${
                  contact.address
                    ? `
                <div class="d-flex align-items-center gap-3">
                    <div class="contact-card-icon bg-green-subtle text-green rounded-3">
                        <i class="fa-solid fa-location-dot fa-sm"></i>
                    </div>
                    <span class="text-secondary text-truncate">${contact.address}</span>
                </div>`
                    : ""
                }
            </div>
          </div>

          <div class="card-footer bg-transparent border-top border-light-subtle p-3 mt-auto">
            <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex gap-2">
                    <a href="tel:${contact.phone}" class="btn btn-light rounded-3 text-green bg-green-subtle d-flex align-items-center justify-content-center" style="width: 45px; height: 45px;">
                        <i class="fa-solid fa-phone"></i>
                    </a>
                    ${
                      contact.email
                        ? `
                    <a href="mailto:${contact.email}" class="btn btn-light rounded-3 text-purple bg-purple-subtle d-flex align-items-center justify-content-center" style="width: 45px; height: 45px;">
                        <i class="fa-solid fa-envelope"></i>
                    </a>
                    `
                        : ""
                    }
                </div>

                <div class="d-flex gap-2">
                    <button class="action-btn" onclick="toggleFavorite(${index})">
                        <i class="fa-solid fa-star ${starClass}"></i>
                    </button>
                    <button class="action-btn" onclick="toggleEmergency(${index})">
                       <i class="fa-solid fa-heart-pulse ${heartClass}"></i>
                    </button>
                    <button class="action-btn" onclick="setFormForUpdate(${index})">
                        <i class="fa-solid fa-pen fa-lg"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteContact(${index})">
                        <i class="fa-solid fa-trash-can fa-lg"></i>
                    </button>
                </div>
            </div>
          </div>
        </div>
    </div>
    `;
}

function deleteContact(index) {
  contacts.splice(index, 1);
  localStorage.setItem("contactsContainer", JSON.stringify(contacts));
  displayContacts();
}

function toggleFavorite(index) {
  contacts[index].favorite = !contacts[index].favorite;
  localStorage.setItem("contactsContainer", JSON.stringify(contacts));
  displayContacts();
}

function toggleEmergency(index) {
  contacts[index].emergency = !contacts[index].emergency;
  localStorage.setItem("contactsContainer", JSON.stringify(contacts));
  displayContacts();
}

function validateInputs() {
  if (nameInput.value === "" || phoneInput.value === "") {
    alert("Please fill in Name and Phone Number");
    return false;
  }
  return true;
}

function updateCounters() {
  var totalCard = document.querySelector(".col-md-4:nth-child(1) h3");
  if (totalCard) totalCard.innerText = contacts.length;

  var favCount = contacts.filter((c) => c.favorite).length;
  var favCard = document.querySelector(".col-md-4:nth-child(2) h3");
  if (favCard) favCard.innerText = favCount;

  var emergencyCount = contacts.filter((c) => c.emergency).length;
  var emergencyCard = document.querySelector(".col-md-4:nth-child(3) h3");
  if (emergencyCard) emergencyCard.innerText = emergencyCount;

  var allContactsText = document.querySelector(".col-lg-9 .text-muted");
  if (allContactsText) {
    allContactsText.innerText = `Manage and organize your ${contacts.length} contacts`;
  }
}

function displaySideLists() {
  var favContacts = contacts.filter((c) => c.favorite);
  var favCartona = "";
  if (favContacts.length > 0) {
    for (let i = 0; i < favContacts.length; i++) {
      var imgHTML = favContacts[i].image
        ? `<img src="${favContacts[i].image}" class="w-100 h-100 rounded-circle" style="object-fit: cover;">`
        : favContacts[i].name.charAt(0).toUpperCase();

      var imgContainerClass = favContacts[i].image
        ? "rounded-circle shadow-sm flex-shrink-0"
        : "rounded-circle bg-warning text-white d-flex align-items-center justify-content-center fw-bold shadow-sm flex-shrink-0";

      favCartona += `
        <div class="d-flex align-items-center gap-3 mb-3 p-2 rounded-3 hover-bg-light">
            <div class="${imgContainerClass}" style="width: 40px; height: 40px; overflow: hidden;">
              ${imgHTML}
            </div>
            <div class="overflow-hidden">
              <h6 class="fw-bold mb-0 text-truncate text-dark">${favContacts[i].name}</h6>
              <small class="text-muted">${favContacts[i].phone}</small>
            </div>
        </div>`;
    }
    favoritesList.innerHTML = favCartona;
  } else {
    favoritesList.innerHTML =
      '<p class="text-muted mb-0 small text-center py-2">No favorites yet</p>';
  }

  var emContacts = contacts.filter((c) => c.emergency);
  var emCartona = "";
  if (emContacts.length > 0) {
    for (let i = 0; i < emContacts.length; i++) {
      var imgHTML = emContacts[i].image
        ? `<img src="${emContacts[i].image}" class="w-100 h-100 rounded-circle" style="object-fit: cover;">`
        : emContacts[i].name.charAt(0).toUpperCase();

      var imgContainerClass = emContacts[i].image
        ? "rounded-circle shadow-sm flex-shrink-0"
        : "rounded-circle bg-danger text-white d-flex align-items-center justify-content-center fw-bold shadow-sm flex-shrink-0";

      emCartona += `
        <div class="d-flex align-items-center gap-3 mb-3 p-2 rounded-3 hover-bg-light">
            <div class="${imgContainerClass}" style="width: 40px; height: 40px; overflow: hidden;">
              ${imgHTML}
            </div>
            <div class="overflow-hidden">
              <h6 class="fw-bold mb-0 text-truncate text-dark">${emContacts[i].name}</h6>
              <small class="text-muted">${emContacts[i].phone}</small>
            </div>
        </div>`;
    }
    emergencyList.innerHTML = emCartona;
  } else {
    emergencyList.innerHTML =
      '<p class="text-muted mb-0 small text-center py-2">No emergency contacts</p>';
  }
}

searchInput.addEventListener("input", function () {
  var term = searchInput.value.toLowerCase();
  var cartona = "";
  for (var i = 0; i < contacts.length; i++) {
    if (
      contacts[i].name.toLowerCase().includes(term) ||
      contacts[i].phone.includes(term)
    ) {
      cartona += getCardHTML(contacts[i], i);
    }
  }

  if (cartona === "" && term !== "") {
    contactList.innerHTML = "";
    emptyState.classList.remove("d-none");
  } else if (cartona !== "") {
    contactList.innerHTML = cartona;
    emptyState.classList.add("d-none");
  } else if (contacts.length === 0) {
    contactList.innerHTML = "";
    emptyState.classList.remove("d-none");
  }
});
