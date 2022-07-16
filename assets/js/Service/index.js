const apiProduct = {
  main: "https://62c2fb54876c4700f533dca8.mockapi.io/Product",
};

function Service() {
  // -----------CRUD Feature
  // Get All Products
  this.getProducts = function () {
    return axios({
      url: apiProduct.main,
      method: "GET",
    });
  };
  // Get Product By Id
  this.getProductById = function (id) {
    return axios({
      url: apiProduct.main + "/" + id,
      method: "GET",
    });
  };
  // Add New Product
  this.addProduct = function (data) {
    return axios({
      url: apiProduct.main,
      method: "POST",
      data: data,
    });
  };
  // Update A Product
  this.updateProduct = function (id, data) {
    return axios({
      url: apiProduct.main + "/" + id,
      method: "put",
      data: data,
    });
  };
  // Delete A Product
  this.deleteProduct = function (id) {
    return axios({
      url: apiProduct.main + "/" + id,
      method: "delete",
    });
  };
}
