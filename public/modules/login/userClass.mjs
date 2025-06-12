import { users_key } from "../../assets/scripts/constantes.js";
import { deleteInApi , postInApi, putInApi} from "../utils/APIs.mjs";

export class User{
    #id;
    #login;
    #senha;
    #nome;
    #email;
    #admin;
    #favoritos;
    #destroyed = false;


    get id(){return this.#id;}
    get login(){return this.#login}
    get senha(){return this.#senha}
    get nome(){return this.#nome}
    get email(){return this.#email}
    get admin(){return this.#admin}
    get favoritos(){return Object.freeze([...this.#favoritos])}

    generateNewId(){
        this.#checkDestroyed();
        let newId = crypto.randomUUID()
        this.#setId = newId;
        return newId;
    }

    set #setId(id){
        this.#checkDestroyed();
        if(typeof id === 'string' || typeof id === 'number'){
            this.#id = id;
        }else{
            console.error('Invalid id');
        }
    }
    set login(login){
        this.#checkDestroyed();
        if(typeof login === 'string'){
            this.#login = login;
        }else{
            console.error('Invalid Login');
        }
    }

    set senha(senha){
        this.#checkDestroyed();
        if(typeof senha === 'string'){
            this.#senha = senha;
        }else{
            console.error('Invalid senha');
        }
    }

    set nome(nome){
        this.#checkDestroyed();
        if(typeof nome === 'string'){
            this.#nome = nome;
        }else{
            console.error('Invalid nome');
        }
    }

    set email(email){
        this.#checkDestroyed();
        if(typeof email === 'string'){
            this.#email = email;
        }else{
            console.error('Invalid email');
        }
    }

    set admin(admin){
        this.#checkDestroyed();
        if(typeof admin === 'boolean'){
            this.#admin = admin;
        }else{
            console.error('Invalid admin');
        }
    }

    constructor(dados){
        const {
            id = crypto.randomUUID(),
            login = null, //mandatory
            senha = null, //mandatory
            nome = null, //mandatory
            email = null, //mandatory
            admin = false,
            favoritos = []
        } = dados;

        if(!login || !senha || !nome || !email){
            throw new Error('Login, senha nome, e email são argumentos orbrigatórios');
        }

        this.#setId = id;
        this.login = login;
        this.senha = senha;
        this.email = email;
        this.admin = admin;
        this.#favoritos = [...favoritos];
    }

    toJSON(){
        this.#checkDestroyed();
        return {
            id: this.id,
            login: this.login,
            senha: this.senha,
            email: this.email,
            admin: this.admin,
            favoritos: this.favoritos
        }
    }
    destroy(){
        this.#checkDestroyed();
        this.#destroyed = true;
        this.#id = null;
        this.#login = null;
        this.#senha = null;
        this.#nome = null;
        this.#email = null;
        this.#admin =  null;
        this.#favoritos = [];
    }
    async deleteInServer(hard){
        this.#checkDestroyed();
        let status =  await deleteInApi(users_key, this.id, {returnStatus: true});
        if(status.success && hard){
            this.destroy();
        }
        return status;
    }

    async updateInServer(){
        this.#checkDestroyed();
        return await putInApi(users_key, this.id, this.toJSON(), {returnStatus: true});
    }

    #checkDestroyed(){
        if (this.#destroyed) {
            throw new Error('Este objeto User foi destruído e não pode ser usado');
        }
    }
}
