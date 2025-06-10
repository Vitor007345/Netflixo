import {carregaFilmes, configCarouselFilmesParaViewPort} from "../filmes/index.mjs"

function abrirDropdown(dropdown) {

    dropdown.style.display = 'inline';
}
function fecharDropdown(dropdown) {

    dropdown.style.display = 'none';
}
function trocarComponente1por2(comp1, comp2) {
    comp1.style.display = 'none';
    comp2.style.display = 'inline';
}

let filtros = {
    expression: '',
    categoriasAtivasIds: [],
    filmes: []
}



function resetFilters(filmes, frases) {
    let searchInput = document.getElementById('search-input');
    searchInput.value = '';
    let btFiltro = document.getElementById('btfilter');
    trocarComponente1por2(btFiltro.querySelector('.bi-funnel-fill'), btFiltro.querySelector('.bi-funnel'));
    let inputs = document.getElementById('filter-dropdown').querySelectorAll('ul > li > input');
    inputs.forEach(elem => { elem.checked = false });
    carregaFilmes(filmes, frases.map(elem => elem.frase));
    configCarouselFilmesParaViewPort(frases.length);
    
    filtros.expression = '';
    filtros.categoriasAtivasIds.length =  0;
    filtros.filmes.length = 0;
   

}


function setupBtLimpar(qntFilmes, funcLimpar) {
    let secFilmes = document.getElementById('sectionFilmes');

    let divLimpar = document.createElement('div');
    divLimpar.id = 'divLimpar';
    divLimpar.classList.add("row", "d-flex", "justify-content-center", "align-items-center", "flex-column");

    if (qntFilmes === 0) {
        secFilmes.innerHTML = '';

        let h4 = document.createElement('h4');
        h4.classList.add("text-center", "text-white");
        h4.innerText = 'Nenhum Filme encontrado'
        divLimpar.appendChild(h4);
    }

    let btLimpar = document.createElement('button');
    btLimpar.id = 'btLimpar';
    btLimpar.classList.add("btn", "btn-primary", "w-auto");
    btLimpar.innerText = 'Limpar Filtro';
    btLimpar.addEventListener('click', funcLimpar);

    divLimpar.appendChild(btLimpar);
    secFilmes.appendChild(divLimpar);


}

export {
    abrirDropdown,
    fecharDropdown,
    trocarComponente1por2,
    filtros,
    resetFilters,
    setupBtLimpar

}