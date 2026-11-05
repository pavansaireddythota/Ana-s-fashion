const CART_STORAGE_KEY = 'ana-store-cart';

function getCart() {
    try {
        const storedCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
        return Array.isArray(storedCart) ? storedCart.filter(item =>
            item && typeof item.name === 'string' && Number.isFinite(Number(item.price)) &&
            Number(item.price) >= 0 && Number.isInteger(Number(item.quantity)) && Number(item.quantity) > 0
        ).map(item => ({
            id: String(item.id || item.image || item.name),
            name: item.name,
            price: Number(item.price),
            quantity: Number(item.quantity),
            image: item.image || 'img/products/f1.jpg',
            size: item.size || ''
        })) : [];
    } catch (error) {
        console.warn('Cart data could not be read. Starting with an empty cart.', error);
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartCount();
}

function addToCart(name, price, quantity = 1, image = 'img/products/f1.jpg', size = '') {
    const itemPrice = Number(price);
    const itemQuantity = Number(quantity);
    if (!name || !Number.isFinite(itemPrice) || itemPrice < 0 || !Number.isInteger(itemQuantity) || itemQuantity < 1) {
        console.error('Invalid product name, price, or quantity.');
        return false;
    }

    const cart = getCart();
    const itemId = `${image}|${size}`;
    const existingItem = cart.find(item => item.id === itemId);
    if (existingItem) {
        existingItem.quantity += itemQuantity;
    } else {
        cart.push({ id: itemId, name, price: itemPrice, quantity: itemQuantity, image, size });
    }
    saveCart(cart);
    updateCart();
    showCartFeedback(`${name}${size ? ` (${size})` : ''} added to your cart.`);
    return true;
}

function addToCartFromCard(link) {
    const card = link.closest('.pro');
    if (!card) return;
    const image = card.querySelector('img');
    const nameElement = card.querySelector('.des h5');
    const priceElement = card.querySelector('.des h4');
    const price = priceElement ? Number((priceElement.textContent.match(/[\d,.]+/) || [])[0]?.replace(/,/g, '')) : NaN;
    if (image && nameElement) addToCart(nameElement.textContent.trim(), price, 1, image.getAttribute('src'));
}

function calculateTotal(cart) {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

function removeFromCart(index) {
    const cart = getCart();
    if (index < 0 || index >= cart.length) return;
    cart.splice(index, 1);
    saveCart(cart);
    updateCart();
}

function updateCartQuantity(index, quantity) {
    const cart = getCart();
    const parsedQuantity = Number(quantity);
    if (!cart[index]) return;
    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
        updateCart();
        return;
    }
    cart[index].quantity = parsedQuantity;
    saveCart(cart);
    updateCart();
}

function formatPrice(amount) {
    return `₹${Number(amount).toFixed(2)}`;
}

function updateCartCount() {
    const count = getCart().reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('[data-cart-count]').forEach(element => {
        element.textContent = String(count);
        element.hidden = count === 0;
    });
}

function updateCart() {
    const cartTableBody = document.getElementById('cart-table-body');
    const subtotalElement = document.getElementById('cart-subtotal');
    const totalElement = document.getElementById('cart-total');
    if (!cartTableBody || !totalElement) return;

    const cart = getCart();
    const total = calculateTotal(cart);
    cartTableBody.replaceChildren();

    if (cart.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 6;
        cell.className = 'empty-cart-cell';
        cell.innerHTML = '<div class="empty-cart"><i class="fa-solid fa-bag-shopping"></i><h3>Your cart is empty</h3><p>Find something you love and it will show up here.</p><a class="normal" href="shop.html">Browse the shop</a></div>';
        row.appendChild(cell);
        cartTableBody.appendChild(row);
    } else {
        cart.forEach((item, index) => {
            const row = document.createElement('tr');
            const removeCell = document.createElement('td');
            const removeButton = document.createElement('button');
            removeButton.type = 'button';
            removeButton.className = 'remove-item';
            removeButton.setAttribute('aria-label', `Remove ${item.name}`);
            removeButton.innerHTML = '<i class="fa-regular fa-circle-xmark"></i>';
            removeButton.addEventListener('click', () => removeFromCart(index));
            removeCell.appendChild(removeButton);

            const imageCell = document.createElement('td');
            const image = document.createElement('img');
            image.src = item.image;
            image.alt = item.name;
            image.loading = 'lazy';
            imageCell.appendChild(image);

            const productCell = document.createElement('td');
            productCell.className = 'cart-product-name';
            productCell.textContent = item.name + (item.size ? ` · Size ${item.size}` : '');

            const priceCell = document.createElement('td');
            priceCell.textContent = formatPrice(item.price);

            const quantityCell = document.createElement('td');
            const quantityInput = document.createElement('input');
            quantityInput.type = 'number';
            quantityInput.min = '1';
            quantityInput.step = '1';
            quantityInput.value = String(item.quantity);
            quantityInput.setAttribute('aria-label', `Quantity for ${item.name}`);
            quantityInput.addEventListener('change', () => updateCartQuantity(index, quantityInput.value));
            quantityCell.appendChild(quantityInput);

            const lineTotalCell = document.createElement('td');
            lineTotalCell.className = 'cart-line-total';
            lineTotalCell.textContent = formatPrice(item.price * item.quantity);
            row.append(removeCell, imageCell, productCell, priceCell, quantityCell, lineTotalCell);
            cartTableBody.appendChild(row);
        });
    }
    if (subtotalElement) subtotalElement.textContent = formatPrice(total);
    totalElement.textContent = formatPrice(total);
    updateCartCount();
}

function showCartFeedback(message) {
    let notice = document.getElementById('cart-notice');
    if (!notice) {
        notice = document.createElement('div');
        notice.id = 'cart-notice';
        notice.className = 'cart-notice';
        notice.setAttribute('role', 'status');
        document.body.appendChild(notice);
    }
    notice.textContent = message;
    notice.classList.add('visible');
    window.clearTimeout(showCartFeedback.timeout);
    showCartFeedback.timeout = window.setTimeout(() => notice.classList.remove('visible'), 2400);
}

document.addEventListener('DOMContentLoaded', () => {
    const nav = document.getElementById('navbar');
    const bar = document.getElementById('bar');
    const closeButton = document.getElementById('close');
    if (bar && nav) bar.addEventListener('click', () => nav.classList.toggle('active'));
    if (closeButton && nav) closeButton.addEventListener('click', () => nav.classList.remove('active'));

    document.querySelectorAll('.pro .cart').forEach(link => {
        link.removeAttribute('onclick');
        link.addEventListener('click', event => {
            event.preventDefault();
            addToCartFromCard(link);
        });
    });

    const detailAddButton = document.getElementById('detail-add-to-cart');
    if (detailAddButton) {
        detailAddButton.addEventListener('click', () => {
            const size = document.getElementById('select')?.value || '';
            const quantityInput = document.getElementById('detail-quantity');
            const quantity = Number(quantityInput?.value || 1);
            if (!size) {
                showCartFeedback('Please select a size first.');
                document.getElementById('select')?.focus();
                return;
            }
            if (!Number.isInteger(quantity) || quantity < 1) {
                showCartFeedback('Enter a quantity of 1 or more.');
                quantityInput?.focus();
                return;
            }
            addToCart("Men's Fashion T-Shirt", 850, quantity, document.getElementById('MainImg')?.getAttribute('src'), size);
        });
    }

    const mainImage = document.getElementById('MainImg');
    if (mainImage) {
        document.querySelectorAll('.small-img').forEach(thumbnail => {
            thumbnail.addEventListener('click', () => { mainImage.src = thumbnail.src; });
        });
    }

    const checkoutButton = document.getElementById('checkout-button');
    if (checkoutButton) checkoutButton.addEventListener('click', () => {
        if (getCart().length) window.location.href = 'payment.html';
        else showCartFeedback('Your cart is empty. Add a product to continue.');
    });

    const paymentTotal = document.getElementById('payment-total');
    const paymentItemCount = document.getElementById('payment-item-count');
    const paymentForm = document.getElementById('payment-demo-form');
    const paymentButton = document.getElementById('payment-demo-button');
    const paymentStatus = document.getElementById('payment-status');
    if (paymentTotal && paymentItemCount && paymentForm && paymentButton && paymentStatus) {
        const paymentCart = getCart();
        const itemCount = paymentCart.reduce((total, item) => total + item.quantity, 0);
        paymentTotal.textContent = formatPrice(calculateTotal(paymentCart));
        paymentItemCount.textContent = `${itemCount} ${itemCount === 1 ? 'item' : 'items'}`;
        if (itemCount === 0) {
            paymentButton.disabled = true;
            paymentStatus.textContent = 'Your cart is empty. Add an item before continuing.';
            paymentStatus.classList.add('is-visible');
        }
        paymentForm.addEventListener('submit', event => {
            event.preventDefault();
            if (getCart().length === 0) return;
            const selectedMethod = paymentForm.querySelector('input[name="payment-method"]:checked');
            const methodName = selectedMethod?.value === 'bhim' ? 'BHIM / UPI' : 'UPI app';
            paymentStatus.textContent = `${methodName} payment integration is under development. No payment was initiated and no money was charged.`;
            paymentStatus.classList.add('is-visible');
        });
    }

    updateCart();
});
