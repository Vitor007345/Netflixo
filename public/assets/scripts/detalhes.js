import { getParam, hasParam } from "../../modules/utils/index.mjs";
import carregaDetalhes from "../../modules/detalhes/index.mjs";
import { updateDetalhes } from "../../modules/detalhes/index.mjs";
import { setupFiltro } from "../../modules/busca/index.mjs"
import { setupSidebar } from "../../modules/sidebar/sidebar.mjs";

const URL_MEU_SITE = 'http://localhost:3000'




async function setupDetalhes() {
    let promessas = {
        filmes: null,
        categorias: fetch(categorias_key).then((res)=>res.json()),
        filmes_categorias: fetch(filmes_categorias_key).then((res)=>res.json())
    };

    let previewMode = hasParam('preview');
    if (previewMode) {
        document.querySelector('header').style.setProperty('display', 'none', 'important');
        document.querySelector('footer').style.setProperty('display', 'none');

        window.addEventListener('message', async(event) => {

            if (event.origin === URL_MEU_SITE) {
                const dados = event.data;

                switch(dados.mode){
                    case 'complete':{
                        try{
                            const [categorias, filmes_categorias] = await Promise.all([
                                promessas.categorias,
                                promessas.filmes_categorias
                            ]);
                            setupSidebar();
                            setupFiltro(categorias);
                            carregaDetalhes(dados.content, categorias, filmes_categorias);

                        }catch(e){
                            console.error('Erro Carregamento das APIS', e);
                        }
                        break;
                    } 
                    case 'oneInput':{
                        console.log(dados);
                        updateDetalhes(dados.inputKey, dados.content);
                        break;
                    }
                    case 'delete':
                        document.getElementById('fotosDoItem')
                            .querySelectorAll('.card')[dados.index]
                            .remove();
                        break;
                    case 'add':{
                        const card = document.createElement('div');
                        card.classList.add('card');
                        card.style.width = '18rem';
                        card.innerHTML = `
                            <img class="card-img-top" src="${dados.content.src}" alt="Card image cap">
                            <div class="card-body">
                                ${(dados.type === 'cenas')? '' : `<h5 class="card-title">${dados.content.titulo}</h5>`}
                                <p class="card-text">${dados.content.text}</p>
                            </div>
                        `;
                        document.getElementById('fotosDoItem').appendChild(card);
                        break;
                    }
                    default:
                        console.error('Error: DataModeNotFound');
                }
        
                
                
            }

        });

    } else {
        let id = getParam('id');
        let urlFilme = `${filmes_key}/${id}`;
        promessas.filmes = fetch(urlFilme).then((res)=>res.json());
        try{
            const [filme, categorias, filmes_categorias] = await Promise.all(Object.values(promessas));
            setupSidebar();
            setupFiltro(categorias)
            carregaDetalhes(filme, categorias, filmes_categorias);
        }catch(e){
            console.error('Erro Carregamento das APIS', e);
        }
        
    }
}
setupDetalhes();

