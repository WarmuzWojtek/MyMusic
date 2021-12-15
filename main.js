document.addEventListener("DOMContentLoaded", () => {
  const image_input = document.querySelector("#image_input");
  let uploaded_image;
  const nameInput = document.getElementById("name");
  const surnameInput = document.getElementById("surname");
  const contractorTypeInput = document.getElementById("type");
  const contractorIdInput = document.getElementById("id");
  const surnameLabel = document.getElementById("surname-label");
  const nameLabel = document.getElementById("name-label");
  const alertElement = document.querySelector(".contractor__overlay");
  const tryAgainBtn = document.querySelector(".contractor__overlay button");
  const container = document.querySelector(".contractor");
  const contractorImage = document.querySelector(".contractor__img");
  const submitBtn = document.getElementById("submitBtn");

  function changeIdTypeFunction() {
    contractorIdInput.value = "";
    nameInput.value = "";
    surnameInput.value = "";
    if (contractorTypeInput.value === "person") {
      surnameInput.removeAttribute("disabled");
      surnameLabel.innerHTML = "Nazwisko";
      nameLabel.innerHTML = "Imię";
      contractorIdInput.placeholder = "wpisz numer pesel";
    } else if (contractorTypeInput.value === "company") {
      surnameInput.setAttribute("disabled", "true");
      surnameLabel.innerHTML = "";
      nameLabel.innerHTML = "Nazwa firmy";
      contractorIdInput.placeholder = "wpisz numer NIP";
    }
  }

  function peselValidation(value) {
    let month = value.substring(2, 4);
    let day = value.substring(4, 6);
    if (typeof value !== "string") {
      return false;
    } else if (value.length !== 11) {
      return false;
    } else if (month < 1 || month > 12) {
      return false;
    } else if (day < 1 || day > 31) {
      return false;
    }
    let weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
    let sum = 0;
    let controlNumber = parseInt(value.substring(10, 11));

    for (let i = 0; i < weights.length; i++) {
      sum += parseInt(value.substr(i, 1)) * weights[i];
    }
    sum = sum % 10;
    return (10 - sum) % 10 === controlNumber;
  }

  function nipValidation(value) {
    value = value.replace(/[\ \-]/gi, "");
    if (typeof value !== "string") {
      return false;
    } else if (value.length !== 10) {
      return false;
    }

    let weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
    let sum = 0;
    let controlNumber = parseInt(value.substring(9, 10));
    for (let i = 0; i < weights.length; i++) {
      sum += parseInt(value.substr(i, 1)) * weights[i];
    }

    return sum % 11 === controlNumber;
  }

  function idNumberValidation(value) {
    if (contractorTypeInput.value === "person") {
      return peselValidation(value);
    } else if (contractorTypeInput.value === "company") {
      return nipValidation(value);
    }
  }

  async function submitContractor(e) {
    e.preventDefault();
    const value = contractorIdInput.value;
    const isValid = idNumberValidation(value);
    if (!isValid) {
      const scroll = window.scrollY;
      alertElement.style.transform = `translateY(calc(${scroll}px - 100px))`;
      container.style.filter = "blur(25px)";
      contractorIdInput.value = "";
      return;
    } else {
      let name = nameInput.value;
      let surname = surnameInput.value;
      let contractorType = contractorTypeInput.value;
      let contractorId = contractorIdInput.value;

      const payload = {
        name,
        surname,
        contractorType,
        contractorId,
        uploaded_image,
      };

      await fetch("https://onet.pl/Contractor/Save ", {
        method: "POST",
        mode: "no-cors",
        body: payload,
      })
        .then((response) => response.json())

        .then((data) => {})
        .catch((error) => {
          alert("Nie znaleziono metody zapisu");
        });
      nameInput.value = "";
      surnameInput.value = "";
      contractorIdInput.value = "";
      contractorTypeInput.value = "person";
      contractorImage.setAttribute("src", "./assets/avatar.png");
    }
  }

  image_input.addEventListener("change", function () {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      uploaded_image = reader.result;
      document
        .querySelector(".contractor__img")
        .setAttribute("src", uploaded_image);
    });
    reader.readAsDataURL(this.files[0]);
  });

  contractorTypeInput.addEventListener("change", changeIdTypeFunction);
  tryAgainBtn.addEventListener("click", () => {
    alertElement.style.transform = "translateY(-350%)";
    container.style.filter = "none";
  });

  submitBtn.addEventListener("click", submitContractor);
});
