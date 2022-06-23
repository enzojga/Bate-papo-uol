const lista = document.querySelector('.menssagens');
let  usuario;
let menssagens =[];
const elementoQueQueroQueApareca = document.querySelector('.teste');

function reqAxios(){
    lista.innerHTML = ""
    let promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promessa.then(trataSucesso);
    console.log('estou requisitando');
}

function verificaTipo(menssagens){
    let type = menssagens.type;
    if(type === 'message'){
        return `<li class="menssagemPublica"><p>${menssagens.time}</p><strong>${menssagens.from}</strong> <p>para</p> <strong>${menssagens.to}:</strong><p>${menssagens.text}</p></li>`;
    }
    if(type === 'status'){
        return `<li class="menssagemSistema"><p>${menssagens.time}</p><strong>${menssagens.from}</strong><p>${menssagens.text}</p></li>`;
    }
    if(type === 'menssagemPrivada'){
        return `<li class="private_message"><p>${menssagens.time}</p><strong>${menssagens.from}</strong> <p>reservadamente para</p> <strong>${menssagens.to}:</strong><p>${menssagens.text}</p></li>`;
    }

}

function trataSucesso(promessa){

    const data = promessa.data;
    for(let i = 0; i < data.length;i++){
        let msgInfo = {
            from: data[i].from,
            to: data[i].to,
            text: data[i].text,
            type: data[i].type,
            time: data[i].time,
        }
        menssagens.push(msgInfo);
        console.log(menssagens[i]);
        const li = verificaTipo(menssagens[i]);
        lista.innerHTML = lista.innerHTML + li;
    }
    elementoQueQueroQueApareca.scrollIntoView();
}


function enviaMsg(){
    let msg = document.querySelector('.menssagem').value;
    const li = `<li class="menssagemPublica"><strong>${usuario}</strong> <p>para</p> <strong>Todos:</strong><p>${msg}</p></li>`
    lista.innerHTML = lista.innerHTML + li;
    let objMsg = {
        from: usuario,
        to: "Todos",
        text: msg,
        type: "message"
    }
    let promessaMsg = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages',objMsg);
    promessaMsg.then(trataMsg);
    elementoQueQueroQueApareca.scrollIntoView();
}

function getUsuario(){
    usuario = prompt('Insira seu nome');
    let userName={
        name: usuario,
    }
    let post = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants',userName);
    post.then(trataPost);
    post.catch(trataErrorPost);
}
function trataPost(post){
    console.log(post);
}

function trataErrorPost(error){
    const codigoErro = error.response.status;
    if(codigoErro === 400){
        alert('Este nome já esta em uso por favor selecione outro.')
        getUsuario();
    }
}
function trataMsg(menssagem){
    console.log(menssagem);
}
function trataErroMsg(erro){
    const codigoErro = error.response.status;
    console.log('erro ao enviar');
}


getUsuario();
reqAxios()
setInterval(reqAxios,3000);