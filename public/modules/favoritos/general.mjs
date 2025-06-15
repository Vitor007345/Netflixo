import { storage_key } from "../../assets/scripts/constantes.js";
async function favoritar(favouriteBtn, currentUser, filmeId, update = true){
    const icon = favouriteBtn.querySelector('i');
    icon.classList.remove('bi-star');
    icon.classList.add('bi-star-fill');
    if(update){
        currentUser.favoritos.add(filmeId);
        await currentUser.updateInServer();
    }
}

async function desfavoritar(favouriteBtn, currentUser, filmeId, update = true){
    const icon = favouriteBtn.querySelector('i');
    icon.classList.add('bi-star');
    icon.classList.remove('bi-star-fill');
    if(update){
        currentUser.favoritos.remove(filmeId);
        await currentUser.updateInServer();
    }
}

function getUserId(){
    let userId = sessionStorage.getItem(storage_key);
    if(!userId) userId = localStorage.getItem(storage_key);
    return userId;
}

export{
    favoritar,
    desfavoritar,
    getUserId
}