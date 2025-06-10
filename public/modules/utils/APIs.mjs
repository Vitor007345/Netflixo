async function carregaAPIs(callback, ...URLs) {
    if (typeof callback !== 'function') {
        console.error('O argumento callback deve ser uma função');
    } else {
        try {
            let promessas = URLs.map(url => fetch(url).then(res => res.json()));
            let dados = await Promise.all(promessas);
            callback(...dados);
        } catch (e) {
            console.error('Erro no carregamento das APIs: ', e);
        }
    }
}



async function crudRequest(method, url, data, options = {}) {

    const {
        returnStatus = false,
        sendErrorsToConsole = false,
        headers = (method === 'GET')
        ? {} 
        : {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        fetchOptions = {}
    } = options;

    let status;
    let res;
    try{
        res = await fetch(url, {
            method: method,
            body: (method === 'DELETE' || method === 'GET')? undefined : JSON.stringify(data),
            headers: headers,
            ...fetchOptions
        });
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        let resJSON = await res.json();

        status = {
            success: true,
            method: method,
            resContent: resJSON,
            httpStatus: res.status
        }
    }catch (e) {
        if(sendErrorsToConsole)console.error(`${method} in ${url} API failed`);
        status = {
            success: false,
            method: method,
            error: e,
            httpStatus: res?.status
        }
        if(!returnStatus) throw e;
    }

    if(returnStatus) return status;
    else if(method === 'GET') return status.resContent;
}

async function postInApi(key, data, options = {}) {
    return crudRequest('POST', key, data, options);
}
async function putInApi(key, id, data, options = {}) {
    return crudRequest('PUT', `${key}/${id}`, data, options);
}
async function deleteInApi(key, id, options = {}) {
    return crudRequest('DELETE', `${key}/${id}`, null, options);
}
async function getInApi(key, options = {}) {
    return crudRequest('GET', key, null, options);
}
async function patchInApi(key, id, data, options = {}) {
    return crudRequest('PATCH', `${key}/${id}`, data, options);
}

async function multiplesCrudResquests(generalOptions = {}, ...crudRequestOptions) {
    let retornos = []

    //esta rodando em série e não em paralelo, pq o json server é uma bosta e tem risco de dar erro
    for (const crudRequestOp of crudRequestOptions){ 

        retornos.push(await crudRequest(
            crudRequestOp.method || generalOptions.method, 
            crudRequestOp.url || generalOptions.url, 
            crudRequestOp.data || generalOptions.data,
            {...(generalOptions.options || {}), ...(crudRequestOp.options || {})} 
        ));
    }
    return retornos;
}


async function waitUltilJsonServerIsAvailable(url, maxTimeMs = 10000, intervalMs = 200) {
    let tentativas = Math.ceil(maxTimeMs/intervalMs);
    let available = false;
    while(tentativas > 0 && !available){
        try{
            const res = await fetch(url);
            if(res.ok) available = true;
        }catch(e){
            //so ignora o erro e tenta dnv
        }
        if(!available){
            await new Promise(resolve => setTimeout(resolve, intervalMs));
            tentativas--;
        }
    }
    return available;
}

export {
    carregaAPIs,
    crudRequest,
    postInApi,
    putInApi,
    deleteInApi,
    getInApi,
    patchInApi,
    multiplesCrudResquests,
    waitUltilJsonServerIsAvailable
}