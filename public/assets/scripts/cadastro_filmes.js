import { 
    carregaAPIs, 
    getParam,
    hasParam, 
    isBase64Image, 
    base64ToFile, 
    pathImgToFile, 
    fileToBase64,
    postInApi,
    putInApi,
    deleteInApi,
    getInApi,
    patchInApi,
    multiplesCrudResquests,
    resolveImgPath,
    getImageType,
    isApiRequestImg,
    waitUltilJsonServerIsAvailable
} from "../../modules/utils/index.mjs";
import { createNewCene, createNewEp, onDelete as ceneOrEpOnDelete } from "../../modules/cadastro/epsOuCenas.mjs";
import { setupSidebar } from "../../modules/sidebar/sidebar.mjs";

const URL_MEU_SITE = 'http://localhost:3000'
const filmes_key = '/filmes';
const imgs_key = '/imgs';
const filmeId_queryParam = 'filme_id'
const inputs = {
    titulo: document.getElementById('inputTitulo'),
    classes: document.getElementById('classes'),
    sinopse: document.getElementById('sinopse'),
    sinopseGrande: document.getElementById('sinopseGrande'),
    data: document.getElementById('dataLancamento'),
    diretor:  document.getElementById('inputDiretor'),
    avaliacao:  document.getElementById('inputAvaliacao'),
    trailer:  document.getElementById('inputTrailer'),
    banner:  document.getElementById('inputBanner'),
    eps: [],
    cenas: []
}
const iframePreview = document.getElementById('preview');
const urlDetalhes = 'detalhes.html'
setupSidebar();

document.getElementById('epsOuCenas').innerHTML = '';

inputs.classes.addEventListener('change', ()=>{
    setupEpsOuCenasButtonAdd();
});

let filmeId = getParam(filmeId_queryParam);
if(filmeId){
    carregaAPIs((filme)=>{
        carregaFilmeParaEdit(filme);
        iframePreview.src = `${urlDetalhes}?preview`;
        iframePreview.addEventListener('load', ()=>{
            iframePreview.contentWindow.postMessage({mode: 'complete', content: filme}, URL_MEU_SITE);
        });
        setupEpsOuCenasButtonAdd();
        const tituloCenasOuEps = document.getElementById('cenasOuEpsTitle')
        if(filme.class === 'filme'){
            tituloCenasOuEps.querySelectorAll('span')[1].style.display = 'none';
        }else{
            tituloCenasOuEps.querySelectorAll('span')[0].style.display = 'none';
        }
    },`${filmes_key}/${filmeId}`);

}else{
    iframePreview.src = `${urlDetalhes}?preview`;
    iframePreview.addEventListener('load', ()=>{
        let urlFilme;
        if(inputs.classes.value == 'filme'){
            urlFilme = '/preview-standart/standartFilme'
        }else{
            urlFilme = '/preview-standart/standartSerie'
        }
        carregaAPIs((filme)=>{
            iframePreview.contentWindow.postMessage({mode: 'complete', content: filme}, URL_MEU_SITE);
        }, urlFilme);
            
    });
    setupEpsOuCenasButtonAdd();
}

ceneOrEpOnDelete(({type, event})=>{
    const tipoDoInput = (type === 'cena')? 'cenas' : 'eps';

    const inputAexcluir = inputs[tipoDoInput].find(elem => elem.button === event.currentTarget);
    const index = inputs[tipoDoInput].indexOf(inputAexcluir);
    if(index !== -1){
        inputs[tipoDoInput].splice(index, 1);
    }
    console.log(inputs[tipoDoInput]);


    iframePreview.contentWindow.postMessage({mode: 'delete', type: tipoDoInput, index: index}, URL_MEU_SITE);

});

