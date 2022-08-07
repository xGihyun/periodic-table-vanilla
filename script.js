const loader = document.getElementById("preloader");

//Preloader
window.addEventListener("load", () => {
    setInterval( () => {
        loader.style.display = "none";
    }, 750)
})

const periodicTable = document.getElementById("periodic-table");
const container = document.querySelector(".container");
const popup = document.querySelector(".popup-container")
const url = 'https://kineticzephyr.herokuapp.com/periodictable';

//Fetch each element from the API
async function fetchElement(){
    const promises = [];
    const res = await fetch(url);
    const data = await res.json();
    
    //Go through each element in the json file
    for(let i = 0, r = 1, c = 1; i < 118; i++){

        //Set the position of each element in the grid
        let n = data.data[i].number;
        
        if(n == 2){
            c = 18;
        }
        else if(n == 5 || n == 13){
            c = 13;
        }
        else if(n == 72 || n == 104){
            c = 4;
            n == 72 ? r = 6 : r = 7;
        }
        else if(n == 57){
            c = 3;
            r = 9;
        }
        else if(n == 89){
            c = 3;
            r = 10;
        }
        
        data.data[i].row = r;
        data.data[i].col = c;

        if(c == 18){
            c -= 18;
            r++;
        }
        
        c++;

        //Push the data of each element in an array
        promises.push(data.data[i]);
    }
    
    //Use promise to get the results and map each data
    Promise.all(promises).then(results => {
        const element = results.map(data => ({
            name: data.name,
            symbol: data.symbol,
            atomicMass: data.atomic_mass,
            atomicNumber: data.number,
            category: data.category,
            electronConfiguration: data.electron_configuration,
            electronShells: data.shells,
            discoveredBy: data.discovered_by,
            row: data.row,
            column: data.col,
            summary: data.summary
        }))
        
        displayElement(element);
        elementPopup(element);
    })
}

//Display the elements
function displayElement(element){
    
    const elementHTML = element.map(elementElement => 
        `<li class="element"
            data-name="${elementElement.name}" 
            data-num="${elementElement.atomicNumber}" 
            data-category="${elementElement.category}"
            style="grid-row: ${elementElement.row}; grid-column: ${elementElement.column}">

            <p class="atomic-number">${elementElement.atomicNumber}</p>
            <h2 class="element-symbol">${elementElement.symbol}</h2>
            <p class="element-name">${elementElement.name}</p>
        </li>
        `).join('');
    
    periodicTable.innerHTML = elementHTML;
}

//Make all elements selectable + popup when selected
function elementPopup(element){
    
    const allElements = document.querySelectorAll(".element");

    allElements.forEach(button => {
        button.addEventListener('click', e => {

            //Display popup
            popup.style.display = "block";

            //Atomic number of clicked element
            let target = e.currentTarget.dataset.num;

            //Whole container for each element info
            const elementDiv = document.createElement("div");
            elementDiv.classList.add("info-container");

            //Element name
            const elementName = document.createElement("div")
            elementName.classList.add("info")
            elementName.classList.add("name")
            elementName.innerHTML = '<h1>' + element[target-1].name + '</h1>';

            const summary = createInfoBox("Summary: ", element[target-1].summary);
            const category = createInfoBox("Category: ", element[target-1].category);
            const discoveredBy = createInfoBox("Discovered by: ", element[target-1].discoveredBy);
            const electronConfig = createInfoBox("Electron Configuration: ", element[target-1].electronConfiguration);
            const electronShells = createInfoBox("Electron Shells: ", element[target-1].electronShells);
            const atomicMass = createInfoBox("Atomic Mass: ", element[target-1].atomicMass);

            //Close button
            const closeButton = document.createElement("button");
            closeButton.classList.add("close");
            closeButton.innerHTML = "X";
            
            //Append everything
            elementDiv.appendChild(elementName);
            elementDiv.appendChild(summary);
            elementDiv.appendChild(category);
            elementDiv.appendChild(discoveredBy);
            elementDiv.appendChild(atomicMass);
            elementDiv.appendChild(electronConfig);
            elementDiv.appendChild(electronShells);
            elementDiv.appendChild(closeButton);

            popup.appendChild(elementDiv);

            //Close button action
            closeButton.addEventListener("click", () =>{
                popup.classList.toggle("show");
                popup.removeChild(elementDiv);
                popup.style.display = "none";
            })
        })
    })
}

//Create info box
function createInfoBox(label, details, elementDiv){

    //Info box (for each detail/property of element)
    const infoBox = document.createElement("aside");
    infoBox.classList.add("info-box");

    //Info label
    const infoLabel = document.createElement("label");
    infoLabel.classList.add("info-label");
    infoLabel.innerHTML = label;

    //Electron config
    const infoDetails = document.createElement("div");
    infoDetails.classList.add("info-details");
    infoDetails.innerHTML = details;

    infoBox.appendChild(infoLabel);
    infoBox.appendChild(infoDetails);

    return infoBox;
}

fetchElement();