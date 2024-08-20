// Selectors
const nextBtns = document.querySelectorAll(".next-btn");
const prevBtns = document.querySelectorAll(".prev-btn");
const formSteps = document.querySelectorAll(".form-step");
const progressBar = document.getElementById("progressBar");
const regForm = document.getElementById("regForm");

let currentStep = 0;

// Event Listeners for Next and Previous Buttons
nextBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (validateForm()) {
      changeStep(1);
    }
  });
});

prevBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    changeStep(-1);
  });
});

// Change Form Step
function changeStep(step) {
  formSteps[currentStep].classList.remove("active");
  currentStep += step;
  formSteps[currentStep].classList.add("active");
  updateProgressBar();
}

// Update Progress Bar and Text
function updateProgressBar() {
  const progressPercentage = ((currentStep + 1) / formSteps.length) * 100;
  progressBar.style.width = `${progressPercentage}%`;
  document.getElementById("progressText").innerText = `Step ${
    currentStep + 1
  } of ${formSteps.length}`;
}

// Validate Form Inputs
function validateForm() {
  const inputs = formSteps[currentStep].querySelectorAll(
    "input, select, textarea"
  );
  let isValid = true;

  inputs.forEach((input) => {
    if (!input.checkValidity()) {
      isValid = false;
      showValidationError(input);
    } else {
      clearValidationError(input);
    }
  });

  return isValid;
}

// Show Validation Error
function showValidationError(input) {
  input.classList.add("is-invalid");
  const errorMessage = input.parentElement.querySelector(".invalid-feedback");
  if (!errorMessage) {
    const error = document.createElement("div");
    error.className = "invalid-feedback";
    error.innerText = getErrorMessage(input);
    input.parentElement.appendChild(error);
  }
}

// Clear Validation Error
function clearValidationError(input) {
  input.classList.remove("is-invalid");
  const errorMessage = input.parentElement.querySelector(".invalid-feedback");
  if (errorMessage) {
    errorMessage.remove();
  }
}

// Get Custom Error Message Based on Input Type
function getErrorMessage(input) {
  switch (input.type) {
    case "text":
      return "Please fill out this field.";
    case "email":
      return "Please enter a valid email address.";
    case "tel":
      return "Please enter a valid 10-digit phone number.";
    case "date":
      return "Please select a valid date.";
    case "file":
      return "Please upload a file.";
    default:
      return "This field is required.";
  }
}

// Form Submission
regForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (validateForm()) {
    alert("Registration Successful!");
    // Here you can submit the form data to your backend
    // Example: regForm.submit();
  } else {
    alert("Please fill out all required fields correctly.");
  }
});

document.querySelectorAll("input").forEach((input) => {
  input.addEventListener("input", () => {
    if (!input.checkValidity()) {
      showValidationError(input);
    } else {
      clearValidationError(input);
    }
  });
});

const gradeSelect = document.getElementById("grade");
const additionalQuestions = document.getElementById("additionalQuestions");

gradeSelect.addEventListener("change", () => {
  if (gradeSelect.value === "12th") {
    additionalQuestions.style.display = "block";
  } else {
    additionalQuestions.style.display = "none";
  }
});

// Initialize tooltips
$(function () {
  $('[data-toggle="tooltip"]').tooltip();
});

// Auto-save form data to local storage
regForm.addEventListener("input", () => {
  const formData = new FormData(regForm);
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });
  localStorage.setItem("regFormData", JSON.stringify(data));
});

// Restore form data on page load
window.addEventListener("load", () => {
  const savedData = JSON.parse(localStorage.getItem("regFormData"));
  if (savedData) {
    Object.keys(savedData).forEach((key) => {
      const input = regForm.elements[key];
      if (input) input.value = savedData[key];
    });
  }
});

window.addEventListener("beforeunload", (e) => {
  if (regForm.checkValidity() === false) {
    e.preventDefault();
    e.returnValue = "You have unsaved changes! Are you sure you want to leave?";
  }
});

// Final Step Review
function generateReview() {
  const reviewSection = document.getElementById("reviewSection");
  let reviewContent = "<h3>Review Your Details</h3>";
  const formData = new FormData(regForm);
  formData.forEach((value, key) => {
    reviewContent += `<p><strong>${key}:</strong> ${value}</p>`;
  });
  reviewSection.innerHTML = reviewContent;
}

// Trigger review on the last step
nextBtns[nextBtns.length - 1].addEventListener("click", generateReview);
