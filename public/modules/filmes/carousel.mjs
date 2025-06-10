function scrollAnimadoEase(elem, posInicial, posFinal, tempo = 500, passos = 100) {
    let deslocamento = posFinal - posInicial;
    for (let i = 0; i <= passos; i++) {
        setTimeout(() => {
            elem.scrollLeft = posInicial + (ease(i) * deslocamento);
        }, i * (tempo / passos));
    }


    function ease(n) {
        let x = n / passos; //divide pelos passos pra conseguir um número entre 0 e 1, pois ao elavar a 2 um numero assim, os menores se tornam ainda menores e os maiores ainda maiores
        return x * x;
    }

}


function caroulselParaPC(itemsPerView, row) {
    const track = document.getElementById(`row${row}`);
    const items = document.querySelectorAll(`#row${row} > .filme`);
    const nextBtn = document.getElementById(`next${row}`);
    const prevBtn = document.getElementById(`prev${row}`);

    let currentIndex = 0; //inicia a posição do carousel como 0
    const totalItems = items.length;

    prevBtn.style.display = 'none'; //bt prev começa invisivel pq no index 0 n existe prev, pq n tem filme antes



    function updateCarousel(noAnimation = false) {
        const itemWidth = items[0].offsetWidth; //pega o width dos itens, no caso pega só do primeiro, mas como todos tem o msm tanto faz
        const tempo = 250; //tempo da animação
        if (noAnimation) { //se o update for por cause de um resize no tamanho da tela faz sem animação, se não com animação
            track.scrollLeft = currentIndex * itemWidth;
        } else {
            scrollAnimadoEase(track, track.scrollLeft, currentIndex * itemWidth, tempo, 2000);
        }
        setTimeout(() => { //bts só atualizão após o fim da animação
            prevBtn.style.left = `${currentIndex * itemWidth}px`;
            nextBtn.style.right = `-${currentIndex * itemWidth}px`;
        }, tempo);


        if ((currentIndex + itemsPerView) === totalItems) {
            nextBtn.style.display = 'none';
        } else {
            setTimeout(() => { nextBtn.style.display = 'block'; }, tempo); //bts só voltam a aparecer após o fim da animação
        }
        if (currentIndex === 0) {
            prevBtn.style.display = 'none';
        } else {
            setTimeout(() => { prevBtn.style.display = 'block'; }, tempo); //bts só voltam a aparecer após o fim da animação
        }
        //console.log(currentIndex);
    }
    updateCarousel(true);

    nextBtn.onclick = () => {
        if (currentIndex < totalItems - itemsPerView) { //Apenas scrola se o index n estiver no max scrolavel
            currentIndex += itemsPerView; //passa todos os itens a vista para esquerda e aparece todos novos que vem da direita
            if (currentIndex > (totalItems - itemsPerView)) { //se Index for maior q o suficiente e ultrapassar o max pra n bugar ele volta pro max
                currentIndex = totalItems - itemsPerView;
            }

            updateCarousel(); //aqui faz o update dps de definir qual prox index
        }
    };

    prevBtn.onclick = () => {
        if (currentIndex > 0) { //Apenas scrola se o index n estiver no max scrolavel
            if ((currentIndex - itemsPerView) >= 0) {  //se for possível subitrair o index e ele n descer pra abixo de 0 faça isso
                currentIndex -= itemsPerView;
            } else { //se não, se ultrapassar, só vai até o 0 msm
                currentIndex = 0;
            }
            updateCarousel(); //aqui faz o update dps de definir qual prox index
        }
    };

    window.onresize = () => {
        if (window.innerWidth >= 768) { //abaixo de 768 n tem o carousel ent n prescisa atualizar
            updateCarousel(true); //atualiza sempre q muda o tamanho pq as vezes sai da posição e buga
        } else {
            let btsCarouselPC = document.querySelectorAll('.bts-custom-carousel');
            btsCarouselPC.forEach((bt) => {
                bt.style.display = 'none';
            });
        }
    };

}
function configCarouselFilmesParaViewPort(numRows) {
    //essa função basicamente faz os botão aparecer acima de 768px e sumir abaixo de 768px e seta o número de filmes que ficam na tela no carousel dependendo da viewport
    let btsCarouselPC = document.querySelectorAll('.bts-custom-carousel');
    if (window.innerWidth >= 768) {
        btsCarouselPC.forEach((bt) => {
            bt.style.display = 'block';
        });
        if (window.innerWidth >= 992) {
            for (let i = 1; i <= numRows; i++) {
                caroulselParaPC(6, i);
            }
        } else {
            for (let i = 1; i <= numRows; i++) {
                caroulselParaPC(3, i);
            }
        }
    } else {
        btsCarouselPC.forEach((bt) => {
            bt.style.display = 'none';
        });
    }
}

export {
    configCarouselFilmesParaViewPort
}