carregaAPIs((filmes)=>{
    const selectFilme = document.getElementById('selectFilme');
    filmes.forEach((filme)=>{
        const option = document.createElement('option');
        option.innerText = filme.titulo;
        option.value = filme.id;
        selectFilme.appendChild(option);
    });
    const addOption = document.createElement('option');
    addOption.innerText = 'Adicionar Filme';
    addOption.value = 'add';
    selectFilme.appendChild(addOption);

    if(filmeId){
        selectFilme.value = filmeId;
    }else{
        selectFilme.value = 'add';
    }
    selectFilme.addEventListener('change', ()=>{
        const params = new URLSearchParams(window.location.search);
        if(selectFilme.value === 'add'){
            params.delete(filmeId_queryParam);
        }else{
            params.set(filmeId_queryParam, selectFilme.value);
        }
        const strParams = params.toString();
        window.location.href = 
            window.location.pathname +
            (strParams? '?':'') + 
            strParams + 
            window.location.hash;
    });

}, filmes_key);

document.getElementById('btExcluir').onclick = async()=>{
    if(filmeId){
        try{
            let filmePraDeletar = await getInApi(`${filmes_key}/${filmeId}`);
            for(const cenaOuEp of filmePraDeletar[(filmePraDeletar.class === 'filme')? 'imgsComplementares':'episodios']){
                if(isApiRequestImg(cenaOuEp.src)){
                    let imgId = cenaOuEp.src.split('/').pop();
                    try{
                        const jsonAvailable = await waitUltilJsonServerIsAvailable(cenaOuEp.src); //espera o json-server destravar do ultimo delete de um base64
                        if(jsonAvailable){
                            await deleteInApi(imgs_key, imgId);
                        }else{
                            console.error(`Erro ao deletar img:${imgId}`, e);
                        }
                    }catch(e){
                        console.error(`Erro ao deletar img:${imgId}`, e);
                    }
                    
                }
            }
            await deleteInApi(filmes_key, filmeId);

            alert('Filme deletado com sucesso');
            const params = new URLSearchParams(window.location.search);
            params.delete(filmeId_queryParam);
            let strParams = params.toString();
            window.location.href = 
                window.location.pathname +
                (strParams? '?':'') + 
                strParams + 
                window.location.hash;

            
        }catch(e){ 
            console.error('Erro ao deletar o filme');
            alert('Erro ao deletar o filme');
        }
    }else{

    }
};

document.getElementById('cadastro-filmes').addEventListener('input', async(event)=>{

    let chaveDoInput;

    let inputsArr = Object.entries(inputs);
    let i = 0
    let encontrou = false;
    while (i < inputsArr.length && !encontrou){
        const [key , value] = inputsArr[i];
        if(value === event.target){
            chaveDoInput = key;
            encontrou = true;
        }
        if(key === 'eps' || key === 'cenas'){

            let j = 0;
            while(j < value.length && !encontrou){
                let valueEntries = Object.entries(value[j]);
                let c = 0;
                while(c < valueEntries.length && !encontrou){
                    const [valueKey, valueValue] = valueEntries[c];
                    if(valueValue === event.target){
                        chaveDoInput = `${key}[${j}].${valueKey}`;
                        encontrou = true;
                    }

                    c++;
                }

                j++;
            }
            
        }

        i++;
    }
    //console.log(chaveDoInput);

    if(chaveDoInput === 'classes'){
        if(event.target.value === 'filme'){
            inputs.cenas = inputs.eps.map(elem=>{
                return convertInputsEpParaCena(elem);
            });
            inputs.eps.length = 0;
        }else{
            inputs.eps = inputs.cenas.map((elem)=>{
                return convertInputsCenaParaEp(elem);
            });
            inputs.cenas.length = 0; 
        }
    }

    let dados = event.target.value;
    let tipo = 'normal';
    if(event.target.type === 'file'){
        tipo = 'file';
        try{
            dados = await fileToBase64(event.target.files[0])
        }catch(e){
            console.error(`Erro Arquivo de IMG não encontrado no input: ${event.target}\nDe chave: ${chaveDoInput}\nErro: ${e}`);
        }
    
    }
    //console.log(dados);
    iframePreview.contentWindow.postMessage({
        mode: 'oneInput',
        inputKey: chaveDoInput,
        type: tipo,
        content: dados
    }, URL_MEU_SITE);
    
});

