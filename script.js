// Bus booking system with seat selection, promo codes, and form validation

// Global variables
let selectedSeats = [];
let seatPrice = 550; // Per seat price
let totalSeats = 40; // Total seats available
let seatsLeft = 4; // Seats left counter (decreases when selected)

// Initialize the booking system
document.addEventListener("DOMContentLoaded", function () {
  initializeSeats();
  updateSeatCounter();
  initializeEventListeners();
});

// Initialize seat grid
function initializeSeats() {
  const seatGrid = document.getElementById("seatGrid");
  if (!seatGrid) return;

  seatGrid.innerHTML = "";

  // Create 40 seats (10 rows x 4 seats)
  for (let i = 1; i <= totalSeats; i++) {
    const seatDiv = document.createElement("div");
    seatDiv.className =
      "seat cursor-pointer p-2 border rounded transition-colors will-change-transform";
    seatDiv.dataset.seatNumber = i;

    // Make some seats unavailable (random)
    const isAvailable = Math.random() > 0.5; // 60% available

    if (isAvailable) {
      seatDiv.className += " bg-gray-100 hover:bg-gray-200 border-gray-300";
      seatDiv.innerHTML = `
                <img src="./images/seat-gray.png" alt="seat" class="w-6 h-6 mx-auto mb-1" onerror="this.style.display='none'">
                <span class="text-xs">${i}</span>
            `;
    } else {
      seatDiv.className +=
        " bg-red-100 border-red-300 cursor-not-allowed opacity-50";
      seatDiv.innerHTML = `
                <img src="./images/seat-red.png" alt="seat" class="w-6 h-6 mx-auto mb-1" onerror="this.style.display='none'">
                <span class="text-xs">seat number ${i} is already booked</span>
            `;
      seatDiv.dataset.unavailable = "true";
    }

    // Add click event for available seats
    if (isAvailable) {
      seatDiv.addEventListener("click", function () {
        toggleSeatSelection(this);
      });
    }

    seatGrid.appendChild(seatDiv);
  }
}

// Toggle seat selection
function toggleSeatSelection(seatElement) {
  const seatNumber = seatElement.dataset.seatNumber;

  if (seatElement.dataset.unavailable === "true") {
    return; // Can't select unavailable seats
  }

  if (selectedSeats.includes(seatNumber)) {
    // Deselect seat
    selectedSeats = selectedSeats.filter((seat) => seat !== seatNumber);
    seatElement.className = seatElement.className.replace(
      "bg-green-500 text-white",
      "bg-gray-100 hover:bg-gray-200"
    );
    seatElement.querySelector("img").src = seatElement
      .querySelector("img")
      .src.replace("seat-green-filled.png", "seat-gray.png");

    // Increase seats left when deselecting
    seatsLeft++;
  } else {
    // Check if we have seats left
    if (seatsLeft <= 0) {
      alert("you can buy maximum 4 seats!");
      return;
    }

    // Select seat (max 4 seats per booking)
    if (selectedSeats.length >= 4) {
      alert("You can select maximum 4 seats per booking");
      return;
    }

    selectedSeats.push(seatNumber);
    seatElement.className = seatElement.className.replace(
      "bg-gray-100 hover:bg-gray-200",
      "bg-green-500 text-white"
    );
    seatElement.querySelector("img").src = seatElement
      .querySelector("img")
      .src.replace("seat-gray.png", "seat-green-filled.png");

    // Add the pop animation
    seatElement.classList.add('animate-pop');
    setTimeout(() => seatElement.classList.remove('animate-pop'), 300);

    // Decrease seats left when selecting
    seatsLeft--;
  }

  updateSeatCounter();
  updateSeatSummary();
  calculateTotalPrice();
  updateNextButton();
}

