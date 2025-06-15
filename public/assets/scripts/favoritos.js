import { setupSidebar } from "../../modules/sidebar/sidebar.mjs";
import { carregaFilmes } from "../../modules/filmes/loadFilmes.mjs";
import { User } from "../../modules/login/userClass.mjs";
import { getUserId } from "../../modules/favoritos/general.mjs";


setupSidebar();
async function carregaFavoritos() {
    const userId = getUserId();
    if(userId){
        const currentUser = await User.fromId(userId);
        let filmesFav = await currentUser.favoritos.getFilmes();

        configFavParaViewPort(filmesFav, function desfavouriteCallback(filmeId){
            filmesFav = filmesFav.filter(filme=>filme.id != filmeId);
            configFavParaViewPort(filmesFav, desfavouriteCallback);
        });

       
    }else{
        alert('Você não pode acessar essa pagina sem estar logado');
        window.location.href = '/index.html';
    }
    
}
carregaFavoritos();


function configFavParaViewPort(filmesFav, desfavouriteCallback){
    
    if(window.innerWidth < 768){
        carregaFilmes(filmesFav, null, false, true, 2, desfavouriteCallback);
    }else if(window.innerWidth < 992){
        carregaFilmes(filmesFav, null, false, true, 3, desfavouriteCallback);
    }else{
        carregaFilmes(filmesFav, null, false, true, 6, desfavouriteCallback);
    }
    


    
    window.matchMedia('(min-width: 768px)').onchange = (e)=>{
        if(e.matches){
            carregaFilmes(filmesFav, null, false, true, 3, desfavouriteCallback);
        }else{
            carregaFilmes(filmesFav, null, false, true, 2, desfavouriteCallback);
        }
    };
    window.matchMedia('(min-width: 992px)').onchange = (e)=>{
        if(e.matches){
            carregaFilmes(filmesFav, null, false, true, 6, desfavouriteCallback);
        }else{
            carregaFilmes(filmesFav, null, false, true, 3, desfavouriteCallback);
        }
    };
    
}