document.getElementById('cadastro-filmes').addEventListener('submit', async(e)=>{
    e.preventDefault();
    const alertFormBox = document.getElementById('divAlertForm');
    let dadosForms
    try{
        dadosForms = await getFormData();
        console.log(dadosForms);
        alertFormBox.style.display = 'none';

    }catch(e){
        console.error('Erro ao pegar dados do forms', e);
        alertFormBox.style.display = 'block';
        alertFormBox.querySelector('button').onclick = ()=>{
            alertFormBox.style.display = 'none';
        }
    }
    if(dadosForms){
        let sucesso = true;
        let idDoFilme;
        let requestStatus
        if(!filmeId){
            requestStatus = await postInApi(filmes_key, dadosForms, {returnStatus: true});
            
        }else{
            requestStatus = await putInApi(filmes_key, filmeId, dadosForms, {returnStatus: true});
        }
        if(!requestStatus.success){
            console.error(`Erro no ${requestStatus.method}: ${requestStatus.error}`);
            console.error((requestStatus.httpStatus)? `httpStatus: ${requestStatus.httpStatus}` : '');
            //retry
            if(parseInt(requestStatus.httpStatus) === 413){
                let imgPrinciaplCopy = dadosForms.imgPrinciapl;
                dadosForms.imgPrinciapl = null;

                let refParaImgsCompOuEps = dadosForms[(dadosForms.class === 'filme')? 'imgsComplementares' : 'episodios'];
                let imgsCompOuEpsCopy = JSON.parse(JSON.stringify(refParaImgsCompOuEps))
                refParaImgsCompOuEps.length = 0;

                let newRequestStatus;
                if(requestStatus.method === 'POST'){
                    newRequestStatus = await postInApi(filmes_key, dadosForms, {returnStatus: true});
                }else{
                    newRequestStatus = await putInApi(filmes_key, filmeId, dadosForms, {returnStatus: true});
                }

                if(newRequestStatus.success){
                    const imgPrinciaplObj = {
                        imgPrinciapl: imgPrinciaplCopy
                    }
                    let patchimgPrinciaplStatus = await patchInApi(filmes_key, newRequestStatus.resContent.id, imgPrinciaplObj, {returnStatus: true});
                    if(patchimgPrinciaplStatus.success){
                        
                        for(const elem of imgsCompOuEpsCopy){
                            let resposta = await postInApi(imgs_key, {content: elem.src}, {returnStatus: true});
                            if(resposta.success){
                               elem.src = `${imgs_key}/${resposta.resContent.id}`; 
                            }else{
                                console.error(`Erro no ${resposta.method}: ${resposta.error}`);
                                console.error((resposta.httpStatus)? `httpStatus: ${resposta.httpStatus}` : '');
                                sucesso = false;
                            }
                        }
                        
                        const imgsCompOuEpsObj = {
                            [(dadosForms.class === 'filme')? 'imgsComplementares': 'episodios']: imgsCompOuEpsCopy
                        }
                        idDoFilme = newRequestStatus.resContent.id;
                        let patchImgsCompOuEps = await patchInApi(filmes_key, idDoFilme, imgsCompOuEpsObj, {returnStatus: true});
                        if(patchImgsCompOuEps.success){
                            console.log('Atualizado com sucesso, porém sofrido');
                            console.log(`Status geral:`);
                            console.log({
                                requestStatus,
                                newRequestStatus,
                                patchimgPrinciaplStatus,
                                patchImgsCompOuEps
                            });
                        }else{
                            console.error(`Erro no ${patchImgsCompOuEps.method}: ${patchImgsCompOuEps.error}`);
                            console.error((patchImgsCompOuEps.httpStatus)? `httpStatus: ${patchImgsCompOuEps.httpStatus}` : '');
                            sucesso = false;
                        }
                    }else{
                        console.error(`Erro no ${patchimgPrinciaplStatus.method}: ${patchimgPrinciaplStatus.error}`);
                        console.error((patchimgPrinciaplStatus.httpStatus)? `httpStatus: ${patchimgPrinciaplStatus.httpStatus}` : '');
                        sucesso = false;
                    }
                }else{
                    console.error(`Erro no ${newRequestStatus.method}: ${newRequestStatus.error}`);
                    console.error((newRequestStatus.httpStatus)? `httpStatus: ${newRequestStatus.httpStatus}` : '');
                    sucesso = false;
                }
            }
        }else{
            console.log('Atualizado Com sucesso');
            idDoFilme = requestStatus.resContent.id;
        }

        if(sucesso){
            alert('Filme Salvo com sucesso')
            if(!hasParam(filmeId_queryParam)){
                const params = new URLSearchParams(window.location.search);
                params.set(filmeId_queryParam, idDoFilme);
                window.location.href = window.location.pathname + '?' + params.toString() + window.location.hash;
            }
        }
    }

});

