String.prototype.simplify = function (){
    return this
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s+/g, "-");
}

let logged = true;

//código geral
document.addEventListener('DOMContentLoaded', () => {
    let path = window.location.pathname;
    if(path != '/cadastro_filmes.html' && path != '/login.html'){
        let divDeslogado = document.querySelector('div.not-logged');
        let divLogado = document.querySelector('div.logged');
        if (logged) {
            divDeslogado.style.display = 'none';
            divLogado.style.display = 'block';
        } else {
            divDeslogado.style.display = 'block';
            divLogado.style.display = 'none';
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
    }

});