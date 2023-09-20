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


// Color row on startup
colorEvenRow(plansTable);
colorEvenRow(passesTable);
colorEvenRow(taskTable);
colorEvenRow(slavesTable);


//Create Map for all table properties 
function createTableMap(table){

    let tableArray = []
    let nodesPropertiesMap = new Map();
    let nodes = table.rows[0].childNodes;
    let properties;

    for (let i=0; i < nodes.length; i++){ //Create Map of all index properties, ex : {1:"Icon", 4:"Name", 7:"Status"} 

        properties = nodes[i].innerText;
        if (properties != undefined){
            if (properties.length > 0)
            nodesPropertiesMap.set(i, properties);

        }

    }


    for (let i=2; i < table.rows.length; i++){ //Create list of Properties Map for all rows in table 

        let map = new Map();

        for(let [key, value] of nodesPropertiesMap){

            map.set(value, table.rows[i].childNodes[key])

        }

        tableArray.push(map);

    }

    return tableArray;

}

// Color by Status
function colorAllTexts(nodes, color){

    

    for(let j = 0; j < nodes.length; j++){
                
        if (nodes[j].nodeName.toLowerCase() === "td"){

            nodes[j].style.color = color; 

        } 

    }

}

function colorByStatus(table, array){

    for(let i = 0; i < array.length; i++){

        nodes = table.rows[i+2].childNodes;
        console.log(array[i].get("Status").innerText);

        if (array[i].get("Status").innerText === "Queued"){

            colorAllTexts(nodes, "#479449"); //Green
            
        } else if (array[i].get("Status").innerText === "Rendering"){

            colorAllTexts(nodes, "#95ff8f"); //Light green            
            
        } else {

            colorAllTexts(nodes, "#d9d9d9"); //White

        }
        
        
        
    }

}

passesArray = createTableMap(passesTable);
taskArray = createTableMap(taskTable);
slavesArray = createTableMap(slavesTable);


colorByStatus(passesTable, passesArray);
colorByStatus(taskTable, taskArray);
colorByStatus(slavesTable, slavesArray);
