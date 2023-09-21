// Save Box Buttons variables
const openNewBtn = document.querySelector("#openNewBtn");
const saveBtn = document.querySelector("#saveBtn");
const openBtn = document.querySelector("#openBtn");

// All table variables
const plansTable = document.querySelector("#plansTable");
const passesTable = document.querySelector("#passesTable");
const taskTable = document.querySelector("#taskTable");
const slavesTable = document.querySelector("#slavesTable");


// Save Box Buttons Events
openNewBtn.addEventListener("click", () => {

    alert("OPEN NEW");
    
});

saveBtn.addEventListener("click", () => {

    alert("SAVE");
    
});

openBtn.addEventListener("click", () => {

    alert("OPEN");

});


// Color Even Row 
function colorTd(nodes, color){

    for(let j = 0; j < nodes.length; j++){
                
        if (nodes[j].nodeName.toLowerCase() === "td"){

            nodes[j].style.background = color; 

        } 

    }

}


function colorEvenRow(table){

    for (let i=2; i < table.rows.length; i++){

        let nodes = table.rows[i].childNodes;

        if (i % 2 === 1){
            
            colorTd(nodes, "#292929");
            
        } else {

            colorTd(nodes, "#1a1a1a");

        }

    }

}

// Clear Table
function clearTable(table){
    
    const rowsNb = table.rows.length
    
    for (let i = 2; i < rowsNb; i++){ //REMOVE ALL ROWS
        table.deleteRow(-1);
    }
    
}

clearTable(passesTable); //Clear Table

baseColorMap = new Map(); // Une row dans un tableau, ici PassesTable
baseColorMap.set("Name", "BaseColor.bc");
baseColorMap.set("Status", "Rendering");
baseColorMap.set("Progress", "80% (80/100)");
baseColorMap.set("Frames", "1-100");
passesList = [baseColorMap];

depthMap = new Map(); // Une row dans un tableau, ici PassesTable
depthMap.set("Name", "depth.z");
depthMap.set("Status", "Completed");
depthMap.set("Progress", "100% (100/100)");
depthMap.set("Frames", "1-100");
passesList.push(depthMap);

// Create Rows
function createRow(propertiesMap){
    
    let row = document.createElement("tr");
    
    for (let [key, value] of propertiesMap){
        
        let cell = document.createElement("td");
        cell.innerText = value;
        row.appendChild(cell);
        row.appendChild(document.createElement("td")); //Cellule vide
        
    }
    
    return row;
    
}

function createRows(table, rowsList){

    let row;

    for (let i of rowsList){

        row = createRow(i);
        table.appendChild(row);

    }

}

createRows(passesTable, passesList);

// Color Row by Status
function colorAllTexts(nodes, color){

    

    for(let j = 0; j < nodes.length; j++){
                
        if (nodes[j].nodeName.toLowerCase() === "td"){

            nodes[j].style.color = color; 

        } 

    }

}

function colorByStatus(table, rowList){

    let status;

    for (let i = 0; i < rowList.length; i++){

        status = rowList[i].get("Status");
        nodes = table.rows[i+2].childNodes;

        if (status === "Queued"){

            colorAllTexts(nodes, "#939393"); //Grey
            
        } else if (status === "Rendering"){

            colorAllTexts(nodes, "#EE9616"); //Orange         
            
        } else if (status === "Completed"){

            colorAllTexts(nodes, "#95ff8f"); //Green

        } else {

            colorAllTexts(nodes, "#E74D31") //Red

        }


    }


}

colorByStatus(passesTable, passesList);

colorEvenRow(plansTable);
colorEvenRow(passesTable);
colorEvenRow(taskTable);
colorEvenRow(slavesTable);