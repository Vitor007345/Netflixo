import * as generals from "./general.mjs";
import {carregaFilmes, configCarouselFilmesParaViewPort} from "../filmes/index.mjs"

function setupSearchBar(filmes, frases) {
    let btSearch = document.getElementById('btsearch');
    let searchInput = document.getElementById('search-input');
    btSearch.addEventListener('click', buscar);
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            buscar();
        }
    })

    function buscar() {
        let filmesBuscados;

        if (generals.filtros.filmes.length === 0) {
            filmesBuscados = procurarFilme(searchInput.value, filmes);
            generals.filtros.expression = `Buscado:&nbsp;${searchInput.value}`;

        } else {
            filmesBuscados = procurarFilme(searchInput.value, generals.filtros.filmes);
            generals.filtros.expression = `Buscado:&nbsp;${searchInput.value}&nbsp;||&nbsp;${generals.filtros.expression}`;
            
        }
        
        if (filmesBuscados.length !== 0) {
            carregaFilmes(filmesBuscados, [generals.filtros.expression], true);
            configCarouselFilmesParaViewPort(1);
        }
        generals.setupBtLimpar(filmesBuscados.length, () => {
            console.log('limpou');
            generals.resetFilters(filmes, frases);
        });
        generals.filtros.filmes = filmesBuscados;

    }


}

function procurarFilme(valorInput, filmes) {
    return filmes.filter((filme) =>
        filme.titulo.simplify()
            .includes(valorInput.simplify())
    );
}

export {
    setupSearchBar,
    procurarFilme
}
