const objectsTable = document.querySelector(".tableList");
const acceptBtn = document.querySelector("#acceptBtn");
const cameraSelect = document.querySelector("#cameraSelect");

const resX = document.querySelector("#resX");
const resY = document.querySelector("#resY");

const cameraSamplesNumber = document.querySelector("#cameraSamplesNumber");
const diffuseSamplesNumber = document.querySelector("#diffuseSamplesNumber");
const specularSamplesNumber = document.querySelector("#specularSamplesNumber");
const transmissionSamplesNumber = document.querySelector("#transmissionSamplesNumber");
const sssSamplesNumber = document.querySelector("#sssSamplesNumber");
const volumeSamplesNumber = document.querySelector("#volumeSamplesNumber");

const cameraSamplesSlider = document.querySelector("#cameraSamplesSlider");
const diffuseSamplesSlider = document.querySelector("#diffuseSamplesSlider");
const specularSamplesSlider = document.querySelector("#specularSamplesSlider");
const transmissionSamplesSlider = document.querySelector("#transmissionSamplesSlider");
const sssSamplesSlider = document.querySelector("#sssSamplesSlider");
const volumeSamplesSlider = document.querySelector("#volumeSamplesSlider");

const cameraDepthNumber = document.querySelector("#cameraDepthNumber");
const diffuseDepthNumber = document.querySelector("#diffuseDepthNumber");
const specularDepthNumber = document.querySelector("#specularDepthNumber");
const transmissionDepthNumber = document.querySelector("#transmissionDepthNumber");
const sssDepthNumber = document.querySelector("#sssDepthNumber");
const volumeDepthNumber = document.querySelector("#volumeDepthNumber");

const cameraDepthSlider = document.querySelector("#cameraDepthSlider");
const diffuseDepthSlider = document.querySelector("#diffuseDepthSlider");
const specularDepthSlider = document.querySelector("#specularDepthSlider");
const transmissionDepthSlider = document.querySelector("#transmissionDepthSlider");
const sssDepthSlider = document.querySelector("#sssDepthSlider");
const volumeDepthSlider = document.querySelector("#volumeDepthSlider");

let sceneObjects = JSON.parse(localStorage.getItem("sceneObjects"));

let samplesNumbers = [cameraSamplesNumber, diffuseSamplesNumber, specularSamplesNumber, transmissionSamplesNumber, sssSamplesNumber, volumeSamplesNumber]
let samplesSliders = [cameraSamplesSlider, diffuseSamplesSlider, specularSamplesSlider, transmissionSamplesSlider, sssSamplesSlider, volumeSamplesSlider]

let depthNumbers = [cameraDepthNumber, diffuseDepthNumber, specularDepthNumber, transmissionDepthNumber, sssDepthNumber, volumeDepthNumber]
let depthSliders = [cameraDepthSlider, diffuseDepthSlider, specularDepthSlider, transmissionDepthSlider, sssDepthSlider, volumeDepthSlider]

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

function updateResolution(obj){

    resX.value = obj.x;
    resY.value = obj.y;

    resX.addEventListener("change", () => {

        obj.x = resX.value;

    });

    resY.addEventListener("change", () => {

        obj.y = resY.value;

    });

}

