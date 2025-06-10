import {converterYTWatchParaEmbed, relacionarObjs, resolveImgPath} from '../utils/index.mjs'



function colocarEstrelas(numAvaliacao, container) {
    if (numAvaliacao > 5) {
        console.log(`Erro número ${numAvaliacao} de avaliação maior que 5`);
        return;
    }
    let numDeEstrelasFill = Math.floor(numAvaliacao);
    for (let i = 0; i < numDeEstrelasFill; i++) {
        container.innerHTML += `<i class="bi bi-star-fill"></i>`;
    }
    let numDeEstrelasVazias;
    if (!Number.isInteger(numAvaliacao)) {
        container.innerHTML += `<i class="bi bi-star-half"></i>`;
        numDeEstrelasVazias = 5 - (numDeEstrelasFill + 1);
    } else {
        numDeEstrelasVazias = 5 - numDeEstrelasFill;
    }
    for (let i = 0; i < numDeEstrelasVazias; i++) {
        container.innerHTML += `<i class="bi bi-star"></i>`;
    }
}



function carregaDadosPincipaisDetalhes(infoFilme, categorias, filmes_categorias) {

    

    //declara todos os elementos que serão alterados dinamicamente
    let banner = document.getElementById('banner'); //console.log(banner);
    let titulo = document.getElementById('titulo'); //console.log(titulo);
    let sinopse = document.getElementById('sinopse'); //console.log(sinopse);
    let avaliacaoNum = document.getElementById('avaliacaoNum'); //console.log(avaliacaoNum);
    let spanEstrelas = document.getElementById('estrelasIcons'); //console.log(spanEstrelas);
    let iframeTrailer = document.getElementById('iframeTrailer'); //console.log(iframeTrailer);

    //altera os elementos de acordo com os dados
    banner.src = infoFilme.imgPrinciapl;
    titulo.innerText = (!infoFilme.subtitulo) ? infoFilme.titulo : infoFilme.titulo + " " + infoFilme.subtitulo; //adiciona somente o titulo se subtitulo n existir, se existir adiciola o titulo e o subtitulo
    sinopse.innerText = infoFilme.sinopseGrande;
    avaliacaoNum.innerHTML = '&nbsp;' + infoFilme.avaliacao;
    if (Number.isInteger(parseFloat(infoFilme.avaliacao))) { //caso sejá inteiro o número ira aparecer só assim 5 ou assim 4, ai pra ficar melhor se for inteiro ele adiciona um .0
        avaliacaoNum.innerHTML += '.0';
    }
    avaliacaoNum.innerHTML += '&nbsp;'
    spanEstrelas.innerHTML = "";
    colocarEstrelas(parseFloat(infoFilme.avaliacao), spanEstrelas);
    iframeTrailer.src = converterYTWatchParaEmbed(infoFilme.trailer); //forma embed do link é a forma de links do YT para iframes



    function carregaCategorias(){
        let categoriasSpan = document.getElementById('categorias');
        let categoriasDoFilme = relacionarObjs(infoFilme.id, categorias, filmes_categorias, 'filme_id', 'categoria_id');
        //console.log(categoriasDoFilme);
        categoriasSpan.innerHTML = "";
        categoriasDoFilme.forEach((elem, i, arr) => { //faz com q o array de categorias se torne uma frase com as categorias entre virgulas e entre a ultima e a primeira ao inves da virgula um e
            categoriasSpan.innerHTML += elem.categoria;
            if (i < (arr.length - 2)) {
            categoriasSpan.innerHTML += ",&nbsp;";
            } else if (i == (arr.length - 2)) {
            categoriasSpan.innerHTML += "&nbsp;e&nbsp;";
            }
        })
    }
    carregaCategorias();




}
async function carregaEpsOuFotos(infoFilme) {
    
    let h3epsOuCenas = document.getElementById('h3epsOuCenas');  //console.log(h3epsOuCenas); //h3 do título
    let divEpsOuCenas = document.getElementById('fotosDoItem'); //console.log(divEpsOuCenas); //div onde ficam os cards
    divEpsOuCenas.innerHTML = ""; //limpa a div onde vão ficar os cards antes de fazer a estruturação dinamica
    if (infoFilme.class === "filme") {
        h3epsOuCenas.innerText = "Cenas Marcantes"; //seta o titilo referente a filmes caso seja um filme
        for(const cena of infoFilme.imgsComplementares){ //loop q coloca todas os cards
            divEpsOuCenas.innerHTML += `
                <div class="card" style="width: 18rem;">
                    <img class="card-img-top" src="${await resolveImgPath(cena.src)}" alt="Card image cap">
                    <div class="card-body">
                        <p class="card-text">${cena.descricao}</p>
                    </div>
                </div>
            `;
        }
        divEpsOuCenas.querySelectorAll(':scope > *').forEach((elem) => {
            elem.style.flex = '1 1 18rem';
        });
    } else if (infoFilme.class === "serie") {
        h3epsOuCenas.innerText = "Episódios"; //seta o titilo referente a serie caso seja uma serie
        for(const ep of infoFilme.episodios){ //loop q coloca todas os cards
            divEpsOuCenas.innerHTML += `
                <div class="card" style="width: 18rem;">
                    <img class="card-img-top" src="${await resolveImgPath(ep.src)}" alt="Card image cap">
                    <div class="card-body">
                        <h5 class="card-title">${ep.titulo}</h5>
                        <p class="card-text">${ep.sinopse}</p>
                    </div>
                </div>
            `;
        };
    } else {
        console.log(`classe do filme ${infoFilme.titulo} de id ${infoFilme.id} invalida, ela deve ser apenas filme ou serie`);
        alert('Erro no carregamento dos episodios ou cenas marcantes');
    }

}

