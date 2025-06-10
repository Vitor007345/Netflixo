

import {relacionarObjs} from "../utils/objects.mjs"

function mediaArr(arr){
    let media = null;
    if(arr.length !== 0){
        media = arr.reduce((soma, elem)=> soma + elem, 0) / arr.length;
    }
    return media;
}


function getMediaAvaliacaoPorCategoria(filmes, categorias, filmes_categorias){
    return categorias.map(categoria =>{
        const filmesDaCategoria = relacionarObjs(categoria.id, filmes, filmes_categorias, 'categoria_id', 'filme_id');
        const media = mediaArr(filmesDaCategoria.map(filme=> parseFloat(filme.avaliacao)));
        return {
            categoria: categoria.categoria,
            quantidade: filmesDaCategoria.length,
            mediaAvaliacao: media
        }
    });
}

function setupGraficoAvaliacaoMediaPorCategoria(chartId, filmes, categorias, filmes_categorias){
    const ctx = document.getElementById(chartId).getContext('2d');
    const mediaAvalicacaoPorCategoria = getMediaAvaliacaoPorCategoria(filmes, categorias, filmes_categorias);
    const data = {
        labels: mediaAvalicacaoPorCategoria.map(elem=> elem.categoria),
        datasets: [
            {
                label: 'Quantidade',
                data: mediaAvalicacaoPorCategoria.map(elem=> elem.quantidade),
                hoverOffset: 4
            },
            {
                label: 'Média Avaliacao',
                data: mediaAvalicacaoPorCategoria.map(elem => elem.mediaAvaliacao),
                hoverOffset: 4
            }

        ]
    }
    let options = {
        scales: {
            y: {
                beginAtZero: true
            }
        },
        responsive: true,
        maintainAspectRatio: true
    }
    
    const config = {
        type: 'bar',
        data: data,
        options: options
    }
    const myChart = new Chart(ctx, config);
    
    window.addEventListener('resize', ()=>{
        myChart.resize();
        myChart.update();
    })
    
    return myChart;
}

export {setupGraficoAvaliacaoMediaPorCategoria}