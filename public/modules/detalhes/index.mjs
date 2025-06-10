import { carregaDadosPincipaisDetalhes, carregaEpsOuFotos, updateDetalhes } from "./detalhesFilmes.mjs";

export {updateDetalhes}
export default function carregaDetalhes(filmes, categorias, filmes_categorias){
    carregaDadosPincipaisDetalhes(filmes, categorias, filmes_categorias)
    carregaEpsOuFotos(filmes);
}

