const objectsTable = document.querySelector(".tableList");
const acceptBtn = document.querySelector("#acceptBtn");

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

function createAllRows(objects){

    for (let obj of objects){


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