import {relacionarObjs} from "../utils/objects.mjs"



function getQuantidadePorCategoria(filmes, categorias, filmes_categorias){
    return categorias.map(categoria => {
        let filmesDaCategoria = relacionarObjs(categoria.id, filmes, filmes_categorias, 'categoria_id', 'filme_id');
        return {
            categoria: categoria.categoria,
            quantidade: filmesDaCategoria.length
        }
    });
}



function setupGraficoQntPorCategoria(chartId, filmes, categorias, filmes_categorias){
    const ctx = document.getElementById(chartId).getContext('2d');
    const qntPorCategoria = getQuantidadePorCategoria(filmes, categorias, filmes_categorias);
    const data = {
        labels: qntPorCategoria.map(elem=> elem.categoria),
        datasets: [{
            label: 'Quantidade',
            data: qntPorCategoria.map(elem=> elem.quantidade),
            hoverOffset: 4
        }]
    }
    const config = {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    }
    const myChart = new Chart(ctx, config);
    /*
    window.addEventListener('resize', ()=>{
        myChart.resize();
        myChart.update();
    })
        */
    return myChart;
}

export {
    setupGraficoQntPorCategoria
};

