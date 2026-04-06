
// Add to cart
function addToCart(id, name, price) {
  const cart = getCart();

  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      id,
      name,
      price,
      quantity: 1
    });
  }

  saveCart(cart);
  updateCartCount();
  alert(name + " added to cart!");
}


function checkout() {
    alert("Next step: Payment integration 🔥");
}



async function loadProducts() {
    const response = await fetch("products.json");
    const products = await response.json();

    const container = document.getElementById("product-list");

    if (!container) return;

    container.innerHTML = "";

    products.forEach(product => {
        container.innerHTML += `
            <div class="product" onclick="viewProduct(${product.id})">
                <img src="${product.image}" alt="">
                <h5>${product.name}</h5>
                <h4>R${product.price}</h4>
                <button onclick="viewProduct(${product.id})">
                    View Product
                </button>
            </div>
        `;
    });
}

loadProducts();

async function viewProduct(id) {
    const response = await fetch("products.json");
    const products = await response.json();

    const product = products.find(p => p.id === id);

    localStorage.setItem("selectedProduct", JSON.stringify(product));

    window.location.href = "product.html";
}

function loadProduct() {
  const productImg = document.getElementById("product-img");
  const productName = document.getElementById("product-name");
  const productPrice = document.getElementById("product-price");
  const productDescription = document.getElementById("product-description");
  const sizeSelect = document.getElementById("size");

  if (!productImg || !productName || !productPrice || !productDescription || !sizeSelect) {
    return;
  }

  const product = JSON.parse(localStorage.getItem("selectedProduct"));

  if (!product) return;

  productImg.src = product.image;
  productName.textContent = product.name;
  productPrice.textContent = "R" + product.price;
  productDescription.textContent = product.description;

  sizeSelect.innerHTML = "<option>Select Size</option>";

  if (Array.isArray(product.sizes)) {
    product.sizes.forEach(size => {
      sizeSelect.innerHTML += `<option>${size}</option>`;
    });
  }
}
loadProduct()

function addProductToCart() {
  const product = JSON.parse(localStorage.getItem("selectedProduct"));
  const size = document.getElementById("size").value;

  if (size === "Select Size") {
    alert("Please select a size");
    return;
  }

  const cart = getCart();

  const existing = cart.find(
    item => item.id === product.id && item.size === size
  );

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      ...product,
      size,
      quantity: 1
    });
  }

  saveCart(cart);
  updateCartCount();

  alert("Added to cart!");
}

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const cartCount = document.getElementById("cart-count");
  if (cartCount) {
    cartCount.innerText = count;
  }
}

function loadCartPage() {
  const cartItemsDiv = document.getElementById("cart-items");
  const emptyCartDiv = document.getElementById("empty-cart");
  const subtotalEl = document.getElementById("summary-subtotal");
  const totalEl = document.getElementById("summary-total");

  if (!cartItemsDiv || !emptyCartDiv || !subtotalEl || !totalEl) {
    console.log("Cart summary elements not found on this page.");
    return;
  }

  const cart = getCart();
  cartItemsDiv.innerHTML = "";

  if (cart.length === 0) {
    emptyCartDiv.style.display = "block";
    cartItemsDiv.innerHTML = "";
    subtotalEl.innerText = "R0";
    totalEl.innerText = "R0";
    updateCartCount();
    return;
  }

  emptyCartDiv.style.display = "none";

  let subtotal = 0;

  cart.forEach((item, index) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 1;
    const itemTotal = price * quantity;

    subtotal += itemTotal;

    cartItemsDiv.innerHTML += `
      <div class="cart-item">
        <img class="cart-item-image" src="${item.image || 'images/placeholder.jpg'}" alt="${item.name}">
        
        <div class="cart-item-details">
          <h4>${item.name}</h4>
          <div class="cart-meta">
            ${item.size ? `Size: ${item.size}` : "Standard"}
          </div>
          <div class="cart-price">R${price}</div>

          <div class="cart-actions">
            <div class="qty-box">
              <button onclick="decreaseQuantity(${index})">−</button>
              <span>${quantity}</span>
              <button onclick="increaseQuantity(${index})">+</button>
            </div>

            <button class="remove-btn" onclick="removeCartItem(${index})">Remove</button>
          </div>
        </div>

        <div class="cart-item-total">R${itemTotal}</div>
      </div>
    `;
  }); 

  subtotalEl.textContent = `R${subtotal}`;
  totalEl.textContent = `R${subtotal}`;
  updateCartCount();
}

function increaseQuantity(index) {
  const cart = getCart();
  cart[index].quantity = (Number(cart[index].quantity) || 1) + 1;
  saveCart(cart);
  loadCartPage();
}

function decreaseQuantity(index) {
  const cart = getCart();

  if ((Number(cart[index].quantity) || 1) > 1) {
    cart[index].quantity -= 1;
  } else {
    cart.splice(index, 1);
  }

  saveCart(cart);
  loadCartPage();
}

function removeCartItem(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  loadCartPage();
}

function checkout() {
  alert("Next step: checkout and payment integration.");
}

document.addEventListener("DOMContentLoaded", function () {
  loadCartPage();
  updateCartCount();
});
