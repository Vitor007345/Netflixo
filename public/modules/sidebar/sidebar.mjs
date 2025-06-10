 export function setupSidebar() {
    let imgPerfil = document.getElementById('userimg');
    let username = document.getElementById('username');
    let sidebar = document.getElementById('sidebar-menu');
    let body = document.querySelector('body');
    let displayElementos = [];
    //fecha a sidebar, pois a sidebar deve começar fechada
    let sidebarAberto = false;
    fecharSidebar();
    //console.log(displayElementos);

    //abre e fecha a sidebar de acordo com o clique
    imgPerfil.addEventListener('click', () => {
        if (sidebarAberto) {
            fecharSidebar();
            sidebarAberto = false;
        } else {
            abrirSidebar();
            sidebarAberto = true;
        }


    })


    function fecharSidebar() {
        //fiz isso pra animação funcionar sem bugar e aparecer o body scrolavel pra direita com porra nenhuma lá qnd a sidebar fechava
        sidebar.querySelectorAll(':scope > *').forEach((elem, i) => { //seleciona todos os elementos filhos
            displayElementos[i] = window.getComputedStyle(elem).display; //salva o display deles em um array
            elem.style.display = 'none'; //desaparece com os elementos
        });
        sidebar.style.width = 0;
        body.style.overflow = 'auto'; //destrava o scroll do body
        if (window.innerWidth < 768) { //no caso do celular, volta o username pro display antigo ao fechar, no caso o none
            username.style.display = '';
        }
    }
    function abrirSidebar() {
        //fiz isso pra animação funcionar sem bugar e aparecer o body scrolavel pra direita com porra nenhuma lá qnd a sidebar fechava
        sidebar.querySelectorAll(':scope > *').forEach((elem, i) => { //seleciona todos os elementos filhos
            elem.style.display = displayElementos[i]; //volta com o display antigo para ele reaparecer
        });
        sidebar.style.width = '200px';
        body.style.overflow = 'hidden'; //trava o scroll do body
        if (window.innerWidth < 768) { //faz o username voltar pq na viewport menor q 768 ele fica invisivel
            username.style.display = 'inline';

        }

    }
}