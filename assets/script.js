let currentTab = 0; // Current tab is set to be the first tab (0)
const loginButton = document.querySelector(".loginbutton");
const form = document.querySelector(".log_form");
let errorsData = null;
const nextButton = document.querySelector("#nextBtn");
const prevButton = document.querySelector("#prevBtn");
const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
const regForm = document.querySelector("#regForm");
let currentStepNavItemId = 0;
const stepNavItems = document.querySelectorAll(".step");

function showTab(n) {
  //will display the specified step of the form
  let x = document.querySelectorAll(".tab");

  x[n].classList.add("active");
  if (n == 0) {
    document.querySelector("#prevBtn").style.display = "none";
  } else {
    document.querySelector("#prevBtn").style.display = "inline";
  }
  if (currentTab === (x.length - 1)) {
    nextButton.innerText = "Start Now";
  } else {
    nextButton.innerText = "Next Step";
  }
  // run a function that displays the correct step indicator
  fixStepIndicator(n);
}

function nextPrev(n) {
  // This function will figure out which tab to display
  let x = document.querySelectorAll(".tab");
  const errorField = x[currentTab].querySelector(".step-error");
  const currentField = x[currentTab].querySelector(".step-item")
  const stepName = currentField.getAttribute("name");
  getData().then(() => {
    //validtion
    if (stepName === "email") {
      const emailValid = EMAIL_REGEXP.test(currentField.value) ? true : false;
      if (!emailValid) {
        errorField.innerText = errorsData.errors[stepName];
        errorField.classList.add("active");
        return;
      }
      errorField.classList.remove("active");
    }
    if (!currentField.value.length) {
      errorField.innerText = errorsData.errors[stepName];
      errorField.classList.add("active");
      return;
    }
    document.querySelector(".tab.active").classList.remove("active");
    errorField.classList.remove("active");

    // Hide the current tab:
    // Increase or decrease the current tab by 1:
    currentTab = currentTab + n;
    document.querySelector('body').dataset.currentStep = currentTab;

    if (currentTab >= x.length) {
      //submitted form for a correct step
      regForm.submit();
      return false;
    }
    // Otherwise, display the correct step:
    showTab(currentTab);
  });
}

//change step regform 
nextButton.addEventListener("click", () => nextPrev(1));
prevButton.addEventListener("click", () => nextPrev(-1));
// end step

function validateLoginForm(e) {
  // This function will validate the login form fields
  e.preventDefault();

  const inputEmailValue = document.querySelector("#email").value;
  const emailValid = EMAIL_REGEXP.test(inputEmailValue) ? true : false;
  const emailWarning = document.querySelector(".warning");
  emailValid ? form.submit() : emailWarning.classList.add("warning-active");
}

form.addEventListener("submit", validateLoginForm);

/*regform*/
const stepLabels = document.querySelectorAll(".tab-label");
stepLabels.forEach((label) => {
  label.addEventListener("click", function (e) {
    this.closest(".tab-item").classList.add("active-label");
    this.closest(".tab-item").querySelector(".custom-select")?.classList.remove("opened-select");
  });
})

//get data from api server
async function getData() {
  const response = await fetch("https://run.mocky.io/v3/f6ca495a-0a08-40de-9889-e73d49d011d2");
  errorsData = await response.json();
}


// Add / remove the "active" class of all steps nav...
function fixStepIndicator(n) {
  if (n >= currentStepNavItemId) {
    stepNavItems[n].className += " active";
    currentStepNavItemId = n;
  } else {
    stepNavItems[currentStepNavItemId].classList.remove("active");
    currentStepNavItemId -= 1;
  }
}

///Custom Select///
const selects = document.querySelectorAll(".custom-select");
selects.forEach((select) => {
  const originSelect = select.previousElementSibling;
  select.addEventListener("click", function (e) {
    this.closest(".tab-item").classList.toggle("opened-select");
  });
  select.querySelectorAll("li").forEach((li) => {
    li.addEventListener("click", (li) => {
      originSelect.value = li.target.dataset.value;
      select.querySelector(".selected-option").innerText = li.target.dataset.value;
      select.closest(".tab-item").classList.add("selected-select");
    });
  });
})

//Hide dropdown menu after clicking anywhere
document.addEventListener("click", (e) => {
  if (e.target.closest('.custom-select') === null) {
    document.querySelector(".tab-item.opened-select")?.classList.remove("opened-select");
  }
});
///End Custom Select///