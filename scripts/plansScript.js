const fileBtn = document.querySelector("#fileBtn");
const fileRealBtn = document.querySelector("#fileRealBtn");
const fileInput = document.querySelector("#fileInput");

fileBtn.addEventListener("click", () => {

    fileRealBtn.click();

});

fileRealBtn.addEventListener('change', () => {

    fileInput.value = fileRealBtn.files[0].path;

});