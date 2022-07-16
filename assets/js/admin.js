const service = new Service();

let searchTimeOut = null;

// Dom to Element
const myModal = document.getElementById("myModal");
const modalNotifi = document.getElementById("notifiModal");
const btnOpenModal = document.getElementById("btnThemSP");
const btnToCloseModal = document.getElementById("btn-close");
const btnToggleNotifiModal = document.getElementById("btn-toggle-modal-notifi");

// Render Product List on page load
service
  .getProducts()
  .then((res) => {
    renderProductsList(res.data);
  })
  .catch((err) => console.log(err));

//   -----Event Function----
// --------CRUD Feature
//   Create Product
function createProduct() {
  // Handle if validate method false
  if (!validate()) return false;

  //   Get Input Element
  const modalForm = getInput();

  //   Handle Create new Product
  const data = {
    name: modalForm.proName.value,
    price: modalForm.proPrice.value,
    screen: modalForm.proScreen.value,
    backCamera: modalForm.proBackCam.value,
    frontCamera: modalForm.proFrontCam.value,
    img: {
      name: modalForm.proImg.files[0].name,
      type: modalForm.proImg.files[0].type,
    },
    type: modalForm.proBrand.value,
    desc: modalForm.proDesc.value,
  };

  service
    .addProduct(data)
    .then((res) => {
      const tableNodeElement = document.getElementById("tblDanhSachSP");
      closeModal();
      setInputToEmpty(modalForm);

      let product = res.data;
      openModalNotify(`Thêm sản phẩm ${product.name} thành công!`);
      let html = htmlToRender(product, product.id);

      tableNodeElement.innerHTML += html;
    })
    .catch((err) => console.log(err));
}
// Handle Delete Product
function handleDeleteProduct(id) {
  // Find Product Before Delete
  service
    .getProductById(id)
    .then((res) => res.data.id)
    .then((id) => {
      // Delete
      service
        .deleteProduct(id)
        .then((res) => {
          // Open Notification Modal
          openModalNotify(`Xóa sản phẩm ${res.data.name} thành công!`);

          //   Render Product List
          service
            .getProducts()
            .then((res) => renderProductsList(res.data))
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
}

// Validate
function validate() {
  let result = true;

  // Get Input Element
  const modalForm = getInput();

  //   errMess
  const errMessClass = ".err-mess";

  //   Call Check Function
  result &= checkRequired(modalForm.proName, errMessClass);
  result &=
    checkRequired(modalForm.proPrice, errMessClass) &&
    checkPrice(modalForm.proPrice, errMessClass);
  result &= checkRequired(modalForm.proScreen, errMessClass);
  result &= checkRequired(modalForm.proBackCam, errMessClass);
  result &= checkRequired(modalForm.proFrontCam, errMessClass);
  result &= checkRequired(modalForm.proImg, errMessClass);
  result &= checkRequired(modalForm.proBrand, errMessClass);
  result &= checkRequired(modalForm.proDesc, errMessClass);
  return !!result;

  //   -----Check Function
  // Check Required
  function checkRequired(
    elementNode,
    errMessNode,
    messToShow = "* Vui lòng nhập trường này !"
  ) {
    // Get Err Message Element
    const formGroupElement = elementNode.parentElement;
    const errMessNodeElement = formGroupElement.querySelector(errMessNode);

    // Check
    if (elementNode.value.trim() === "") {
      formGroupElement.classList.add("form-group--err");
      errMessNodeElement.innerHTML = messToShow;
      return false;
    }
    formGroupElement.classList.remove("form-group--err");
    errMessNodeElement.innerHTML = "";
    return true;
  }
  //Check Price
  function checkPrice(
    elementNode,
    errMessNode,
    messToShow = "* Vui lòng nhập đúng định dạng tiền tệ!"
  ) {
    const regex =
      /(USD|EUR|€|\$|£)\s?(\d{1,}(?:[.,]*\d{3})*(?:[.,]*\d*))|(\d{1,3}(?:[.,]*\d*)*(?:[.,]*\d*)?)\s?(USD|EUR|VND|vnd)/;
    // Get Err Message Element
    const formGroupElement = elementNode.parentElement;
    const errMessNodeElement = formGroupElement.querySelector(errMessNode);

    // Check
    if (!regex.test(elementNode.value)) {
      formGroupElement.classList.add("form-group--err");
      errMessNodeElement.innerHTML = messToShow;
      return false;
    }
    formGroupElement.classList.remove("form-group--err");
    errMessNodeElement.innerHTML = "";
    return true;
  }
}

// Change Create Modal to Update Modal
function changeToUpdateModal(id) {
  service
    .getProductById(id)
    .then((res) => {
      const modalForm = getInput();
      const product = res.data;

      setValueToInputForm();

      // Open Modal Form
      openModal();

      // Set Value To Input
      function setValueToInputForm() {
        // Set Modal Title
        const updateBtn = document.getElementById("updateProduct");
        myModal.querySelector(".modal-title").innerHTML = `Sửa ${product.name}`;
        document.getElementById("addProduct").style.display = "none";
        updateBtn.style.display = "inline-block";
        updateBtn.setAttribute("onclick", `updateProduct(${id})`);

        // Set Input Form
        modalForm.proName.value = product.name;
        modalForm.proPrice.value = product.price;
        modalForm.proScreen.value = product.screen;
        modalForm.proBackCam.value = product.backCamera;
        modalForm.proFrontCam.value = product.frontCamera;
        modalForm.proBrand.value = product.type;
        modalForm.proDesc.value = product.desc;

        // LoadURLToInputFile
        const file = new File(
          [""],
          product.img.name,
          {
            type: product.img.type,
            lastModified: new Date().getTime(),
          },
          "utf-8"
        );
        const container = new DataTransfer();
        container.items.add(file);
        modalForm.proImg.files = container.files;
      }
    })
    .catch((err) => console.log(err));
}

// Update Product
function updateProduct(id) {
  // Check Validate
  if (!validate()) return false;

  // Get Value Input
  const modalForm = getInput();

  //Call Api To Update
  const data = {
    name: modalForm.proName.value,
    price: modalForm.proPrice.value,
    screen: modalForm.proScreen.value,
    backCamera: modalForm.proBackCam.value,
    frontCamera: modalForm.proFrontCam.value,
    img: {
      name: modalForm.proImg.files[0].name,
      type: modalForm.proImg.files[0].type,
    },
    type: modalForm.proBrand.value,
    desc: modalForm.proDesc.value,
  };

  service
    .getProductById(id)
    .then((res) => res.data.id)
    .then((id) => {
      service
        .updateProduct(id, data)
        .then((res) => {
          // Close Modal Form
          closeModal();

          // Open Notify Modal
          openModalNotify(`Cập nhật sản phẩm ${res.data.name} thành công!`);

          // Reset Form Input value
          setInputToEmpty(modalForm);
          myModal.querySelector(".modal-title").innerHTML = "Thêm sản phẩm mới";
          document.getElementById("addProduct").style.display = "inline-block";
          document.getElementById("updateProduct").style.display = "none";
          // Render
          const html = htmlToRender(res.data, res.data.id);
          const productToReRender = document.querySelector(
            `#tblDanhSachSP > tr[data-index='${res.data.id}']`
          );

          productToReRender.innerHTML = html;
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));

  // service
  //   .updateProduct(id, data)
  //   .then((res) => {
  //     // Close Modal Form
  //     closeModal();

  //     // Open Notify Modal
  //     openModalNotify(`Cập nhật sản phẩm ${res.data.name} thành công!`);

  //     // Reset Form Input value
  //     setInputToEmpty(modalForm);
  //     myModal.querySelector(".modal-title").innerHTML = "Thêm sản phẩm mới";
  //     document.getElementById("addProduct").style.display = "inline-block";
  //     document.getElementById("updateProduct").style.display = "none";
  //     // Render
  //     const html = htmlToRender(res.data, res.data.id);
  //     const productToReRender = document.querySelector(
  //       `#tblDanhSachSP > tr[data-index='${res.data.id}']`
  //     );

  //     productToReRender.innerHTML = html;
  //   })
  //   .catch((err) => console.log(err));
}

// -----------Search Feature
function handleSearch(searchElementNode) {
  // Clear TimeOUt
  clearTimeout(searchTimeOut);

  // Make New Time Out to Start Search
  searchTimeOut = setTimeout(() => {
    service
      .getProducts()
      .then((res) => {
        const productsList = res.data;
        const searchValue = searchElementNode.value;

        const searchData =
          findByName(productsList, searchValue) ||
          findByType(productsList, searchValue);

        renderProductsList(searchData);
      })
      .catch((err) => console.log(err));
  }, 600);

  // Find by Name
  function findByName(data, name) {
    return data.filter((product) => {
      return product.name.toLowerCase().match(name.toLowerCase());
    });
  }
  // Find By Type
  function findByType(data, type) {
    return data.filter((product) => {
      return product.type.toLowerCase().match(type.toLowerCase());
    });
  }
}

// Get Input from FormGroup
function getInput() {
  const proName = document.getElementById("productName");
  const proPrice = document.getElementById("productPrice");
  const proScreen = document.getElementById("productScreen");
  const proBackCam = document.getElementById("productBackCam");
  const proFrontCam = document.getElementById("productFrontCam");
  const proImg = document.getElementById("productImg");
  const proBrand = document.getElementById("productBrand");
  const proDesc = document.getElementById("productDesc");

  return {
    proName,
    proPrice,
    proScreen,
    proBackCam,
    proFrontCam,
    proImg,
    proBrand,
    proDesc,
  };
}

// Open Form Modal
function openModal() {
  if (!myModal.classList.contains("show")) btnOpenModal.click();
}

// Close Form Modal
function closeModal() {
  if (myModal.classList.contains("show")) btnToCloseModal.click();
}

// Show Modal Notify
function openModalNotify(content) {
  // Open Notification Modal
  btnToggleNotifiModal.click();

  //   Set Notification Modal Content
  modalNotifi.querySelector(".modal-body").innerHTML = content;
}

//Set Input Form Value to Empty
function setInputToEmpty(modalForm) {
  modalForm.proName.value = "";
  modalForm.proPrice.value = "";
  modalForm.proScreen.value = "";
  modalForm.proBackCam.value = "";
  modalForm.proFrontCam.value = "";
  modalForm.proImg.value = "";
  modalForm.proBrand.value = "";
  modalForm.proDesc.value = "";
}

// Render Product List
function renderProductsList(data) {
  const tableNodeElement = document.getElementById("tblDanhSachSP");

  let html = "";
  data.forEach((product, index) => {
    html += htmlToRender(product, index + 1);
  });

  tableNodeElement.innerHTML = html;
}

// HTML to Table when Render
function htmlToRender(product, numericalOrder) {
  return `
    <tr data-index="${product.id}">
        <td>
            ${numericalOrder}
        </td>
        <td>
            ${product.name}
        </td>
        <td>
            ${product.price}
        </td>
        <td>
            ${product.screen}
        </td>
        <td>
            ${product.backCamera}
        </td>
        <td>
            ${product.frontCamera}
        </td>
        <td>
            <img src="./assets/img/${product.img.name}" alt="${product.name}" width= 50px/>
        </td>
        <td>
            ${product.type}
        </td>
        <td>
      
            ${product.desc}
        </td>
        <td class="d-flex gap-2">
            <button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteConfirmModal${product.id}">Delete</button>

            <div class="modal fade" id="deleteConfirmModal${product.id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Xác nhận</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        Bạn xác nhận xóa sản phẩm ${product.name} chứ ?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                        <button type="button" class="btn btn-danger" onclick="handleDeleteProduct(${product.id})">Xác nhận</button>
                    </div>
                    </div>
                </div>
            </div>

            <button class="btn btn-primary" onclick="changeToUpdateModal(${product.id})">Sửa</button>

        </td>
    </tr>
    `;
}
