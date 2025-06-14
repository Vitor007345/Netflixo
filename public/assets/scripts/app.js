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
    if(path !== '/login.html' && !hasParam('preview')){
        const divDeslogado = document.querySelector('div.not-logged');
        const divLogado = document.querySelector('div.logged');

        let userId = sessionStorage.getItem(storage_key);
        if(!userId) userId = localStorage.getItem(storage_key);
        function configDeslogado(){
            if(path !== '/cadastro_filmes.html'){
                divDeslogado.style.display = 'block';
                divLogado.style.display = 'none';
                divDeslogado.querySelector('.btlogin').onclick = ()=>{
                    window.location.href = '/login.html';
                }
                divDeslogado.querySelector('.btsignup').onclick = ()=>{
                    window.location.href = '/login.html?register';
                }
            }

        }
        if(userId){
            if(path !== '/cadastro_filmes.html'){
                divDeslogado.style.display = 'none';
                divLogado.style.display = 'block';
            }
            getInApi(`${users_key}/${userId}`)
                .then((userData)=>{
                    document.getElementById('username').innerText = userData.login;
                    if(!userData.admin){
                        if(path === '/cadastro_filmes.html'){
                            alert('You  need to be an admin to access this page');
                            window.location.href = '/index.html';
                        }else{
                            let crudBtn = document.getElementById('crud');
                            if(crudBtn) crudBtn.style.display = 'none';
                        }
                    }
                    document.getElementById('sair-conta').addEventListener('click', (e)=>{
                        sessionStorage.removeItem(storage_key);
                        localStorage.removeItem(storage_key);
                        window.location.href = (path === '/cadastro_filmes.html')? '/index.html' : window.location.href;
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