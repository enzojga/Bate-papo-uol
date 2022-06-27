const lista = document.querySelector('.menssagens');
const listaP = document.querySelector('.listaParticipantes');
const divInicial = document.querySelector('.telaInicial > :nth-child(1)');
const spinner = document.querySelector('.telaInicial > :nth-child(2)');
let  usuario = '';
let menssagens =[];
const elementoQueQueroQueApareca = document.querySelector('.teste');
let nomePv = "Todos";
let tipoMsg = "message";
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
    let msg = document.querySelector('.barraInf input');
    const li = `<li class="menssagemPublica"><strong>${usuario}</strong> <p>para</p> <strong>Todos:</strong><p>${msg}</p></li>`
    let objMsg = {
        from: usuario,
        to: nomePv,
        text: msg.value,
        type: tipoMsg,
    }
    console.log(objMsg);
    let promessaMsg = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages',objMsg);
    promessaMsg.then(trataMsg);
    promessaMsg.catch(trataErroMsg);
    msg.value = '';
}

function getUsuario(){
    usuario = document.querySelector('.telaInicial input');
    usuario = usuario.value;
    if (usuario === ''){
        alert('Insira um nome valido')
        return;
    }
    userName={
        name: usuario,
    }
    console.log(userName);
    let post = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants',userName);
    divInicial.classList.add('escondido');
    spinner.classList.remove('escondido');
    post.then(trataPost);
    post.catch(trataErrorPost);
    return usuario;
}
function mantemConexão(){
    let conexao = axios.post('https://mock-api.driven.com.br/api/v6/uol/status',userName);
    if(usuario === ''){
        setInterval(mantemConexão,5000);
        return;
    }
    conexao.then(trataPostConex);
}
function trataPost(post){
    const desmarcaHidden = document.querySelector('.telaInicial');
    desmarcaHidden.classList.add('escondido');
    reqAxios();
    verificaPartifipantes();
}

function trataErrorPost(error){
    const codigoErro = error.response.status;
    if(codigoErro === 400){
        alert('Este nome já esta em uso por favor selecione outro.');
        divInicial.classList.remove('escondido');
        spinner.classList.add('escondido');    
        usuario = '';
        usuario = document.querySelector('.telaInicial input');
        usuario.value = '';
    }
}
function trataMsg(menssagem){
    verificaPartifipantes();
    reqAxios();
}
function trataErroMsg(erro){
    const codigoErro = erro.response.status;
    window.location.reload();
}
function exibeParticipantes(participantes){
    const listaPessoas = participantes.data;
    listaP.innerHTML = '<li onclick="selecionaPv(this)"><ion-icon name="people"></ion-icon><p>Todos</p><ion-icon name="checkmark-outline" class="seloOk"></ion-icon></li>'
    for(let i = 0;i < listaPessoas.length; i++){
        listaP.innerHTML += `<li data-identifier="participant" onclick="selecionaPv(this)"><ion-icon name="person-circle"></ion-icon><p>${listaPessoas[i].name}</p><ion-icon name="checkmark-outline" class="seloOk"></ion-icon></li>`
    }
}
function mostraSidebar(){
    const icone = document.querySelector('.sidebar');
    icone.classList.toggle('escondido');
}
function adicionaMsg(menssagens){
    const li = verificaTipo(menssagens);
    lista.innerHTML = lista.innerHTML + li;
}
function selecionaPv(nome){
    let seloOkCheck = document.querySelector('.listaParticipantes .seloOkB');
    let ionIcon = nome.querySelector(':nth-child(3)');
    nomePv = nome.querySelector('p').innerText;
    console.log(ionIcon);
    console.log(nomePv);
    if(seloOkCheck !== null){
        seloOkCheck.classList.add('seloOk')
        seloOkCheck.classList.remove('seloOkB')
    }
    ionIcon.classList.add('seloOkB');
    verificaVisibilidade();
}
function selecionaTipo(tipo){
    tipoMsg = tipo.querySelector('p').innerText;
    let seloOkCheck = document.querySelector('.visibilidade .seloOkB');
    let ionIcon = tipo.querySelector(':nth-child(3)')
    if(tipoMsg === "Publico"){
        tipoMsg = 'message';
    }else{
        tipoMsg = 'private_message';
    }
    if(seloOkCheck !== null){
        seloOkCheck.classList.add('seloOk')
        seloOkCheck.classList.remove('seloOkB')
    }
    ionIcon.classList.add('seloOkB');
    verificaVisibilidade();
}
function verificaVisibilidade(){
    if(tipoMsg !== 'message' && nomePv !== 'Todos'){
        let h3Bot = document.querySelector('.barraInf div h3');
        h3Bot.innerText = `Enviando para ${nomePv} (reservadamente)`;
        h3Bot.classList.remove('escondido');
    }else{
        let h3Bot = document.querySelector('.barraInf div h3');
        h3Bot.classList.add('escondido');
    }
}
function verificaPartifipantes(){
    let participants = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    participants.then(exibeParticipantes);
    console.log('requisitando participantes');
}
function trataPostConex(teste){
    console.log(teste);
}
verificaPartifipantes();
setInterval(reqAxios,3000);
setInterval(verificaPartifipantes,10000)
setInterval(mantemConexão,5000);