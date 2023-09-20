// Save Box Buttons variables
const openNewBtn = document.querySelector("#openNewBtn");
const saveBtn = document.querySelector("#saveBtn");
const openBtn = document.querySelector("#openBtn");

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

const plansTable = document.querySelector("#plansTable");
const passesTable = document.querySelector("#passesTable");
const taskTable = document.querySelector("#taskTable");
const slavesTable = document.querySelector("#slavesTable");

colorEvenRow(plansTable);
colorEvenRow(passesTable);
colorEvenRow(taskTable);
colorEvenRow(slavesTable);