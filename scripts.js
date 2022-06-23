const lista = document.querySelector('.menssagens');
let  usuario;
let menssagens =[];
const menssagemPublica = 'menssagemPublica';
const menssagemSistema = 'menssagemSistema';
const menssagemPrivada = 'menssagemPrivada';

function reqAxios(){
    let teste = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    teste.then(trataSucesso);
}

function verificaTipo(type){
    if(type === 'message'){
        return menssagemPublica;
    }
    if(type === 'status'){
        return menssagemSistema;
    }
    if(type === 'private_message'){
        return menssagemPrivada;
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
        const li = `<li class="${verificaTipo(menssagens[i].type)}"><strong>${menssagens[i].from}</strong> <p>para</p> <strong>${menssagens[i].to}:</strong><p>${menssagens[i].text}</p></li>`
        lista.innerHTML = lista.innerHTML + li;
    }

}


function enviaMsg(){
    let msg = document.querySelector('.menssagem').value;
    const li = `<li class="menssagemPublica"><strong>${usuario}</strong> <p>para</p> <strong>Todos:</strong><p>${msg}</p></li>`
    lista.innerHTML = lista.innerHTML + li;
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
}

getUsuario();
reqAxios();