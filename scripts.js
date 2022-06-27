const lista = document.querySelector('.menssagens');
const listaP = document.querySelector('.listaParticipantes')
let  usuario = '';
let menssagens =[];
const elementoQueQueroQueApareca = document.querySelector('.teste');
let nomePv;
let tipoMsg;
let userName= {
    name: '',
}

function reqAxios(){
    let promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promessa.then(trataSucesso);
}

function verificaTipo(menssagens){
    let type = menssagens.type;
    if(type === 'message'){
        return `<li class="menssagemPublica"><p>(${menssagens.time})</p><strong>${menssagens.from}</strong> <p>para</p> <strong>${menssagens.to}:</strong><p>${menssagens.text}</p></li>`;
    }
    if(type === 'status'){
        return `<li class="menssagemSistema"><p>(${menssagens.time})</p><strong>${menssagens.from}</strong><p>${menssagens.text}</p></li>`;
    }
    if(type === 'private_message'){
        return `<li class="menssagemPrivada"><p>(${menssagens.time})</p><strong>${menssagens.from}</strong> <p>reservadamente para</p> <strong>${menssagens.to}:</strong><p>${menssagens.text}</p></li>`;
    }

}

function trataSucesso(promessa){
    const data = promessa.data;
    menssagens = [];
    lista.innerHTML = menssagens;
    for(let i = 0; i < data.length;i++){
        let msgInfo = {
            from: data[i].from,
            to: data[i].to,
            text: data[i].text,
            type: data[i].type,
            time: data[i].time,
        }
        menssagens.push(msgInfo);
        if(menssagens[i].to === "Todos" || menssagens[i].to === usuario || menssagens[i].from === usuario){
            adicionaMsg(menssagens[i]);
        }
    }
    elementoQueQueroQueApareca.scrollIntoView();
}


function enviaMsg(){
    let msg = document.querySelector('.menssagem').value;
    const li = `<li class="menssagemPublica"><strong>${usuario}</strong> <p>para</p> <strong>Todos:</strong><p>${msg}</p></li>`
    let objMsg = {
        from: usuario,
        to: "Teste",
        text: msg,
        type: "private_message"
    }
    let promessaMsg = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages',objMsg);
    promessaMsg.then(trataMsg);
    promessaMsg.catch(trataErroMsg);
    msg = '';
}

function getUsuario(){
    if (usuario === ''){
        usuario = prompt('Insira seu nome');
    }
    userName={
        name: usuario,
    }
    let post = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants',userName);
    post.then(trataPost);
    post.catch(trataErrorPost);
}
function mantemConexão(){
    let conexao = axios.post('https://mock-api.driven.com.br/api/v6/uol/status',userName);
    conexao.then(trataPost);
}
function trataPost(post){
    reqAxios();
}

function trataErrorPost(error){
    const codigoErro = error.response.status;
    if(codigoErro === 400){
        alert('Este nome já esta em uso por favor selecione outro.');
        usuario = '';
        getUsuario();
    }
}
function trataMsg(menssagem){
    reqAxios();
}
function trataErroMsg(erro){
    const codigoErro = erro.response.status;
    window.location.reload();
}
function exibeParticipantes(participantes){
    const listaPessoas = participantes.data;
    for(let i = 0;i < listaPessoas.length; i++){
        listaP.innerHTML += `<li onclick="selecionaPv(this)"><ion-icon name="person-circle"></ion-icon><p>${listaPessoas[i].name}</p></li>`
    }
}
function mostraSidebar(){
    const icone = document.querySelector('.sidebar');
    icone.classList.toggle('escondido');
    let participants = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    participants.then(exibeParticipantes);
}
function adicionaMsg(menssagens){
    const li = verificaTipo(menssagens);
    lista.innerHTML = lista.innerHTML + li;
}
function selecionaPv(nomePv){
    nomePv = nomePv.querySelector('p');
    console.log(nomePv);
}


getUsuario();
reqAxios();
setInterval(reqAxios,3000);
setInterval(mantemConexão,5000);