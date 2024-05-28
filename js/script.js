document.addEventListener("DOMContentLoaded", function () {
    // Search bar functionality
    const searchInput = document.querySelector('.search-input');
    const cards = document.querySelectorAll('.card');

    searchInput.addEventListener('input', function () {
        const searchTerm = this.value.trim().toLowerCase();

        cards.forEach(card => {
            const title = card.querySelector('.card-title').textContent.trim().toLowerCase();
            const price = card.querySelector('.card-text').textContent.trim().toLowerCase();

            if (title.includes(searchTerm) || price.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // Function to add an item to the cart and dropdown
    function addToCart(itemName, itemPrice) {
        // Create the dropdown item element
        const listItem = document.createElement('div');
        listItem.classList.add('dropdown-item');
        listItem.innerHTML = `
            <h6 class="cart-item-name">${itemName}</h6>
            <div class="cart-item-quantity">Quantity: 1</div>
            <div class="cart-item-subtotal">R$ ${itemPrice.toFixed(2)}</div>
            <button class="add-item-btn">Adicionar</button>
            <button class="remove-item-btn">Remover</button>
        `;

        // Append the item to the dropdown child
        const dropdownMenu = document.querySelector('.dropdown-child2');
        dropdownMenu.appendChild(listItem);

        // Add event listener to the "Adicionar" button
        listItem.querySelector('.add-item-btn').addEventListener('click', function () {
            // Update cart data
            const cart = getCartData();
            const existingItem = cart.find(item => item.name === itemName);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ name: itemName, price: itemPrice, quantity: 1 });
            }
            storeCartData(cart);

            // Update quantity display in dropdown
            const quantityElement = this.parentElement.querySelector('.cart-item-quantity');
            quantityElement.textContent = `Quantity: ${existingItem ? existingItem.quantity : 1}`;

            // Update total cart value
            updateCartTotal();
        });

        // Add event listener to the "Remover" button
        listItem.querySelector('.remove-item-btn').addEventListener('click', function () {
            // Update cart data
            const cart = getCartData();
            const itemName = this.parentElement.querySelector('.cart-item-name').textContent.trim();
            const itemIndex = cart.findIndex(item => item.name === itemName);

            if (itemIndex > -1) {
                cart.splice(itemIndex, 1);
                storeCartData(cart);
                this.parentElement.remove(); // Remove the dropdown item
            }

            // Update total cart value
            updateCartTotal();
        });
    }

    // Function to get cart data (replace with your actual implementation)
    function getCartData() {
        const cartData = localStorage.getItem('cart');
        if (cartData) {
            return JSON.parse(cartData); // Parse JSON string back to an array
        } else {
            return []; // Return empty array if no cart data exists
        }
    }

    // Function to store cart data (replace with your actual implementation)
    function storeCartData(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Function to calculate and update total cart value
    function updateCartTotal() {
        const cart = getCartData();
        let total = 0;
    
        cart.forEach(item => {
            total += item.price * item.quantity;
        });
    
        // Update the element displaying the total cart value
        const cartTotalElement = document.getElementById('cart-total');
        cartTotalElement.textContent = `Total: R$ ${total.toFixed(2)}`; // Format total to two decimal places
    
        // Show or hide cart total based on cart content
        if (cart.length > 0) {
            cartTotalElement.style.display = 'block';
        } else {
            cartTotalElement.style.display = 'none';
        }
    }

    // Event listeners for adding items to cart
    const addToCartButtons = document.querySelectorAll('.icon__ad');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Get product information from the card element (assuming parent)
            const card = this.closest('.card');
            const itemName = card.querySelector('.card-title').textContent.trim();
            const itemPrice = parseFloat(card.querySelector('.card-text').textContent.trim().slice(2)); // Assuming price starts with 'R$'

            // Call the addToCart function with retrieved product information
            addToCart(itemName, itemPrice);
        });
    });

    // Call updateCartTotal initially to show/hide cart total based on cart content
    updateCartTotal();
});
