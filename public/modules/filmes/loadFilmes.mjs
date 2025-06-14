import { randomSequencePorDia, getInApi } from "../utils/index.mjs";
import { users_key, storage_key } from "../../assets/scripts/constantes.js";
import { User } from '../login/userClass.mjs'

function carregaFilmes(filmes, frases, estaNoFiltro = false) {
    const numDeRows = frases.length; //seta o número de linhas de filmes correspondente ao número de frase
    let numPorRow = filmes.length / numDeRows; //calcula o número médio de filmes por linha
    if (numPorRow < 6 && !estaNoFiltro) { //6 é o número mínimo por linha pra n ficar feio
        console.log('Banco de dados pequeno demais para o número de frases');
        console.log('Aumente o banco de dados ou diminua o número de frases');
        alert('Erro no carregamento dos filme');
        return;
    }
    //coloca o resto da divisão caso não seja inteira na primemira linha
    let numPrimeiraRow = numPorRow;
    if (!Number.isInteger(numPorRow)) {
        numPorRow = Math.floor(numPorRow);
        numPrimeiraRow = numPorRow + (filmes.length % numDeRows);
    }

    let ordemFilmes = randomSequencePorDia(0, filmes.length - 1, 7); //ordem dos filmes aléatoria por dia

    let sFilmes = document.getElementById('sectionFilmes');
    sFilmes.innerHTML = ""; //antes de botar os trem limpa oq tinha antes antes
    let c = 0; //contador de filmes
    for (let i = 1; i <= numDeRows; i++) { //percorre o número de linhas
        newFrase(frases[i - 1], sFilmes, i) //adiciona uma nova frase a cada linha
        if (i === 1) { //se for a primeira linha deve adicionar o numero geral por linha + o resto q equivale a o valor da variavel numPrimeiraRow
            for (; c < numPrimeiraRow; c++) { //repete o número de filmes da primeira linha vezes
                carregaOFilme(c, ordemFilmes, sFilmes, i, filmes);
            }
            criaBotoesCarousel(i);
        } else { //se não vai normal
            for (let j = 0; j < numPorRow; c++, j++) { //repete o número de filmes por linha vezes
                carregaOFilme(c, ordemFilmes, sFilmes, i, filmes);
            }
            criaBotoesCarousel(i);
        }
    }
    function criaBotoesCarousel(i) {
        sFilmes.querySelector(`#row${i}`).innerHTML += `
            <button id="prev${i}" class="btn btn-dark prev position-absolute  top-50 bts-custom-carousel"><span class="carousel-control-prev-icon" aria-hidden="true"></span></button>
            <button id="next${i}" class="btn btn-dark next position-absolute  top-50 bts-custom-carousel"><span class="carousel-control-next-icon" aria-hidden="true"></span></button>

         `;
    }

    async function carregaCliquesFilmes() {
        let user = null;
        let userId = sessionStorage.getItem(storage_key);
        if(!userId) userId = localStorage.getItem(storage_key);
        if(userId){
            try{
                 user = await User.fromId(userId);
            }catch(e){
                console.error(`Erro ao carregar dados do usuários: ${userId}`, e);
            }
        }

        for (let i = 0; i < filmes.length; i++) {
            //console.log(document.getElementById(`filme${i}`));
            const divFilme = document.getElementById(`filme${i}`);
            const idDoFilme = divFilme.querySelector(`#id${i}`).innerText;
            const favouriteBtn = divFilme.querySelector(`#favouriteBtn-${idDoFilme}`);

            let favoritado = configFavoritoInicial();
            
            divFilme.addEventListener('click', (e) => {
                
                if(favouriteBtn.contains(e.target)){
                    e.preventDefault();
                    if(user){
                        if(favoritado){
                            desfavoritar();
                        }else{
                            favoritar();
                        }
                        favoritado = !favoritado
                    }else{
                        alert('Para favoritar voçê precisa realizar o login');
                        window.location.href = '#';
                    }
                    
                }else{
                    window.location.href = `detalhes.html?id=${idDoFilme}`;
                }
                
            });


            function favoritar(update = true){
                const icon = favouriteBtn.querySelector('i');
                icon.classList.remove('bi-star');
                icon.classList.add('bi-star-fill');
                if(update){
                    user.favoritos.add(idDoFilme);
                    user.updateInServer();
                }
            }
            function desfavoritar(update = true){
                const icon = favouriteBtn.querySelector('i');
                icon.classList.add('bi-star');
                icon.classList.remove('bi-star-fill');
                if(update){
                    user.favoritos.remove(idDoFilme);
                    user.updateInServer();
                }
            }
            function configFavoritoInicial(){
                let favoritado = false;
                if(user && user.favoritos.includes(parseInt(idDoFilme))){
                    favoritado = true;
                    favoritar(false);
                }
                return favoritado;
            }
        }



    }
    carregaCliquesFilmes();


}
function newFrase(frase, sFilmes, row) {
    sFilmes.innerHTML += `
        <div class="row divFrase">
            <h3>${frase}</h3>
        </div>
        <div id="row${row}" class="row position-relative carousel-track">
        </div>
    `;

}
function carregaOFilme(i, ordem, sFilmes, row, filmes) {
    let infoFilme = filmes[ordem[i]];
    let linha = sFilmes.querySelector(`#row${row}`);
    linha.innerHTML += `
        <div id="filme${i}" class="filme col-6 col-md-4 col-lg-2">
          <div id="id${i}" class="d-none">${infoFilme.id}</div>  
          <div class="conteudo">
            <h4 class="titulo">${(!infoFilme.subtitulo ? infoFilme.titulo : infoFilme.titulo + "&nbsp;" + infoFilme.subtitulo)}</h4>
            <p class="sinopse">${infoFilme.sinopse}</p>
            <div class="botoes">
              <ul>
                <li class="position-relative"><a href="detalhes.html?id=${infoFilme.id}#iframeTrailer"><i class="bi bi-play"></i><div class="tooltip position-absolute start-50 bg-dark">Assista o Trailer</div></a></li>
                <li class="position-relative"><a href=""><i class="bi bi-bookmark"></i><div class="tooltip position-absolute start-50 bg-dark">Salve para assistir depois</div></a></li>
                <li class="position-relative"><a id="favouriteBtn-${infoFilme.id}" href=""><i class="bi bi-star"></i><div class="tooltip position-absolute start-50 bg-dark">Favorite</div></a></li>
              </ul>
            </div>
          </div>
          <div class="divImg">
            <img src="${infoFilme.imgPrinciapl}" alt="">
          </div>
        </div>

    `;
}

export{
    carregaFilmes
}