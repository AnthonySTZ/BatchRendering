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

let settingsNumbers = [cameraSettingsNumber, diffuseSettingsNumber, specularSettingsNumber, transmissionSettingsNumber, sssSettingsNumber, volumeSettingsNumber]
let settingsSliders = [cameraSettingsSlider, diffuseSettingsSlider, specularSettingsSlider, transmissionSettingsSlider, sssSettingsSlider, volumeSettingsSlider]


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

function createObjRow(obj){
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

function updateRenderSettings(obj){

    cameraSettingsNumber.value = obj.camera;
    diffuseSettingsNumber.value = obj.diffuse;
    specularSettingsNumber.value = obj.specular;
    transmissionSettingsNumber.value = obj.transmission;
    sssSettingsNumber.value = obj.sss;
    volumeSettingsNumber.value = obj.volume;

    cameraSettingsSlider.value = obj.camera;
    diffuseSettingsSlider.value = obj.diffuse;
    specularSettingsSlider.value = obj.specular;
    transmissionSettingsSlider.value = obj.transmission;
    sssSettingsSlider.value = obj.sss;
    volumeSettingsSlider.value = obj.volume;

    cameraSettingsNumber.addEventListener("change", () => {

        obj.camera = cameraSettingsNumber.value;

    });
    diffuseSettingsNumber.addEventListener("change", () => {

        obj.diffuse = diffuseSettingsNumber.value;

    });
    specularSettingsNumber.addEventListener("change", () => {

        obj.specular = specularSettingsNumber.value;

    });
    transmissionSettingsNumber.addEventListener("change", () => {

        obj.transmission = transmissionSettingsNumber.value;

    });
    sssSettingsNumber.addEventListener("change", () => {

        obj.sss = sssSettingsNumber.value;

    });
    volumeSettingsNumber.addEventListener("change", () => {

        obj.volume = volumeSettingsNumber.value;

    });

    cameraSettingsSlider.addEventListener("change", () => {

        obj.camera = cameraSettingsSlider.value;

    });
    diffuseSettingsSlider.addEventListener("change", () => {

        obj.diffuse = diffuseSettingsSlider.value;

    });
    specularSettingsSlider.addEventListener("change", () => {

        obj.specular = specularSettingsSlider.value;

    });
    transmissionSettingsSlider.addEventListener("change", () => {

        obj.transmission = transmissionSettingsSlider.value;

    });
    sssSettingsSlider.addEventListener("change", () => {

        obj.sss = sssSettingsSlider.value;

    });
    volumeSettingsSlider.addEventListener("change", () => {

        obj.volume = volumeSettingsSlider.value;

    });

}

function updateAllDatas(objects){

    for (let obj of objects){

        if (obj.type === "camera"){
            let option = createCameraOption(obj);
            cameraSelect.appendChild(option);
            continue;
        }

        if (obj.type === "polymesh"){

            createObjRow(obj);
            continue;
        
        }

        if (obj.type === "renderSettings"){

            updateRenderSettings(obj);
            continue;

        }
    
    }

}

updateAllDatas(sceneObjects);

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




linkNumbersAndSliders(settingsNumbers, settingsSliders);