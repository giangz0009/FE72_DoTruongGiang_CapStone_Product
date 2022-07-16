const LOCAL_STORAGE_HEART = "PRODUCT_HEART_FROM_GIANG_WITH_LOVE";
const LOCAL_STORAGE_CART = "PRODUCT_CART_FROM_GIANG_WITH_LOVE";
const service = new Service();

// Get Product List from API
service
  .getProducts()
  .then((res) => {
    // DOM to Element
    const productsListElement = document.getElementById("products-list");
    const cartModalMain = document.querySelector(".cart-modal-main");
    const totalPrice = document.getElementById("modalTotalPrice");
    const selectElement = document.getElementById("product-select");
    const modalNotification = document.getElementById("modal-notification");
    const modalPayment = document.getElementById("modal-payment");
    const btnToggleModalNotification =
      document.getElementById("toggleNotification");
    const btnToggleModalPayment = document.getElementById("togglePayment");

    const data = res.data;

    const products = {
      list: [],
      listHeart: JSON.parse(localStorage.getItem(LOCAL_STORAGE_HEART)) || [],
      listCart: JSON.parse(localStorage.getItem(LOCAL_STORAGE_CART)) || [],

      //   Config Define Properties for Object
      defineProperties() {},

      //---------Handle DOM Event
      handleDomEvent() {
        // Onchange Select Input
        selectElement.onchange = (e) => {
          const selectedValue = e.target.value;
          const productsTypeList = products.filterProductType(selectedValue);

          this.renderToProductsList(productsTypeList);
        };

        // Onclick Heart
        toggleHeart = (id) => {
          const productElement = document.querySelector(
            `.product[data-index='${id}']`
          );
          let arrayPos;
          const foundFromHeartList = this.listHeart.find((heart, index) => {
            arrayPos = index;
            return heart === `${id}`;
          });

          if (foundFromHeartList) {
            productElement.classList.remove("product--hearted");
            this.listHeart.splice(arrayPos, 1);
          } else {
            productElement.classList.add("product--hearted");
            this.listHeart.push(`${id}`);
          }

          this.mapList();

          this.setHeartLocalStorage();
        };

        // Onclick Add To Cart Btn
        addToCart = (id) => {
          // Get product Element
          const productElement = document.querySelector(
            `.product[data-index='${id}']`
          );
          // Setup Data to Push
          const dataToPush = {
            id: id,
            amount: 1,
          };

          // Push to Cart List
          this.listCart.push(dataToPush);

          // Set to Local Storage
          this.setCartLocalStorage();

          // Add Class 'product--carting' to Product Element
          productElement.classList.add("product--carting");
          productElement.querySelector(
            ".product-footer__cart-amount"
          ).innerHTML = dataToPush.amount;

          // Map List
          this.mapList();
          // Update Cart Amount
          this.updateAmountCart();
          // ReRender Cart List
          this.renderToCartList(this.list);
        };

        // Onclick Minus Btn
        minusProduct = (id) => {
          // DOM to Product Element
          const productElement = document.querySelector(
            `.product[data-index='${id}']`
          );
          // Find Product In Cart List
          let foundIndex;
          const foundIdFromDataCart = this.listCart.find((cart, index) => {
            foundIndex = index;
            return cart.id === id;
          });

          if (!foundIdFromDataCart) return false;

          // Handle if Amount = 1
          if (foundIdFromDataCart.amount === 1) {
            // Remove Id from list cart
            this.listCart.splice(foundIndex, 1);

            // set Local Storage
            this.setCartLocalStorage();

            // Remove class 'product--carting' in Product Element
            productElement.classList.remove("product--carting");
            productElement.querySelector(
              ".product-footer__cart-amount"
            ).innerHTML = "";
          }
          // Handle If Amount > 1
          else {
            // -1 for amount key in List Cart
            this.listCart[foundIndex].amount--;

            // Set Local Storage
            this.setCartLocalStorage();

            // Set InnerHtml for amount of Product
            productElement.querySelector(
              ".product-footer__cart-amount"
            ).innerHTML = this.listCart[foundIndex].amount;
          }

          // Map List
          this.mapList();
          // Update Cart Amount
          this.updateAmountCart();
          // ReRender Cart List
          this.renderToCartList(this.list);
        };

        // Onclick Plus Btn
        plusProduct = (id) => {
          // Dom to Product Element
          const productElement = document.querySelector(
            `.product[data-index='${id}']`
          );
          // Find Id In cart List
          let foundIndex;
          const foundIdFromDataCart = this.listCart.find((cart, index) => {
            foundIndex = index;
            return cart.id === id;
          });

          if (!foundIdFromDataCart) return false;

          // Handle If amount = 10
          if (foundIdFromDataCart.amount === 10) {
            this.showNotificationModal(
              "Không được thêm quá 10 sản phẩm cùng loại vào giỏ hàng!"
            );
          }
          // Handle If amount < 10
          else {
            // ++ 1 for amount
            this.listCart[foundIndex].amount++;

            // set Local Storage
            this.setCartLocalStorage();

            //set innerHtml for amount of Product
            productElement.querySelector(
              ".product-footer__cart-amount"
            ).innerHTML = this.listCart[foundIndex].amount;
          }

          // Map List
          this.mapList();
          // Update Cart Amount
          this.updateAmountCart();
          // ReRender Cart List
          this.renderToCartList(this.list);
        };

        // Onclick Remove from Cart List
        removeFromCart = (id) => {
          // DOM to Product Element
          const productElement = document.querySelector(
            `.product[data-index='${id}']`
          );
          // Find Product In Cart List
          let foundIndex;
          const foundIdFromDataCart = this.listCart.find((cart, index) => {
            foundIndex = index;
            return cart.id === id;
          });
          // Remove Id from list cart
          this.listCart.splice(foundIndex, 1);

          // set Local Storage
          this.setCartLocalStorage();

          // Remove class 'product--carting' in Product Element
          productElement.classList.remove("product--carting");
          productElement.querySelector(
            ".product-footer__cart-amount"
          ).innerHTML = "";

          // Map List
          this.mapList();
          // Update Cart Amount
          this.updateAmountCart();
          // ReRender Cart List
          this.renderToCartList(this.list);
        };

        // Onclick Clear Cart
        clearCart = () => {
          // Clear Cart List
          this.listCart = [];
          // Map List
          this.mapList();
          // Update Cart Amount
          this.updateAmountCart();
          // ReRender Products List
          this.renderToProductsList(this.list);
          // ReRender Cart List
          this.renderToCartList(this.list);
          // Set Local Storage
          this.setCartLocalStorage();
        };

        // Onclick Purchase
        showPurchaseModal = () => {
          const cartList = this.mapCartToList();

          if (cartList.length === 0) return;
          this.renderToPaymentList(cartList);
          this.showPaymentModal();
        };

        // Onclick Print Receipt
        printReceipt = (e) => {
          e.preventDefault();
          // Get random Id for Receipt
          const randomReceiptId = Math.floor(Math.random() * 1000);
          // Setup new fake data for receipt
          const dataCart = this.mapCartToList();
          const dataReceipt = {
            id: randomReceiptId,
            productsList: dataCart,
            totalPrice: this.getTotalPrice(),
          };

          this.renderReceipt(randomReceiptId, this.getTotalPrice());

          console.log(dataReceipt);

          this.listCart = [];

          // Onclick Okay Btn
          finishPaymentReceipt = () => {
            this.showNotificationModal("Thanks for shopping with us!");

            this.setCartLocalStorage();

            this.start();
          };
        };
      },

      // Map Cart List to List
      mapCartToList() {
        const cartListMap = this.listCart.map((cart) => {
          const foundIdFromDataList = this.list.find(
            (pro) => pro.id === cart.id
          );

          return foundIdFromDataList;
        });
        return cartListMap;
      },

      // Show Payment Modal
      showPaymentModal() {
        if (!btnToggleModalPayment.checked)
          btnToggleModalPayment.checked = true;
      },

      // Show NotifiCation Modal
      showNotificationModal(text) {
        if (!btnToggleModalNotification.checked)
          btnToggleModalNotification.checked = true;

        modalNotification.querySelector(
          ".modal-notification-main__title"
        ).innerHTML = text;
      },

      // Update Amount Cart
      updateAmountCart() {
        // Dom to productAmount
        const productAmount = document.getElementById("productAmount");
        const totalAmount = this.listCart.reduce((prevCart, currCart) => {
          return (prevCart += currCart.amount);
        }, 0);

        productAmount.innerHTML = totalAmount;
      },

      // get Payment List
      getPaymentListHtml(data) {
        return data.reduce((prev, curr) => {
          return (prev += curr.renderPayment());
        }, "");
      },

      //   get Products List
      getProductsListHtml(data) {
        // Sort data for product which isHearted to first
        data.sort((a, b) => {
          const heartA = a.isHearted;
          const heartB = b.isHearted;
          if (heartA < heartB) return 1;
          if (heartA > heartB) return -1;
          return 0;
        });

        return data.reduce((prePro, curPro) => {
          return (prePro += curPro.render());
        }, "");
      },

      // get Cart List Html
      getCartListHtml(data) {
        return data.reduce((prevPro, curPro) => {
          return (prevPro += curPro.renderCart());
        }, "");
      },

      // get Total Price
      getTotalPrice() {
        const regex = /^\D+/g;
        return this.list.reduce((prePro, curPro) => {
          if (!curPro.cart.isCarting) return prePro;

          const rePrice = curPro.price.replace(regex, "");
          const totalProduct = Number(rePrice * curPro.cart.amount);
          return (
            curPro.price.match(regex) +
            (Number(prePro.replace(regex, "")) + totalProduct)
          );
        }, "$0");
      },

      // Render Receipt
      renderReceipt(id, price) {
        const modalPaymentMain = modalPayment.querySelector(
          ".modal-payment-main"
        );

        modalPaymentMain.style.width = "500px";
        modalPaymentMain.innerHTML = `
        <div class="modal-payment-order-detail">
          <em>Your order has been placed</em>
          <p>Your order-id is: <span id="modal-payment-order-id">${id}</span></p>
          <p>your order will be delivered to you in 3-5 working days</p>
          <p>
            you can pay <span id="modal-payment-order-price">${price}</span> by card
            or any online transaction method after the products have been
            dilivered to you
          </p>
          <label for="togglePayment" onclick='finishPaymentReceipt()'>Okay</label>
        </div>
        `;
      },

      // Render Payment List
      renderToPaymentList(data) {
        const modalPaymentMain = modalPayment.querySelector(
          ".modal-payment-main"
        );
        modalPaymentMain.style.width = "90%";
        modalPaymentMain.innerHTML = `
          <div class='modal-payment-shipping-list'>
            ${this.getPaymentListHtml(data)}
          </div>
          <div class="modal-payment-pay">
            <p>Payment</p>
            <div>
              <p>Total amount to be paid:</p>
              <span>${this.getTotalPrice()}</span>
            </div>
          </div>
          <div class="modal-payment-order">
          <label
            for="togglePayment"
            class="modal-payment-order__btn modal-payment-order__btn--buy"
            onclick='printReceipt(event)'
            >Order Now</label
          >
          <label
            for="togglePayment"
            class="modal-payment-order__btn modal-payment-order__btn--close"
            >Cancel</label
          >
        </div>
        `;
      },

      // Render to Products List Element
      renderToProductsList(data) {
        productsListElement.innerHTML = this.getProductsListHtml(data);
      },

      // Render to Cart list Element
      renderToCartList(data) {
        if (!this.getCartListHtml(data)) {
          cartModalMain.innerHTML = `
          <p class="cart-modal-main__empty">
            Looks Like You Haven't Added Any Product In The Cart
          </p>
          `;
          totalPrice.innerHTML = this.getTotalPrice();
        } else {
          cartModalMain.innerHTML = this.getCartListHtml(data);
          totalPrice.innerHTML = this.getTotalPrice();
        }
      },

      //   Filter Product Type
      filterProductType(type) {
        return this.list.filter((product) => {
          return product.type.match(type);
        });
      },

      //   Map data of cart list and listHeart to list
      mapList() {
        // Set Products list
        this.list = data.map((product) => {
          const foundIdFromDataHeart = this.listHeart.find((heart) => {
            return heart === product.id;
          });
          const foundIdFromDataCart = this.listCart.find((cart) => {
            return cart.id === product.id;
          });

          const inputData = new Product(
            product.id,
            product.name,
            product.price,
            product.price,
            product.backCamera,
            product.frontCamera,
            product.img,
            product.desc,
            product.type,
            foundIdFromDataHeart,
            foundIdFromDataCart
          );

          return inputData;
        });
      },

      //   -----Local Storage
      //   Set Heart Local Storage
      setHeartLocalStorage() {
        const stringValue = JSON.stringify(this.listHeart);
        localStorage.setItem(LOCAL_STORAGE_HEART, stringValue);
      },

      // Set Cart Local Storage
      setCartLocalStorage() {
        const stringValue = JSON.stringify(this.listCart);
        localStorage.setItem(LOCAL_STORAGE_CART, stringValue);
      },

      //   Start
      start() {
        this.mapList();

        // Base Render
        this.renderToProductsList(this.list);
        this.renderToCartList(this.list);
        this.updateAmountCart();

        this.handleDomEvent();
      },
    };

    // Start App
    products.start();
  })
  .catch((err) => console.log(err));
