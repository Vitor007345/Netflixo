import { users_key, filmes_key } from "../../assets/scripts/constantes.js";
import { deleteInApi , postInApi, putInApi, getInApi, deepCompare, getSafeVersionOfArray} from "../utils/index.mjs";

export class User{
    #id;
    #login;
    #senha;
    #nome;
    #email;
    #admin;
    #favoritos;
    #destroyed = false;
    #favoritosProxy = null;


    get id(){return this.#id;}
    get login(){return this.#login}
    get senha(){return this.#senha}
    get nome(){return this.#nome}
    get email(){return this.#email}
    get admin(){return this.#admin}
    get favoritos(){
        let safeFavoritos = null;
        if(!this.#destroyed){
            if(!this.#favoritosProxy){
                const userThis = this;
                safeFavoritos = getSafeVersionOfArray(this.#favoritos, [
                    function add(filmeId){
                        userThis.#checkDestroyed();
                        let sucesso = false;
                        const id = Number(filmeId);
                        if(Number.isInteger(id)){
                            this.push(id);
                            sucesso = true;
                        }
                        return sucesso;
                        },
                    function remove(filmeId){
                        userThis.#checkDestroyed();
                        let sucesso = false;
                        const id = Number(filmeId);
                        if(Number.isInteger(id)){
                            const index = this.indexOf(id);
                            if(index !== -1){
                                this.splice(index, 1);
                                sucesso = true;
                            }
                        }
                        return sucesso;
                    },
                    async function getFilmes(){
                        userThis.#checkDestroyed();
                        let filmes = null;
                        try{
                            let allFilmes = await getInApi(filmes_key);
                            filmes = allFilmes.filter((filme=>this.includes(parseInt(filme.id))))
                        }catch(e){
                            console.error('Erro no carregamento dos filmes favoritos', e);
                        }
                        return filmes;
                    }
                ]);
                this.#favoritosProxy = safeFavoritos;
            }else{
                safeFavoritos = this.#favoritosProxy;
            }
        }
        return safeFavoritos;
    }

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
    static async fromId(id){
        try{
            const userData = await getInApi(`${users_key}/${id}`);
            return new User(userData);
        }catch(e){
            console.error('Erro ao buscar dados do usário', e);
            return null;
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
        const favoritosCopy = favoritos.map(elem=>{
            const id = Number(elem);
            if(!Number.isInteger(id)){
                throw new Error('Invalid favourite ID, need to be a integer number');
            }
            return id;
        });
        this.#setId = id;
        this.login = login;
        this.senha = senha;
        this.nome = nome;
        this.email = email;
        this.admin = admin;
        this.#favoritos = favoritosCopy;
    }

    toJSON(){
        this.#checkDestroyed();
        return {
            id: this.id,
            login: this.login,
            senha: this.senha,
            nome: this.nome,
            email: this.email,
            admin: this.admin,
            favoritos: [...this.#favoritos]
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
        this.#favoritosProxy = null;
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
        let status = await getInApi(`${users_key}/${this.id}`, {returnStatus: true});
        if(status.success){
            if(!deepCompare(this.toJSON(), status.resContent)){
                status = await putInApi(users_key, this.id, this.toJSON(), {returnStatus: true});;
            }
        }else if(status.httpStatus === 404){
            status = await postInApi(users_key, this.toJSON(), {returnStatus: true});
        }
        return status;
    }

    #checkDestroyed(){
        if (this.#destroyed) {
            throw new Error('Este objeto User foi destruído e não pode ser usado');
        }
    }
}
