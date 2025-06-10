import {relacionarObjs, excluirObjRepetidos} from "../utils/objects.mjs";
import * as generals from "./general.mjs";
import {carregaFilmes, configCarouselFilmesParaViewPort} from "../filmes/index.mjs"
import { procurarFilme } from "./search-bar.mjs";



function setupFiltro(categorias, filmes, filmes_categorias, frases) {

    //variaveis e constantes
    const btfiltro = document.getElementById('btfilter');
    const filtroDropdown = document.getElementById('filter-dropdown');
    let filtroVazio = btfiltro.querySelector('.bi-funnel');
    let filtroPrenchido = btfiltro.querySelector('.bi-funnel-fill');
    


    gerarFiltros(categorias);
    configInicialFiltro();
    if (filmes && filmes_categorias && frases) configFuncionalidadeFiltro(filmes, categorias, filmes_categorias, frases);

    function gerarFiltros(categorias) {
        const ul = filtroDropdown.querySelector('ul');
        ul.innerHTML = '';
        categorias.forEach(elem => {
            ul.innerHTML += `<li><input type="checkbox" id="input-${elem.categoria.simplify()}&${elem.id}"><label for="input-${elem.categoria.simplify()}&${elem.id}">${elem.categoria}</label></li>`;
        });
    }

    function configInicialFiltro() {

        //config inicial
        generals.fecharDropdown(filtroDropdown);
        desativarFiltro();

        //config filtro Ativado/Desativado
        const inputs = Array.from(filtroDropdown.querySelectorAll('input'));
        inputs.forEach((input, i, array) => {
            input.addEventListener('change', () => {
                if (input.checked) {
                    ativarFiltro();

                } else {
                    if (!array.some((checkbox) => checkbox.checked)) {
                        desativarFiltro();
                    }

                }
            });
        });

        //config abrir fechar
        let filtroFechado = true;
        btfiltro.addEventListener('click', () => {
            if (filtroFechado) {
                generals.abrirDropdown(filtroDropdown);
                filtroFechado = false;
            } else {
                generals.fecharDropdown(filtroDropdown);
                filtroFechado = true;
            }
        })

        //funções específicas
        function ativarFiltro() {
            generals.trocarComponente1por2(filtroVazio, filtroPrenchido);
        }
        function desativarFiltro() {
            generals.trocarComponente1por2(filtroPrenchido, filtroVazio);
        }
    }

    function configFuncionalidadeFiltro(filmes, categorias, filmes_categorias, frases) {
        const inputs = Array.from(filtroDropdown.querySelectorAll('input'));
        //console.log(inputs);

        inputs.forEach((input) => {

            input.addEventListener('change', () => {
                const id = parseInt(input.id.split('&').pop());
                if (input.checked) {
                    generals.filtros.categoriasAtivasIds.push(id);
                } else {
                    const index = generals.filtros.categoriasAtivasIds.indexOf(id);
                    if (index !== -1) generals.filtros.categoriasAtivasIds.splice(index, 1);
                }


                if (inputs.some((checkbox) => checkbox.checked)) {
                    carregarFilmesFiltrados(generals.filtros.categoriasAtivasIds);
                } else {
                    carregaFilmes(filmes, frases.map(elem => elem.frase));
                    configCarouselFilmesParaViewPort(frases.length);
                    generals.filtros.expression = '';
                    generals.filtros.filmes.length = 0;
                }

            });
        });

        function carregarFilmesFiltrados(categoriasAtivasIds) {
            categoriasAtivasIds.forEach((elem) => {
                const filmesDessaCategoria = relacionarObjs(elem, filmes, filmes_categorias, 'categoria_id', 'filme_id');
                //console.log(filmesDessaCategoria);
                generals.filtros.filmes = [...generals.filtros.filmes, ...filmesDessaCategoria];
            })
            excluirObjRepetidos(generals.filtros.filmes);
            
            let valorInput = document.getElementById('search-input').value;
            if(valorInput !== "") {
                generals.filtros.filmes = procurarFilme(valorInput, generals.filtros.filmes);
                generals.filtros.expression = generals.filtros.expression.split("&nbsp;||&nbsp;")[0];
                generals.filtros.expression += "&nbsp;||&nbsp;";
            }else{
                generals.filtros.expression = "";
            }

            const categoriasFiltradas = categoriasAtivasIds
                .map((id) =>
                    categorias
                        .find((elem) => parseInt(elem.id) === id)
                        .categoria
                );

            //console.log(categoriasFiltradas);
            generals.filtros.expression += "Filtros:&nbsp;";
            categoriasFiltradas.forEach((elem, i, arr) => {
                generals.filtros.expression += elem;
                if (i < (arr.length - 2)) {
                    generals.filtros.expression += ",&nbsp;";
                } else if (i == (arr.length - 2)) {
                    generals.filtros.expression += "&nbsp;e&nbsp;";
                }
            });
        
            if (generals.filtros.filmes.length !== 0) {
                carregaFilmes(generals.filtros.filmes, [generals.filtros.expression], true);
                configCarouselFilmesParaViewPort(1);
            }
            generals.setupBtLimpar(generals.filtros.filmes.length, () => {
                console.log('limpou');
                generals.resetFilters(filmes, frases);
            })


        }



    }
}

export {
    setupFiltro
}

