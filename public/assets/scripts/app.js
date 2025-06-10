const filmes_key = '/filmes';
const categorias_key = '/categorias';
const filmes_categorias_key = '/filmes_categorias';
const frases_key = '/frases';

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
    let divDeslogado = document.querySelector('div.not-logged');
    let divLogado = document.querySelector('div.logged');
    if (logged) {
        divDeslogado.style.display = 'none';
        divLogado.style.display = 'block';
    } else {
        divDeslogado.style.display = 'block';
        divLogado.style.display = 'none';
    }
});