async function getFormData(){
    const dataEntriesPromises = Object.entries(inputs).map(async([key, inputInstance]) =>{
        
        let retorno = [key, inputInstance.value];
        if(key === 'classes'){
            retorno = ['class', inputInstance.value];
        }else if(key === 'banner'){
            retorno = ['imgPrinciapl', await fileToBase64(inputInstance.files[0])];
        }else if((key === 'eps' || key === 'cenas')){
            retorno = [
                (key === 'cenas')? 'imgsComplementares' : 'episodios',
                await Promise.all(inputInstance.map(async(inputsEpsOuCenas, i)=>
                    (key === 'cenas') ?
                    {
                        id: i + 1,
                        src: await fileToBase64(inputsEpsOuCenas.img.files[0]),
                        descricao: inputsEpsOuCenas.descricao.value

                    } :
                    {
                        id: i + 1,
                        src: await fileToBase64(inputsEpsOuCenas.img.files[0]),
                        titulo: inputsEpsOuCenas.titulo.value,
                        sinopse: inputsEpsOuCenas.sinopse.value
                    }
                ))
            ];
        }

        return retorno;
    });
    const dataEntries = await Promise.all(dataEntriesPromises);
    const data = Object.fromEntries(dataEntries);
    if(data.class === 'filme'){
        delete data.episodios;
    }else{
        delete data.imgsComplementares
    }
    return data;
}

function convertInputsCenaParaEp(inputsCena){
    const divCene = inputsCena.button.parentElement;
    divCene.classList.remove('cena');
    divCene.classList.add('ep');
    const grupoImg = divCene.querySelector('.input-group');
    grupoImg.querySelector('span').innerText = 'Imagem do episódio';

    const grupoDescricao = divCene.querySelector('.form-floating');
    const textarea = grupoDescricao.querySelector('textarea');
    const label = grupoDescricao.querySelector('label');
    const newId = `sinopse${textarea.id.split('descricao').pop()}`;
    textarea.name = 'sinopse';
    textarea.id = newId;

    label.innerText = 'Sinopse';
    label.id = newId;

    const inputGroupTitulo = document.createElement('div');
    inputGroupTitulo.classList.add("input-group");
    inputGroupTitulo.innerHTML = `
        <span class="input-group-text">Título</span>
        <input type="text" name="epTitulo" class="form-control">
    `;

    divCene.insertBefore(inputGroupTitulo, inputsCena.button.nextSibling);

    return {
        button: inputsCena.button,
        img: inputsCena.img,
        titulo: inputGroupTitulo.querySelector('input[type="text"]'),
        sinopse: textarea
    
    }
}

function convertInputsEpParaCena(inputsEp){
    const divEp = inputsEp.button.parentElement;
    divEp.classList.remove('ep');
    divEp.classList.add('cena');

    const grupoImg = inputsEp.img.parentElement;
    grupoImg.querySelector('span').innerText = 'Imagem da cena';

    const grupoSinopse = inputsEp.sinopse.parentElement;
    const textarea = grupoSinopse.querySelector('textarea');
    const label = grupoSinopse.querySelector('label');
    const newId = `descricao${textarea.id.split('sinopse').pop()}`;

    textarea.name = 'descricao';
    textarea.id = newId;

    label.innerText = 'Descrição';
    label.id = newId;

    const inputGroupTitulo = inputsEp.titulo.parentElement;
    inputGroupTitulo.remove();

    return {
        button: inputsEp.button,
        img: inputsEp.img,
        descricao: textarea
    }

}



