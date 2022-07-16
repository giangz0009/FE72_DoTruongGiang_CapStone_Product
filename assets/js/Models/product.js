function Product(
  id,
  name,
  price,
  screen,
  backCamera,
  frontCamera,
  img,
  desc,
  type,
  isHearted,
  cart
) {
  this.id = id;
  this.name = name;
  this.price = price;
  this.screen = screen;
  this.backCamera = backCamera;
  this.frontCamera = frontCamera;
  this.img = img;
  this.desc = desc;
  this.type = type;
  this.isHearted = isHearted ? true : false;
  this.cart = {
    isCarting: cart ? true : false,
    amount: cart ? cart.amount : 0,
  };

  this.render = function () {
    return `
      <div class="product product--${this.type} ${
      this.isHearted ? "product--hearted" : ""
    } ${this.cart.isCarting ? "product--carting" : ""}" data-index='${this.id}'>
        <header class="product-header">
          <div class="product-header__icon">
            <i class="product-header__icon-apple fa-brands fa-apple"></i>
            <i
              class="product-header__icon-samsung fa-brands fa-galactic-republic"
            ></i>
          </div>
          <p>In Stock</p>
        </header>
        <main class="product-main">
          <div class="product-main__img">
            <img src="./assets/img/${this.img.name}" alt="${this.name}" />
          </div>
          <div class="product-main-content">
            <header class="product-main-content__heading">
              <h1>${this.name}</h1>
              <i id="like" class="fa-solid fa-heart" onclick="toggleHeart(${
                this.id
              })"></i>
            </header>
            <div class="product-main-content__desc">
              <h3>${this.type}</h3>
              <p>${this.desc}</p>
            </div>
          </div>
        </main>
        <footer class="product-footer">
          <p class="product-footer__price">${this.price}</p>
          <button id="addToCart" onclick="addToCart('${this.id}')">Add</button>
          <div class="product-footer__cart-choosing">
                <button
                  class="product-footer__cart-button product-footer__cart-button--prev" onclick=minusProduct('${
                    this.id
                  }')
                >
                  <i class="fa-solid fa-angle-left"></i>
                </button>
                <span class="product-footer__cart-amount">${
                  this.cart.isCarting ? this.cart.amount : ""
                }</span>
                <button
                  class="product-footer__cart-button product-footer__cart-button--next" onclick=plusProduct('${
                    this.id
                  }')
                >
                  <i class="fa-solid fa-angle-right"></i>
                </button>
              </div>
        </footer>
      </div>
    `;
  };

  this.renderCart = function () {
    const regex = /^\D+/g;
    const newPrice = this.price.replace(regex, "");
    return !this.cart.isCarting
      ? ""
      : `
      <div class="cart-modal-main-item" data-index='${this.id}'>
        <div class="cart-modal-main-item__image">
          <img src="./assets/img/${this.img.name}" alt="${this.name}" />
        </div>
        <p class="cart-modal-main-item__name">${this.name}</p>
        <div class="cart-modal-main-item__qty-change">
          <button class="cart-modal-main-item__qty-change-btn" onclick=minusProduct('${
            this.id
          }')>
            <i class="fa-solid fa-angle-left"></i>
          </button>
          <span class="cart-modal-main-item__qty-change-amount">${
            this.cart.amount
          }</span>
          <button class="cart-modal-main-item__qty-change-btn" onclick=plusProduct('${
            this.id
          }')>
            <i class="fa-solid fa-angle-right"></i>
          </button>
        </div>
        <p class="cart-modal-main-item__price">${this.price.match(regex)}${
          Number(newPrice) * Number(this.cart.amount)
        }</p>
        <button class="cart-modal-main-item__delete" onclick=removeFromCart('${
          this.id
        }')>
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    `;
  };

  this.renderPayment = function () {
    const regex = /^\D+/g;
    const newPrice = this.price.replace(regex, "");
    return !this.cart.isCarting
      ? ""
      : `
    <div class="modal-payment-shipping-item" data-index='${this.id}'>
      <span class="modal-payment-shipping-item__name"
        >${this.cart.amount} x ${this.name}</span
      >
      <span class="modal-payment-shipping-item__price">${this.price.match(
        regex
      )}${Number(newPrice) * Number(this.cart.amount)}</span>
    </div>
    `;
  };
}
