const objectsTable = document.querySelector(".tableList");

let sceneObjects = JSON.parse(localStorage.getItem("sceneObjects"));

console.log(sceneObjects);

function createRadioButton(name){

    let cell = document.createElement("td");
    let button = document.createElement("input");
    button.setAttribute('type', 'radio');
    button.setAttribute('name', name);
    cell.appendChild(button);

    return cell;

}

for (let name of sceneObjects){


    let row = document.createElement("tr");
    let cell = document.createElement("td");
    let show = createRadioButton(name);
    let hidden = createRadioButton(name);
    let matte = createRadioButton(name);
    let phantom = createRadioButton(name);
    cell.innerText = name;
    row.appendChild(cell);
    row.appendChild(show);
    row.appendChild(hidden);
    row.appendChild(matte);
    row.appendChild(phantom);
    objectsTable.appendChild(row);

}
