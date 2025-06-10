
let deleteCallback = null;
function onDelete(callback){
    deleteCallback = callback;
}

function createNewCene(){
    const divEpOuCenas = document.getElementById('epsOuCenas');
    

    const divGeral = document.createElement('div');
    divGeral.classList.add("epOuCena", "cena");

    const btnExcluir = document.createElement('button')
    btnExcluir.type = 'button';
    btnExcluir.classList.add("btn", "btn-secondary", "deleteBtn")
    const trashIcon = document.createElement('i');
    trashIcon.classList.add("bi", "bi-trash3");
    btnExcluir.appendChild(trashIcon);

    

    const inputGroupIMG = document.createElement('div');
    inputGroupIMG.classList.add("input-group");
    inputGroupIMG.innerHTML = `
        <span class="input-group-text">Imagem da cena</span>
        <input type="file" name="banner" class="form-control" accept="image/*">
    `;

    const ceneId = crypto.randomUUID();
    const inputGroupDescricao = document.createElement('div');
    inputGroupDescricao.classList.add("form-floating");
    inputGroupDescricao.innerHTML = `
        <textarea name="descricao" id="descricao${ceneId}" class="form-control h-100" placeholder=""></textarea>
        <label for="descricao${ceneId}" class="form-label">Descrição</label>
    `;
    

    divGeral.append(btnExcluir, inputGroupIMG, inputGroupDescricao);
    divEpOuCenas.appendChild(divGeral);


    btnExcluir.addEventListener('click', (e)=>{
        divGeral.remove();
        if(deleteCallback) deleteCallback({type: divGeral.className.split("epOuCena ").pop(), event: e});
    });

    return divGeral;               
}




function createNewEp(){
    const divEpOuCenas = document.getElementById('epsOuCenas');
    

    const divGeral = document.createElement('div');
    divGeral.classList.add("epOuCena", "ep");

    const btnExcluir = document.createElement('button')
    btnExcluir.type = 'button';
    btnExcluir.classList.add("btn", "btn-secondary", "deleteBtn")
    const trashIcon = document.createElement('i');
    trashIcon.classList.add("bi", "bi-trash3");
    btnExcluir.appendChild(trashIcon);

    

    const inputGroupIMG = document.createElement('div');
    inputGroupIMG.classList.add("input-group");
    inputGroupIMG.innerHTML = `
        <span class="input-group-text">Imagem do episódio</span>
        <input type="file" name="banner" class="form-control" accept="image/*">
    `;

    const inputGroupTitulo = document.createElement('div');
    inputGroupTitulo.classList.add("input-group");
    inputGroupTitulo.innerHTML = `
        <span class="input-group-text">Título</span>
        <input type="text" name="epTitulo" class="form-control">
    `;

    const epId = crypto.randomUUID();
    const inputGroupDescricao = document.createElement('div');
    inputGroupDescricao.classList.add("form-floating");
    inputGroupDescricao.innerHTML = `
        <textarea name="sinopse" id="sinopse${epId}" class="form-control h-100" placeholder=""></textarea>
        <label for="sinopse${epId}" class="form-label">Sinopse</label>
    `;
    

    divGeral.append(btnExcluir, inputGroupTitulo, inputGroupIMG, inputGroupDescricao);
    divEpOuCenas.appendChild(divGeral);


    btnExcluir.addEventListener('click', (e)=>{
        divGeral.remove();
        if(deleteCallback) deleteCallback({type: divGeral.className.split("epOuCena ").pop(), event: e});
    });

    return divGeral;               
}
/*
<div class="epOuCena ep">
    <button type="button" class="btn btn-secondary deleteBtn"><i class="bi bi-trash3"></i></button>
    <div class="input-group">
        <span class="input-group-text">Imagem do episódio</span>
        <input type="file" name="banner" class="form-control" accept="image/*">
    </div>
    <div class="input-group">
        <span class="input-group-text">Título</span>
        <input type="text" name="epTitulo" class="form-control">
    </div>
    <div class="form-floating">
        <textarea name="sinopse" id="sinopse" class="form-control h-100" placeholder=""></textarea>
        <label for="sinopse" class="form-label">Sinopse</label>
    </div>
</div>
*/

export {
    createNewCene,
    createNewEp,
    onDelete
}