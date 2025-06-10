import { carregaAPIs } from "../../modules/utils/APIs.mjs";
import { setupSidebar } from '../../modules/sidebar/sidebar.mjs'
import * as funcFilmes from '../../modules/filmes/index.mjs'
import {setupFiltro, setupSearchBar} from "../../modules/busca/index.mjs"
import {setupGraficoQntPorCategoria, setupGraficoAvaliacaoMediaPorCategoria} from '../../modules/graficos/index.mjs'


//não precisa do DomContentLoaded pq type module já tem propriedade defer por padão que faz quase o msm que um DOMContentLoaded
carregaAPIs((filmes, categorias, filmes_categorias, frases) => {
    setupSidebar();
    setupFiltro(categorias, filmes, filmes_categorias, frases);
    setupSearchBar(filmes, frases);
    funcFilmes.setupDestaques(filmes);
    funcFilmes.configAutoplayDestaques();
    funcFilmes.carregaFilmes(filmes, frases.map(elem => elem.frase));
    funcFilmes.configCarouselFilmesParaViewPort(frases.length);
    window.matchMedia('(min-width: 768px)').addEventListener('change', () => {
        funcFilmes.configCarouselFilmesParaViewPort(frases.length);
    });
    window.matchMedia('(min-width: 992px)').addEventListener('change', () => {
        funcFilmes.configCarouselFilmesParaViewPort(frases.length);
    });
    setupGraficoQntPorCategoria('graficoPorGenero', filmes, categorias, filmes_categorias);
    setupGraficoAvaliacaoMediaPorCategoria('graficoAvaliacaoPorGenero', filmes, categorias, filmes_categorias);
}, filmes_key, categorias_key, filmes_categorias_key, frases_key);