function updateDetalhes(key, data){
    if(key.includes('[')){
        const arrCenasOuEps = document.getElementById('fotosDoItem').querySelectorAll('.card');
        let index = parseInt(key.match(/\[([^\]]+)\]/)[1]);
        console.log(index);

        switch(key.split('.').pop()){
            case 'img':
                arrCenasOuEps[index].querySelector('img').src = data;
                break;
            case 'titulo':
                arrCenasOuEps[index].querySelector('h5').innerText = data;
                break;
            case 'sinopse':
            case 'descricao':
                arrCenasOuEps[index].querySelector('p').innerText = data;
                break;
            default:
                console.error('Erro ao fazer update com a key:', key);
        }
    }else{
        switch(key){
            case 'titulo':
                document.getElementById('titulo').innerText = data;
                break;
            case 'classes':{
                const arrCenasOuEps = document.getElementById('fotosDoItem').querySelectorAll('.card');
                if(data === 'filme'){
                    arrCenasOuEps.forEach(elem => {
                        elem.querySelector('h5').remove();
                    });
                }else{
                    arrCenasOuEps.forEach((elem, i) => {
                        let epTitulo = document.createElement('h5');
                        epTitulo.innerText = `Título do Ep ${i + 1}`;
                        elem.querySelector('.card-body').prepend(epTitulo);
                    });
                }
                break;
            }
            case 'sinopseGrande':
                document.getElementById('sinopse').innerText = data;
                break;
            case 'avaliacao':{
                const numEstrelas = parseFloat(data);
                const avaliacaoNum = document.getElementById('avaliacaoNum');
                avaliacaoNum.innerHTML = '&nbsp;' + numEstrelas;
                if (Number.isInteger(numEstrelas)) { //caso sejá inteiro o número iria aparecer só assim 5 ou assim 4, ai pra ficar melhor se for inteiro ele adiciona um .0
                    avaliacaoNum.innerHTML += '.0';
                }
                avaliacaoNum.innerHTML += '&nbsp;';

                const spanEstrelas = document.getElementById('estrelasIcons');
                spanEstrelas.innerHTML = "";
                colocarEstrelas(numEstrelas, spanEstrelas);
                break;
            }
            case 'trailer':{
                const link = converterYTWatchParaEmbed(data);
                if(link != null){
                    document.getElementById('iframeTrailer').src = link;
                }
                break;
            }
                
            case 'banner':
                document.getElementById('banner').src = data;
                break;
            default:
                console.log('Nenhuma necessidade de alterar algo no Preview');
        }
    }
}

export{
    carregaDadosPincipaisDetalhes,
    carregaEpsOuFotos,
    updateDetalhes
}