function carregaFilmeParaEdit(filme){
    inputs.titulo.value = filme.titulo;
    inputs.classes.value = filme.class;
    inputs.sinopse.value = filme.sinopse;
    inputs.sinopseGrande.value = filme.sinopseGrande;
    inputs.data.value = filme.data;
    inputs.diretor.value = filme.diretor;
    inputs.avaliacao.value = filme.avaliacao;
    inputs.trailer.value = filme.trailer;

    carregaImgNoInput(filme.imgPrinciapl, inputs.banner);
    

    
    if(filme.class === 'filme'){
        filme.imgsComplementares.forEach(imgComp => {
            const divCene = createNewCene();
            const inputsCena = {
                button: divCene.querySelector('button'),
                img: divCene.querySelector('input'),
                descricao: divCene.querySelector('textarea')
            };
            carregaImgNoInput(imgComp.src, inputsCena.img);
            inputsCena.descricao.value = imgComp.descricao;
            inputs.cenas.push(inputsCena);   
        });
        console.log(inputs.cenas);
    }else{
        filme.episodios.forEach(ep => {
            const divEp = createNewEp();
            const inputsEp = {
                button: divEp.querySelector('button'),
                img: divEp.querySelector('input[type="file"]'),
                titulo: divEp.querySelector('input[type="text"]'),
                sinopse: divEp.querySelector('textarea')
            }
            carregaImgNoInput(ep.src, inputsEp.img);
            inputsEp.titulo.value = ep.titulo;
            inputsEp.sinopse.value = ep.sinopse;
            inputs.eps.push(inputsEp);
        })
    }
    
    
}

async function carregaImgNoInput(path, input){
    const tipo = getImageType(path);
    const dataTranfer = new DataTransfer();
    if(tipo === 'base64'){
        dataTranfer.items.add(base64ToFile(path))
        input.files = dataTranfer.files;
    }else if(tipo === 'local'){
        try{
            let imgFile = await pathImgToFile(path);
            dataTranfer.items.add(imgFile);
            input.files = dataTranfer.files;
        }catch(e){
            console.error('Erro ao carregar img no form', e);
        }
            
    }else if(tipo === 'apiRequest'){
        try{
            let base64ImgObj = await getInApi(path);
            dataTranfer.items.add(base64ToFile(base64ImgObj.content))
            input.files = dataTranfer.files;
        }catch(e){
            console.error('Erro ao Acessar img de apiRequest', e);
        }
    }else{
        console.error('imgTypeUnknown');
    }
}

function setupEpsOuCenasButtonAdd(){
    const btnAdd = document.getElementById('btnAdd');
    if(inputs.classes.value == 'filme'){
        btnAdd.onclick = ()=>{
            const divCene = createNewCene();
            inputs.cenas.push({
                button: divCene.querySelector('button'),
                img: divCene.querySelector('input'),
                descricao: divCene.querySelector('textarea')
            });
            iframePreview.contentWindow.postMessage({
                mode: 'add',
                type: 'cenas',
                content: {
                    src: null,
                    text: 'Aqui será a Descrição'
                }
            }, URL_MEU_SITE);
        };
    }else{
        btnAdd.onclick = ()=>{
            const divEp = createNewEp();
            inputs.eps.push({
                button: divEp.querySelector('button'),
                img: divEp.querySelector('input[type="file"]'),
                titulo: divEp.querySelector('input[type="text"]'),
                sinopse: divEp.querySelector('textarea')
            });
            iframePreview.contentWindow.postMessage({
                mode: 'add',
                type: 'eps',
                content:{
                    src: null,
                    titulo: 'Titulo do ep',
                    text: 'Sinopse do ep'
                }
            }, URL_MEU_SITE)
        };
    }
}







