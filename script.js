// Cart management
const cart = JSON.parse(localStorage.getItem("cart")) || []

// Update cart badge on all pages
function updateCartBadge() {
  const cartBadges = document.querySelectorAll(".cart-link")
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  cartBadges.forEach((badge) => {
    badge.textContent = `Cart (${cartCount})`
  })
}

// Add to cart
function addToCart(productName, price) {
  const quantity = document.getElementById("quantity") ? Number.parseInt(document.getElementById("quantity").value) : 1

  const existingItem = cart.find((item) => item.name === productName)

  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    cart.push({ name: productName, price: price, quantity: quantity })
  }

  localStorage.setItem("cart", JSON.stringify(cart))
  updateCartBadge()
  alert(`${productName} added to cart!`)
}

// Quantity controls
function increaseQty() {
  const input = document.getElementById("quantity")
  input.value = Number.parseInt(input.value) + 1
}

function decreaseQty() {
  const input = document.getElementById("quantity")
  if (Number.parseInt(input.value) > 1) {
    input.value = Number.parseInt(input.value) - 1
  }
}

// Remove from cart
function removeFromCart(index) {
  cart.splice(index, 1)
  localStorage.setItem("cart", JSON.stringify(cart))
  displayCart()
}

// Update quantity
function updateQuantity(index, quantity) {
  if (quantity > 0) {
    cart[index].quantity = Number.parseInt(quantity)
    localStorage.setItem("cart", JSON.stringify(cart))
    displayCart()
  }
}

// Display cart items
function displayCart() {
  const cartItemsContainer = document.getElementById("cart-items")
  if (!cartItemsContainer) return

  if (cart.length === 0) {
    cartItemsContainer.innerHTML =
      '<tr class="empty-cart"><td colspan="5">Your cart is empty. <a href="shop.html">Continue shopping</a></td></tr>'
    updateOrderSummary()
    return
  }

  let html = ""
  cart.forEach((item, index) => {
    html += `
      <tr>
        <td>${item.name}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td><input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${index}, this.value)"></td>
        <td>$${(item.price * item.quantity).toFixed(2)}</td>
        <td><button onclick="removeFromCart(${index})" class="btn btn-outline" style="padding: 0.5rem 1rem;">Remove</button></td>
      </tr>
    `
  })

  cartItemsContainer.innerHTML = html
  updateOrderSummary()
}

// Update order summary
function updateOrderSummary() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.1
  const shipping = subtotal >= 100 ? 0 : 10
  const total = subtotal + tax + shipping

  const subtotalEl = document.getElementById("subtotal")
  const taxEl = document.getElementById("tax")
  const shippingEl = document.getElementById("shipping")
  const totalEl = document.getElementById("total")

  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`
  if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`
  if (shippingEl) shippingEl.textContent = shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`
  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`
}

// Contact form
function handleSubmit(event) {
  event.preventDefault()
  alert("Thank you for your message! We will get back to you soon.")
  event.target.reset()
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge()
  displayCart()
})
