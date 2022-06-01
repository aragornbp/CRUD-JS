function openModal(){
    document.getElementById('modal').classList.add('active');
}
function closeModal(){
    clearFields();
    document.getElementById('modal').classList.remove('active');
}

document.getElementById('cadastrarCliente').addEventListener('click', openModal);
document.getElementById('modalClose').addEventListener('click', closeModal);


// CRUD
// const tempClient = {
//     nome: 'LUMA',
//     email: 'Luma@hotmail.com',
//     celular: '41997599769',
//     cidade: 'curitiba',
// }

function getLocalStorage(){
    return JSON.parse(localStorage.getItem('db_client')) ?? [];
}
function setLocalStorage(dbClient){
    return localStorage.setItem('db_client', JSON.stringify(dbClient));
}

// CRUD CREATE
function createClient(client){
    const dbClient = getLocalStorage();
    dbClient.push(client);
    setLocalStorage(dbClient);
}

// CRUD READ
function readClient(){
    return getLocalStorage();
}

// CRUD UPDATE
function updateClient(index , client){
    const dbClient = readClient();
    dbClient[index] = client;
    setLocalStorage(dbClient);
}

// CRUD DELETE
function deleteClient(index){
    const dbClient = readClient();
    dbClient.splice(index, 1);
    setLocalStorage(dbClient);
}
//função para validação

function isValidFields(){
    return document.getElementById('form').reportValidity();
}

//funções para o layout
function saveClient(){
    if(isValidFields()){
        const client = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            celular: document.getElementById('celular').value,
            cidade: document.getElementById('cidade').value,
        }
        const index = document.getElementById('nome').dataset.index;
        if(index == 'new'){
            createClient(client);
            closeModal();
            updateTabela();
        }
        else{
            updateClient(index , client);
            updateTabela();
            closeModal();
        }
    }
}

function clearFields(){
    const fields = document.querySelectorAll('.modal-field');
    fields.forEach(field => field.value = "");
}

function createRow(client, index){
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
    <td>${client.nome}</td>
    <td>${client.email}</td>
    <td>${client.celular}</td>
    <td>${client.cidade}</td>
    <td>
        <button type="button" class="button green" id="edit-${index}">Editar</button>
        <button type="button" class="button red" id="delete-${index}">Excluir</button>
    </td>
    `
    document.querySelector("#tableClient>tbody").appendChild(newRow);
}

function clearTable(){
    const rows = document.querySelectorAll("#tableClient>tbody tr");
    rows.forEach(row => row.parentNode.removeChild(row)) 
}

function updateTabela(){
    const dbClient = readClient();
    clearTable();
    dbClient.forEach(createRow);
}

// Interação com o layout
document.getElementById('salvar').addEventListener('click', saveClient);

//editar/exluir

function fillFiels(client){
    document.getElementById('nome').value = client.nome;
    document.getElementById('email').value = client.email;
    document.getElementById('celular').value = client.celular;
    document.getElementById('cidade').value = client.cidade;
    document.getElementById('nome').dataset.index = client.index;
}

function editClient(index){
    const client = readClient()[index];
    client.index = index;
    fillFiels(client);
    openModal();
}

function editDelete(event){
    if(event.target.type == 'button'){
        const [action, index] = event.target.id.split('-');
        if(action == 'edit'){
            editClient(index)
        }
        else{
            const client = readClient()[index];
            const response = confirm(`Deseja realmente excluir o cliente ${client.nome}`);
            if(response){
                deleteClient(index);
                updateTabela();
            }
        }
    }

}

document.querySelector('#tableClient>tbody').addEventListener('click', editDelete);

updateTabela();
