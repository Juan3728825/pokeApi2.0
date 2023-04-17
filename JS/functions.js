//Se va a usar fetch que hace lo mismo que ajax pero mas sencillo de usar y con menos codigo ya que no hace falta importarla.
const container_pkm = document.getElementById('container_pkm')
const spinner = document.querySelector('#spinner')
const previous = document.querySelector("#previous")
const next = document.querySelector("#next")
let offset = 1;
let limit = 29;
let currentPkm = null;

previous.addEventListener('click',()=>{
    if (offset != 1){
        offset -=30; //al clickear en anterior muestre 30 pokemons menos
        removeChildNodes(container_pkm);
        fetchPkms(offset,limit);
    }
})
next.addEventListener('click',()=>{
    offset +=30; //al clickear en siguiente muestre 30 pokemons mas
    removeChildNodes(container_pkm);
    fetchPkms(offset,limit)
})
function fetchPkm(id){
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
    .then(res => res.json()) //respuesta
    .then(data => {
        createPkm(data)
        spinner.style.display = "none" //ocultar spinner
    });
}


function fetchPkms(offset, limit){ //Se ha sustituido un numero por offset para establecer un limite que muestre de un determinado numero en adelante sumando
    spinner.style.display = "block" //se mostrara a partir de pulsar el boton siguiente
    for(let i=offset;i<=offset+limit;i++){
        fetchPkm(i)
    }
}


function createPkm(pkm){//crear elementos en tarjeta pokemon
    const card = document.createElement('div')
    card.classList.add('pokemon-block')

    const spriteContainer = document.createElement('div') // container de imagen
    spriteContainer.classList.add('img-container')

    const sprite = document.createElement('img') //imagen
    sprite.src=pkm.sprites.front_default

    spriteContainer.appendChild(sprite); //imagen dentro de container para imagenes

    const number_pkm = document.createElement('p')
    number_pkm.textContent=`#${pkm.id.toString().padStart(3,0)}`// id pokemon con 3 ceros al principio

    const name = document.createElement('p')//nombre pkm
    name.classList.add('name')
    name.textContent=pkm.name

    //elementos
    card.appendChild(spriteContainer);
    card.appendChild(number_pkm);
    card.appendChild(name);

    //añadir los elementos creados al container de pokemon
    container_pkm.appendChild(card)

    // Agrega un listener para llamar a la función fetchToTable con el Pokémon seleccionado
    card.addEventListener("click", function () {
        fetchToTable(pkm);

        // Desmarca la tarjeta del Pokémon previamente seleccionado
        if (currentPkm) {
            document.querySelector(`.pokemon-block[data-id="${currentPkm.id}"]`).classList.remove('selected');
        }

        // Marca la tarjeta del Pokémon actualmente seleccionado
        card.classList.add('selected');
    });
}

function removeChildNodes(parent){ /*Parent - contenedor todos los pokemon*/ 
    while(parent.firstChild){       /*Esta funcion lo que hace es eliminar las tarjetas de pokemon cuando pulsamos el boton siguiente o anterior quedandose con los que se desee ya sean los 30 siguientes o los 30 anteriores*/ 
        parent.removeChild(parent.firstChild)
    }
}
fetchPkms(offset,limit);


function fetchToTable(pkm){
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${pkm.id}/`)
    .then(res => res.json()) //respuesta
    .then(data => {
        const name = data.names.find(name => name.language.name === "es").name;
        const description = data.flavor_text_entries.find(text => text.language.name === "es").flavor_text;
        const type = pkm.types.map(type => type.type.name).join(", ");

        const table = document.querySelector(".tbl_pkm");

        // Borra las filas de la tabla de los Pokémon previamente seleccionados
        while (table.rows.length > 1) {
            table.deleteRow(1);
        }

        // Agrega una nueva fila para el Pokémon seleccionado
        const row = table.insertRow();
        const nameCell = row.insertCell();
        const descriptionCell = row.insertCell();
        const typeCell = row.insertCell();

        nameCell.innerText = name;
        descriptionCell.innerText = description;
        typeCell.innerText = type;

        // Actualiza el registro del Pokémon seleccionado actualmente
        currentPkm = pkm;
    });
}

