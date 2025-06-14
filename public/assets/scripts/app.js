import { getInApi, hasParam } from '../../modules/utils/index.mjs';
import { users_key, storage_key } from './constantes.js';



String.prototype.simplify = function (){
    return this
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s+/g, "-");
}



//código geral
document.addEventListener('DOMContentLoaded', () => {
    let path = window.location.pathname;
    if(path != '/cadastro_filmes.html' && path != '/login.html' && !hasParam('preview')){
        const divDeslogado = document.querySelector('div.not-logged');
        const divLogado = document.querySelector('div.logged');

        let userId = sessionStorage.getItem(storage_key);
        if(!userId) userId = localStorage.getItem(storage_key);
        function configDeslogado(){
            divDeslogado.style.display = 'block';
            divLogado.style.display = 'none';
            divDeslogado.querySelector('.btlogin').onclick = ()=>{
                window.location.href = '/login.html';
            }
            divDeslogado.querySelector('.btsignup').onclick = ()=>{
                window.location.href = '/login.html?register';
            }
        }
        if(userId){
            divDeslogado.style.display = 'none';
            divLogado.style.display = 'block';
            getInApi(`${users_key}/${userId}`)
                .then((userData)=>{
                    divLogado.querySelector('#username').innerText = userData.login;
                    if(!userData.admin){
                        let crudBtn = document.getElementById('crud');
                        if(crudBtn) crudBtn.style.display = 'none';
                    }
                    document.getElementById('sair-conta').addEventListener('click', (e)=>{
                        sessionStorage.removeItem(storage_key);
                        localStorage.removeItem(storage_key);
                        window.location.href = window.location.href;
                    });
                })
                .catch((e)=>{
                    console.error('Erro ao buscar dados do usuário', e);
                    alert('Erro ao buscar dados do usuário');
                    configDeslogado();
                });
        }else{
            configDeslogado();

        }
    }
    switch(path){
        case'/':
        case'/index.html':
            import('./homePage.js');
            break;
        case'/detalhes.html':
            import('./detalhes.js');
            break;
        case '/cadastro_filmes.html':
            import('./cadastro_filmes.js');
            break;
        case '/login.html':
            import('./login.js');
            break;
    }

});