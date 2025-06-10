import { randomPorDia, randomSequencePorDia } from "../utils/random.mjs";
function setupDestaques(dados) {
    let numDestaques = randomPorDia(3, 6, 0); //um número de destques aleatorio de 3 a 6, diferente a cada dia
    let divBtCarousel = document.querySelector('.destaques .carousel-indicators');
    let divCarouselItems = document.querySelector('.destaques .carousel-inner');
    let sequenciaDetalhes = randomSequencePorDia(0, dados.length - 1, 1).slice(0, numDestaques); //cria uma sequencia com numero de destaques como tamanho, podendo ter número de 1 ao max dos dados, ela é diferente a cada dia


    //seta o primeiro botão e slide como active

    let id = sequenciaDetalhes[0];
    let info = dados[id];


    divBtCarousel.innerHTML = `
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
    `;

    divCarouselItems.innerHTML = `
        <div class="carousel-item active">

            <div class="carousel-img-div">
                <div class="degrade"></div>
                <img src="${info.imgPrinciapl}" class="d-block w-100 custom-img-carousel" alt="...">
            </div>
                    
            <div class="carousel-caption d-none d-md-block custom-caption">
                <h5>${(!info.subtitulo) ? info.titulo : info.titulo + "&nbsp;" + info.subtitulo}</h5>
                <p>${info.sinopse}</p>
            </div>
        </div>

    `;


    //seta o resto normal sem o active

    for (let i = 1; i < numDestaques; i++) {
        divBtCarousel.innerHTML += `
            <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="${i}" aria-label="Slide ${i + 1}"></button>
        `;

        id = sequenciaDetalhes[i];
        info = dados[id];

        divCarouselItems.innerHTML += `
            <div class="carousel-item">

                <div class="carousel-img-div">
                    <div class="degrade"></div>
                    <img src="${info.imgPrinciapl}" class="d-block w-100 custom-img-carousel" alt="...">
                </div>
                    
                <div class="carousel-caption d-none d-md-block custom-caption">
                    <h5>${(!info.subtitulo) ? info.titulo : info.titulo + "&nbsp;" + info.subtitulo}</h5>
                    <p>${info.sinopse}</p>
                </div>
            </div>

            `;
    }



    function carregaCliquesDestaques() {
        for (let i = 0; i < numDestaques; i++) {
            let idAtual = sequenciaDetalhes[i]; //console.log(idAtual);
            let infoAtual = dados[idAtual]; //console.log(infoAtual);
            divCarouselItems.querySelectorAll('.carousel-item')[i].addEventListener('click', () => {
                window.location.href = `detalhes.html?id=${infoAtual.id}`;
            }); //console.log(divCarouselItems.querySelectorAll('.carousel-item')[i]);
        }
    }
    carregaCliquesDestaques();


}
function configAutoplayDestaques() {
    const divCarouselDestaques = document.getElementById('carouselExampleCaptions');
    const carousel = bootstrap.Carousel.getOrCreateInstance(divCarouselDestaques);

    //Pausar autoplay qnd o mouse passar pelo elemento
    divCarouselDestaques.addEventListener('mouseenter', () => {
        carousel.pause();  //Pausa o autoplay
    });



    //Despausar o autoplay qnd o mouse sair
    divCarouselDestaques.addEventListener('mouseleave', () => {
        carousel.cycle();  //Volta o autoplay
    });
}
export {
    setupDestaques,
    configAutoplayDestaques
}