/*
            <form id="signin" class="">
                <div class=" mb-3 input-group">
                    <span class="input-group-text"><i class="bi bi-person-vcard"></i></i></span>
                    <div class="form-floating">
                        <input type="text" id="nameInput" class="form-control" placeholder="">
                        <label for="nameInput" class="form-label">Full name</label>
                    </div>
                </div>
                <div class=" mb-3 input-group">
                    <span class="input-group-text"><i class="bi bi-person-fill"></i></span>
                    <div class="form-floating">
                        <input type="text" id="usernameInput" class="form-control" placeholder="">
                        <label for="usernameInput" class="form-label">Username</label>
                    </div>
                </div>
                <div class=" mb-3 input-group">
                    <span class="input-group-text"><i class="bi bi-envelope"></i></span>
                    <div class="form-floating">
                        <input type="text" id="emailInput" class="form-control" placeholder="">
                        <label for="emailInput" class="form-label">Email</label>
                    </div>
                </div>
                <div class="mb-3 input-group">
                    <span class="input-group-text"><i class="bi bi-lock"></i></span>
                    <div class="form-floating">
                        <input type="password" id="passwordInput" class="form-control" placeholder="">
                        <label for="passwordInput">Password</label>
                    </div>
                    <button type="button" class="input-group-text"><i class="bi bi-eye-slash"></i></button>
                </div>
                <div class="mb-3 input-group">
                    <span class="input-group-text"><i class="bi bi-lock"></i></span>
                    <div class="form-floating">
                        <input type="password" id="confirmPasswordInput" class="form-control" placeholder="">
                        <label for="confirmPasswordInput">Confirm your password</label>
                    </div>
                    <button type="button" class="input-group-text"><i class="bi bi-eye-slash"></i></button>
                </div>
                <div class="options d-flex justify-content-between">
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" role="switch" id="rememberInput">
                        <label class="form-check-label" for="rememberInput">Remember me</label>
                    </div>
                </div>
                <div class="buttons d-flex justify-content-center flex-column align-items-center">
                    <button type="submit" class="btn btn-dark">Sign up</button>
                    <div class="createAccount d-flex justify-content-center flex-column align-items-center">
                        <span>Already has an account?</span>
                        <span>Log-in</span>
                    </div>
                </div>
            </form>
*/
import { loginForms } from "./constantes.mjs";
let isLogin = true;
let registerCallback = null;
let loginCallback = null;

const inputs = {
    fullName: null,
    username: null,
    email: document.getElementById('emailInput'),
    password: document.getElementById('passwordInput'),
    confirmPassword: null,
    rememberMe: document.getElementById('rememberInput')
};

function setLogin(callback){
    loginCallback = callback
}
function setRegister(callback){
    registerCallback = callback;
}

function general(){
    const passwordGroups = loginForms.querySelectorAll('.passwordGroup');
    passwordGroups.forEach(elem=>{
        const botao = elem.querySelector('button');
        const input = elem.querySelector('div > input');
        let see = false;
        botao.onclick = ()=>{
            if(see){
                botao.innerHTML = '<i class="bi bi-eye-slash">';
                input.type = 'password';
                see = false;
            }else{
                botao.innerHTML = '<i class="bi bi-eye"></i>';
                input.type = 'text';
                see = true;
            }
        };
    });
}

function cleanForms(inputs){
    Object.entries(inputs).forEach(([key, elem])=>{
        if(elem && key != 'rememberMe'){
            elem.value = '';
        }
    });
}




function setupInterativities(){
    console.log(inputs);
    general();
    const btnChange = document.getElementById('changeBtn');
    btnChange.addEventListener('click', ()=>{
        const titulo = document.querySelector('.loginBox > h3');
        const emailGroup = loginForms.querySelector('.emailGroup');
        cleanForms(inputs);
        if(isLogin){
            titulo.innerText = 'Registration';
            emailGroup.querySelector('span').innerHTML = '<i class="bi bi-envelope"></i>';
            emailGroup.querySelector('div > label').innerText = 'Email';
            loginForms.insertAdjacentHTML('afterbegin', `
                <div class=" mb-3 input-group">
                    <span class="input-group-text"><i class="bi bi-person-vcard"></i></i></span>
                    <div class="form-floating">
                        <input type="text" id="nameInput" class="form-control" placeholder="">
                        <label for="nameInput" class="form-label">Full name</label>
                    </div>
                </div>
                <div class=" mb-3 input-group">
                    <span class="input-group-text"><i class="bi bi-person-fill"></i></span>
                    <div class="form-floating">
                        <input type="text" id="usernameInput" class="form-control" placeholder="">
                        <label for="usernameInput" class="form-label">Username</label>
                    </div>
                </div>
            `);
            loginForms.querySelector('.forgotPassword').style.display = 'none';
            document.getElementById('submitBtn').innerText = 'Sign-up';
            loginForms.querySelector('.buttons > div > span').innerText = 'Already has an account?';
            btnChange.innerText = 'Log-in';
            loginForms.querySelector('.options').insertAdjacentHTML('beforebegin', `
                <div class="mb-3 input-group passwordGroup">
                    <span class="input-group-text"><i class="bi bi-lock"></i></span>
                    <div class="form-floating">
                        <input type="password" id="confirmPasswordInput" class="form-control" placeholder="">
                        <label for="confirmPasswordInput">Confirm your password</label>
                    </div>
                    <button type="button" class="input-group-text"><i class="bi bi-eye-slash"></i></button>
                </div>
            `);
            inputs.fullName = loginForms.querySelector('#nameInput');
            inputs.username = loginForms.querySelector('#usernameInput');
            inputs.confirmPassword = loginForms.querySelector('#confirmPasswordInput');
            general();
        }else{
            titulo.innerText = 'Login';
            emailGroup.querySelector('span').innerHTML =  '<i class="bi bi-person-fill"></i>';
            emailGroup.querySelector('div > label').innerText = 'Email or Username';
            loginForms.querySelectorAll(':scope > :nth-child(-n+2)').forEach(elem=>elem.remove());
            loginForms.querySelector('.forgotPassword').style.display = 'block';
            document.getElementById('submitBtn').innerText = 'Login';
            loginForms.querySelector('.buttons > div > span').innerText = "Don't have an account?";
            btnChange.innerText = 'Create one';
            loginForms.querySelectorAll('.passwordGroup')[1].remove();

            inputs.fullName = null;
            inputs.username = null;
            inputs.confirmPassword = null;
            
        }
        isLogin = !isLogin;
    });
}

loginForms.addEventListener('submit', (e)=>{
    e.preventDefault();
    if(isLogin){
        if(loginCallback) loginCallback(inputs);
    }else{
        if(registerCallback) registerCallback(inputs);
    }
})


export {
    setupInterativities,
    setLogin,
    setRegister
}

