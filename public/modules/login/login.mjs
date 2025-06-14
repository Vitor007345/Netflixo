import { setLogin, alertForm, removeAlert } from "./interativities.mjs";
import { getInApi } from "../utils/index.mjs";
import { users_key, storage_key } from "../../assets/scripts/constantes.js";
export function configLogin(){
    setLogin(async(inputs)=>{
        try{
            const user = await getInApi(users_key);
            const currentUser = user.find(elem=>{
                return (inputs.email.value === elem.email || inputs.email.value === elem.login) && (inputs.password.value === elem.senha);
            })
            if(currentUser){
                if(inputs.rememberMe.checked){
                    localStorage.setItem(storage_key, currentUser.id);
                }else{
                    sessionStorage.setItem(storage_key, currentUser.id);
                }
                window.location.href = '/index.html';
            }else{
                alertForm('Username, email or password incorrect', inputs.password);
            }
        }catch(e){
            console.error('Erro ao carregar usuários');
        }
    });
}

