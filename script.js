// Data menu (mudah diedit: ubah nama dan harga di sini)
const menuData = {
    makanan: [
        { name: "Paket Iga Bakar (sudah termasuk nasi, tempe, sambel, es teh)", price: 30000 },
        { name: "Paket Ikan Kerapu + nasi", price: 20000 },
        { name: "Paket Gurame Bakar", price: 50000 }
    ],
    minuman: [
        { name: "Es Teh", price: 5000 },
        { name: "Matcha Latte Small", price: 20000 },
        { name: "Matcha Latte Large", price: 30000 }
    ]
};

// Keranjang (disimpan di localStorage)
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Fungsi navigasi antar section
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    if (sectionId === 'menu') renderMenu();
    if (sectionId === 'cart') renderCart();
    if (sectionId === 'checkout') renderCheckout();
}

// Render menu
function renderMenu() {
    const menuList = document.getElementById('menu-list');
    menuList.innerHTML = '<h3>Makanan</h3>';
    menuData.makanan.forEach(item => {
        menuList.innerHTML += `
            <div class="menu-item">
                <h4>${item.name}</h4>
                <p>Rp ${item.price.toLocaleString()}</p>
                <button onclick="addToCart('${item.name}', ${item.price})">Tambah ke Keranjang</button>
            </div>
        `;
    });
    menuList.innerHTML += '<h3>Minuman</h3>';
    menuData.minuman.forEach(item => {
        menuList.innerHTML += `
            <div class="menu-item">
                <h4>${item.name}</h4>
                <p>Rp ${item.price.toLocaleString()}</p>
                <button onclick="addToCart('${item.name}', ${item.price})">Tambah ke Keranjang</button>
            </div>
        `;
    });
}

// Tambah ke keranjang
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    saveCart();
    renderCart();
}

// Render keranjang
function renderCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        cartItems.innerHTML += `
            <div class="cart-item">
                <span>${item.name} (Rp ${item.price.toLocaleString()}) x ${item.quantity}</span>
                <div>
                    <button onclick="changeQuantity(${index}, 1)">+</button>
                    <button onclick="changeQuantity(${index}, -1)">-</button>
                    <button onclick="removeItem(${index})">Hapus</button>
                </div>
            </div>
        `;
    });
    document.getElementById('total-price').textContent = total.toLocaleString();
}

// Ubah jumlah item
function changeQuantity(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    saveCart();
    renderCart();
}

// Hapus item
function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
    renderCart();
}

// Simpan keranjang ke localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Render checkout
function renderCheckout() {
    const checkoutList = document.getElementById('checkout-list');
    checkoutList.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
        checkoutList.innerHTML += `<p>${item.name} x ${item.quantity} - Rp ${(item.price * item.quantity).toLocaleString()}</p>`;
    });
    document.getElementById('checkout-total').textContent = total.toLocaleString();
}

// Pesan sekarang (kirim ke WhatsApp)
function placeOrder() {
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const notes = document.getElementById('notes').value;
    if (!name || !address) {
        alert('Nama dan alamat wajib diisi!');
        return;
    }
    let message = `Halo Aneka Sambel, saya ${name} ingin memesan:\n`;
    cart.forEach(item => {
        message += `- ${item.name} x ${item.quantity} (Rp ${(item.price * item.quantity).toLocaleString()})\n`;
    });
    message += `Total: Rp ${document.getElementById('checkout-total').textContent}\nAlamat: ${address}`;
    if (notes) message += `\nCatatan: ${notes}`;
    const whatsappUrl = `https://wa.me/6282223116787?text=${encodeURIComponent(message)}`; // Ganti nomor WA di sini
    window.open(whatsappUrl, '_blank');
}

// Inisialisasi
document.addEventListener('DOMContentLoaded', () => {
    showSection('home');

});
