const objectsTable = document.querySelector(".tableList");
const acceptBtn = document.querySelector("#acceptBtn");
const cameraSelect = document.querySelector("#cameraSelect");

const cameraSettingsNumber = document.querySelector("#cameraSettingsNumber");
const diffuseSettingsNumber = document.querySelector("#diffuseSettingsNumber");
const specularSettingsNumber = document.querySelector("#specularSettingsNumber");
const transmissionSettingsNumber = document.querySelector("#transmissionSettingsNumber");
const sssSettingsNumber = document.querySelector("#sssSettingsNumber");
const volumeSettingsNumber = document.querySelector("#volumeSettingsNumber");

const cameraSettingsSlider = document.querySelector("#cameraSettingsSlider");
const diffuseSettingsSlider = document.querySelector("#diffuseSettingsSlider");
const specularSettingsSlider = document.querySelector("#specularSettingsSlider");
const transmissionSettingsSlider = document.querySelector("#transmissionSettingsSlider");
const sssSettingsSlider = document.querySelector("#sssSettingsSlider");
const volumeSettingsSlider = document.querySelector("#volumeSettingsSlider");

let sceneObjects = JSON.parse(localStorage.getItem("sceneObjects"));


function createRadioButton(obj, visibility){

    let cell = document.createElement("td");
    let button = document.createElement("input");
    button.setAttribute('type', 'radio');
    button.setAttribute('name', obj.name);

    if (obj.visibility === visibility){
        button.checked = true;
    }

    button.addEventListener("change", () => {

        obj.visibility = visibility;        

    });

    cell.appendChild(button);

    return cell;

}

function createCameraOption(obj){

    let cell = document.createElement("option");
    cell.innerHTML = obj.name.slice(0, obj.name.indexOf("/"));
    cell.setAttribute("value", obj.name);

    if (obj.selected === 1){

        cell.setAttribute("selected", "selected");

    }

    cameraSelect.addEventListener("change", () => {

        console.log(cameraSelect.options[cameraSelect.selectedIndex].value)

        if (cameraSelect.options[cameraSelect.selectedIndex].value === obj.name){

            obj.selected = 1;

        } else {

            obj.selected = 0;

        }

    });

    return cell;

}

function createAllRows(objects){

    for (let obj of objects){

        if (obj.type === "camera"){
            let option = createCameraOption(obj);
            cameraSelect.appendChild(option);
            continue;
        }

        let row = document.createElement("tr");
        let cell = document.createElement("td");
        let show = createRadioButton(obj, 0);
        let hidden = createRadioButton(obj, 1);
        let matte = createRadioButton(obj, 2);
        let phantom = createRadioButton(obj, 3);
        cell.innerText = obj.name;
        row.appendChild(cell);
        row.appendChild(show);
        row.appendChild(hidden);
        row.appendChild(matte);
        row.appendChild(phantom);
        objectsTable.appendChild(row);
    
    }

}

createAllRows(sceneObjects);

acceptBtn.addEventListener("click", () => {


    let sceneObjectsText = JSON.stringify(sceneObjects);
    localStorage.setItem("returnSceneObjects", sceneObjectsText);

});


/* RENDER SETTINGS */
function linkNumbersAndSliders(numbers, sliders){

    for (let i = 0; i<numbers.length; i++){

        numbers[i].addEventListener("change", () => {
    
            sliders[i].value = numbers[i].value;
        
        });
    
        sliders[i].addEventListener("change", () => {
    
            numbers[i].value = sliders[i].value;
        
        });
    
    }

}


let settingsNumbers = [cameraSettingsNumber, diffuseSettingsNumber, specularSettingsNumber, transmissionSettingsNumber, sssSettingsNumber, volumeSettingsNumber]
let settingsSliders = [cameraSettingsSlider, diffuseSettingsSlider, specularSettingsSlider, transmissionSettingsSlider, sssSettingsSlider, volumeSettingsSlider]

linkNumbersAndSliders(settingsNumbers, settingsSliders);