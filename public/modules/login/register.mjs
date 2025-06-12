import { setRegister, alertForm, removeAlert } from "./interativities.mjs";
import { postInApi, getInApi } from "../utils/index.mjs";
import { users_key } from "../../assets/scripts/constantes.js";
import { btnChange } from "./constantes.mjs";
import { User } from "./userClass.mjs";

export function configRegister(){
    setRegister(async(inputs)=>{
        try{
            const users = await getInApi(users_key);
            let erro = false;


            Object.values(inputs).forEach(elem=>{
                if(elem.value === ''){
                    alertForm('You need to fill in this field', elem);
                    erro = true;
                }else{
                    removeAlert('You need to fill in this field', elem);
                }
            });

            if(users.find(elem=>inputs.username.value === elem.login)){
                alertForm('This username alredy exists', inputs.username);
                erro = true;
            }else{
                removeAlert('This username alredy exists', inputs.username);
            }
            if(users.find(elem=>inputs.email.value === elem.email)){
                alertForm('There is aready an account with that email', inputs.email);
                erro = true;
            }else{
                removeAlert('There is aready an account with that email', inputs.email);
            }
            if(inputs.password.value !== inputs.confirmPassword.value){
                alertForm('You wrote diferent password in these fields, they need to be equal', inputs.confirmPassword);
                erro = true;
            }else{
                removeAlert('You wrote diferent password in these fields, they need to be equal', inputs.confirmPassword);
            }


            if(!erro){
                const newUser = new User({
                    login: inputs.username.value,
                    senha: inputs.password.value,
                    nome: inputs.fullName.value,
                    email: inputs.email.value,
                });
                let status = await postInApi(users_key, newUser.toJSON(), {returnStatus: true});
                if(status.success){
                    alert('Conta criada, agora realize o login');
                    btnChange.click();
                }else{
                    console.error('Erro ao salvar novo usuário');
                    console.erro(status);
                    alert('Erro ao criar conta');
                }
            }

        }catch(e){
            console.error('Erro ao buscar usuários', e);
        }
    });
}