// Update seat summary table
function updateSeatSummary() {
  const seatSummary = document.getElementById("seatSummary");
  if (!seatSummary) return;

  seatSummary.innerHTML = "";

  selectedSeats.forEach((seatNumber) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td class="py-2">Seat ${seatNumber}</td>
            <td class="py-2">Business</td>
            <td class="py-2 text-right">${seatPrice}</td>
        `;
    seatSummary.appendChild(row);
  });
}

// Calculate total price
function calculateTotalPrice() {
  const totalPriceElement = document.getElementById("total-price");
  const grandTotalElement = document.getElementById("grand-total");

  if (!totalPriceElement || !grandTotalElement) return;

  const total = selectedSeats.length * seatPrice;

  // Update total price
  totalPriceElement.textContent = total;

  // Reset grand total (remove any previous discounts)
  grandTotalElement.textContent = `BDT ${total}`;

  // Remove discount info when seats change
  const existingDiscount = document.querySelector("#discount-info");
  if (existingDiscount) {
    existingDiscount.remove();
  }

  // Show coupon section again when seats change
  showCouponSection();

  // Clear promo input when seats change
  const promoInput = document.querySelector(
    'input[placeholder="Have any coupon?"]'
  );
  if (promoInput) {
    promoInput.value = "";
  }
}

// Update seat counter
function updateSeatCounter() {
  const seatLeftElement = document.getElementById("seatleft");
  if (seatLeftElement) {
    seatLeftElement.textContent = seatsLeft;

    // Update the visual indicator based on seats left
    const seatsLeftDiv = seatLeftElement.closest(".bg-green-100");
    if (seatsLeftDiv) {
      if (seatsLeft === 0) {
        seatsLeftDiv.className = seatsLeftDiv.className.replace(
          "bg-green-100 text-green-700",
          "bg-red-100 text-red-700"
        );
        seatLeftElement.textContent = "No";
      } else if (seatsLeft <= 2) {
        seatsLeftDiv.className = seatsLeftDiv.className.replace(
          "bg-green-100 text-green-700",
          "bg-yellow-100 text-yellow-700"
        );
        seatsLeftDiv.className = seatsLeftDiv.className.replace(
          "bg-red-100 text-red-700",
          "bg-yellow-100 text-yellow-700"
        );
      } else {
        seatsLeftDiv.className = seatsLeftDiv.className.replace(
          "bg-yellow-100 text-yellow-700",
          "bg-green-100 text-green-700"
        );
        seatsLeftDiv.className = seatsLeftDiv.className.replace(
          "bg-red-100 text-red-700",
          "bg-green-100 text-green-700"
        );
      }
    }
  }
}

// Shows inline messages for coupon feedback
function showCouponMessage(message, isSuccess) {
  const messageElement = document.getElementById("coupon-message");
  if (!messageElement) return;

  messageElement.textContent = message;
  // Reset classes
  messageElement.classList.remove("text-green-500", "text-red-500");

  if (isSuccess) {
    messageElement.classList.add("text-green-500");
  } else {
    messageElement.classList.add("text-red-500");
  }

  messageElement.classList.remove("opacity-0");

  // Hide message after 3 seconds
  setTimeout(() => {
    messageElement.classList.add("opacity-0");
  }, 3000);
}

// Promo code functionality
function applyPromoCode() {
  const promoInput = document.querySelector(
    'input[placeholder="Have any coupon?"]'
  );
  const promoCode = promoInput.value.trim().toUpperCase();
  const totalPrice =
    parseInt(document.getElementById("total-price").textContent) || 0;

  if (totalPrice === 0) {
    showCouponMessage("Please select seats first!", false);
    return;
  }

  let discount = 0;
  let discountPercent = 0;

  // Check promo codes
  if (promoCode === "NEW15") {
    discountPercent = 15;
    discount = Math.round((totalPrice * 15) / 100);
  } else if (promoCode === "COUPLE20" || promoCode === "COUPLE 20") {
    discountPercent = 20;
    discount = Math.round((totalPrice * 20) / 100);
  } else if (promoCode !== "") {
    showCouponMessage("Invalid promo code!", false);
    return;
  } else {
    showCouponMessage("Please enter a promo code.", false);
    return;
  }

  if (discount > 0) {
    const grandTotal = totalPrice - discount;

    // Update grand total
    const grandTotalElement = document.getElementById("grand-total");
    if (grandTotalElement) {
      grandTotalElement.textContent = `BDT ${grandTotal}`;
    }

    // Show discount info
    showDiscountInfo(discountPercent, discount);

    // Hide coupon section
    hideCouponSection();

    showCouponMessage(`Success! ${discountPercent}% discount applied.`, true);
  }
}

// Show/Hide coupon section
function hideCouponSection() {
  const couponDiv = document.querySelector(
    ".bg-white.rounded-xl.text-center.flex.items-center"
  );
  if (couponDiv) {
    couponDiv.style.display = "none";
  }
}

function showCouponSection() {
  const couponDiv = document.querySelector(
    ".bg-white.rounded-xl.text-center.flex.items-center"
  );
  if (couponDiv) {
    couponDiv.style.display = "flex";
  }
}

// Show discount information
function showDiscountInfo(percent, amount) {
  // Remove existing discount info if any
  const existingDiscount = document.querySelector("#discount-info");
  if (existingDiscount) {
    existingDiscount.remove();
  }

  // Find the total price div
  const totalPriceDiv = document.querySelector(".flex.justify-between.mb-2");
  const grandTotalDiv = document
    .getElementById("grand-total")
    .closest(".flex.justify-between.font-semibold.mt-4");

  if (totalPriceDiv && grandTotalDiv) {
    // Create discount info
    const discountDiv = document.createElement("div");
    discountDiv.id = "discount-info";
    discountDiv.className = "flex justify-between mb-2 text-green-600";
    discountDiv.innerHTML = `
            <p>Discount (${percent}%)</p>
            <p>- BDT ${amount}</p>
        `;

    // Insert before grand total
    grandTotalDiv.parentNode.insertBefore(discountDiv, grandTotalDiv);
  }
}

// Form validation and Next button control
function updateNextButton() {
  const nextButton = document.getElementById("nextButton");
  const passengerName = document.querySelector(
    'input[placeholder="Enter your name"]'
  );
  const phoneNumber = document.getElementById("phoneNumber");

  if (!nextButton || !passengerName || !phoneNumber) return;

  const hasSeats = selectedSeats.length > 0;
  const hasName = passengerName.value.trim().length > 0;
  const hasPhone = phoneNumber.value.trim().length > 0;

  if (hasSeats && hasName && hasPhone) {
    nextButton.disabled = false;
    nextButton.className = nextButton.className.replace(
      "bg-green-600 cursor-not-allowed opacity-50",
      "bg-green-600 hover:bg-green-700 cursor-pointer"
    );
  } else {
    nextButton.disabled = true;
    nextButton.className = nextButton.className.replace(
      "bg-green-600 hover:bg-green-700 cursor-pointer",
      "bg-green-600 cursor-not-allowed opacity-50"
    );
  }
}

// Initialize all event listeners
function initializeEventListeners() {
  // Apply button for promo code
  const applyButton = document.querySelector(
    ".bg-green-500.text-white.px-4.py-2.rounded-r-full"
  );
  if (applyButton) {
    applyButton.addEventListener("click", applyPromoCode);
  }

  // Allow Enter key to apply promo
  const promoInput = document.querySelector(
    'input[placeholder="Have any coupon?"]'
  );
  if (promoInput) {
    promoInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        applyPromoCode();
      }
    });
  }

  // Form validation listeners
  const passengerName = document.querySelector(
    'input[placeholder="Enter your name"]'
  );
  const phoneNumber = document.getElementById("phoneNumber");

  if (passengerName) {
    passengerName.addEventListener("input", updateNextButton);
  }

  if (phoneNumber) {
    phoneNumber.addEventListener("input", updateNextButton);
  }

  // Next button click
  const nextButton = document.getElementById("nextButton");
  if (nextButton) {
    nextButton.addEventListener("click", function () {
      if (!this.disabled) {
        handleNextButton();
      }
    });
  }
}

// Handle Next button click
function handleNextButton() {
  const passengerName = document
    .querySelector('input[placeholder="Enter your name"]')
    .value.trim();
  const phoneNumber = document.getElementById("phoneNumber").value.trim();
  const email = document
    .querySelector('input[placeholder="Enter your email"]')
    .value.trim();

  // Basic validation
  if (selectedSeats.length === 0) {
    alert("Please select at least one seat");
    return;
  }

  if (!passengerName) {
    alert("Please enter passenger name");
    return;
  }

  if (!phoneNumber) {
    alert("Please enter phone number");
    return;
  }

  // Phone number validation (basic)
  if (phoneNumber.length < 10) {
    alert("Please enter a valid phone number");
    return;
  }

  // Email validation (if provided)
  if (email && !email.includes("@")) {
    alert("Please enter a valid email address");
    return;
  }

  // Success - proceed to next step
  const bookingData = {
    seats: selectedSeats,
    passengerName: passengerName,
    phoneNumber: phoneNumber,
    email: email,
    totalAmount: document
      .getElementById("grand-total")
      .textContent.replace("BDT ", ""),
  };

  console.log("Booking Data:", bookingData);
  // alert('Booking successful! Proceeding to payment...');
  window.location.href = "./payment.html";

  // Here you would typically redirect to payment page or next step
  // window.location.href = 'payment.html';
}

// Preloader logic with a 5-second delay
const preloader = document.getElementById("preloader");

if (preloader) {
  preloader.style.transition = "opacity 0.5s ease";
  preloader.style.opacity = "0";
  setTimeout(() => {
    preloader.style.display = "none";
  }, 500); // Match transition duration
}