function updateRenderSamples(obj){

    cameraSamplesNumber.value = obj.camera;
    diffuseSamplesNumber.value = obj.diffuse;
    specularSamplesNumber.value = obj.specular;
    transmissionSamplesNumber.value = obj.transmission;
    sssSamplesNumber.value = obj.sss;
    volumeSamplesNumber.value = obj.volume;

    cameraSamplesSlider.value = obj.camera;
    diffuseSamplesSlider.value = obj.diffuse;
    specularSamplesSlider.value = obj.specular;
    transmissionSamplesSlider.value = obj.transmission;
    sssSamplesSlider.value = obj.sss;
    volumeSamplesSlider.value = obj.volume;

    cameraSamplesNumber.addEventListener("change", () => {

        obj.camera = cameraSamplesNumber.value;

    });
    diffuseSamplesNumber.addEventListener("change", () => {

        obj.diffuse = diffuseSamplesNumber.value;

    });
    specularSamplesNumber.addEventListener("change", () => {

        obj.specular = specularSamplesNumber.value;

    });
    transmissionSamplesNumber.addEventListener("change", () => {

        obj.transmission = transmissionSamplesNumber.value;

    });
    sssSamplesNumber.addEventListener("change", () => {

        obj.sss = sssSamplesNumber.value;

    });
    volumeSamplesNumber.addEventListener("change", () => {

        obj.volume = volumeSamplesNumber.value;

    });

    cameraSamplesSlider.addEventListener("change", () => {

        obj.camera = cameraSamplesSlider.value;

    });
    diffuseSamplesSlider.addEventListener("change", () => {

        obj.diffuse = diffuseSamplesSlider.value;

    });
    specularSamplesSlider.addEventListener("change", () => {

        obj.specular = specularSamplesSlider.value;

    });
    transmissionSamplesSlider.addEventListener("change", () => {

        obj.transmission = transmissionSamplesSlider.value;

    });
    sssSamplesSlider.addEventListener("change", () => {

        obj.sss = sssSamplesSlider.value;

    });
    volumeSamplesSlider.addEventListener("change", () => {

        obj.volume = volumeSamplesSlider.value;

    });

}

function updateRenderDepth(obj){

    cameraDepthNumber.value = obj.camera;
    diffuseDepthNumber.value = obj.diffuse;
    specularDepthNumber.value = obj.specular;
    transmissionDepthNumber.value = obj.transmission;
    sssDepthNumber.value = obj.sss;
    volumeDepthNumber.value = obj.volume;

    cameraDepthSlider.value = obj.camera;
    diffuseDepthSlider.value = obj.diffuse;
    specularDepthSlider.value = obj.specular;
    transmissionDepthSlider.value = obj.transmission;
    sssDepthSlider.value = obj.sss;
    volumeDepthSlider.value = obj.volume;

    cameraDepthNumber.addEventListener("change", () => {

        obj.camera = cameraDepthNumber.value;

    });
    diffuseDepthNumber.addEventListener("change", () => {

        obj.diffuse = diffuseDepthNumber.value;

    });
    specularDepthNumber.addEventListener("change", () => {

        obj.specular = specularDepthNumber.value;

    });
    transmissionDepthNumber.addEventListener("change", () => {

        obj.transmission = transmissionDepthNumber.value;

    });
    sssDepthNumber.addEventListener("change", () => {

        obj.sss = sssDepthNumber.value;

    });
    volumeDepthNumber.addEventListener("change", () => {

        obj.volume = volumeDepthNumber.value;

    });

    cameraDepthSlider.addEventListener("change", () => {

        obj.camera = cameraDepthSlider.value;

    });
    diffuseDepthSlider.addEventListener("change", () => {

        obj.diffuse = diffuseDepthSlider.value;

    });
    specularDepthSlider.addEventListener("change", () => {

        obj.specular = specularDepthSlider.value;

    });
    transmissionDepthSlider.addEventListener("change", () => {

        obj.transmission = transmissionDepthSlider.value;

    });
    sssDepthSlider.addEventListener("change", () => {

        obj.sss = sssDepthSlider.value;

    });
    volumeDepthSlider.addEventListener("change", () => {

        obj.volume = volumeDepthSlider.value;

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

        if (obj.type === "resolution"){

            updateResolution(obj);
            continue;

        }


        if (obj.type === "renderSamples"){

            updateRenderSamples(obj);
            continue;

        }

        if (obj.type === "renderDepth"){

            updateRenderDepth(obj);
            continue;

        }
    
    }

}

updateAllDatas(sceneObjects);

acceptBtn.addEventListener("click", () => {


    let sceneObjectsText = JSON.stringify(sceneObjects);
    localStorage.setItem("returnSceneObjects", sceneObjectsText);

});


/* RENDER Samples */
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




linkNumbersAndSliders(samplesNumbers, samplesSliders);
linkNumbersAndSliders(depthNumbers, depthSliders);