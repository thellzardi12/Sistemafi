const tbody = document.querySelector('tbody');
const descItem = document.querySelector('#desc');
const amount = document.querySelector('#amount');
const type = document.querySelector('#type');   
const btnNew = document.querySelector('#btnNew');
const incomes = document.querySelector('.incomes');
const expenses = document.querySelector('.expenses');
const total = document.querySelector('.total');

let itens;

// Função que verifica se os campos estão vazios
btnNew.onclick = () => {
    if (descItem.value === '' || amount.value === '' || type.value === '') {
        return alert('Preencha todos os campos!');
    }

    itens.push({
        desc: descItem.value,
        amount: Math.abs(amount.value).toFixed(2),
        type: type.value,
    });

    setItensBD();

    loadItens();

    descItem.value = '';
    amount.value = '';
};

// Função para apagar os itens
function deleteItem(index) {
    itens.splice(index, 1);
    setItensBD();
    loadItens();
}

// Função para inserir os itens
function insertItem (item, index) {
    let tr = document.createElement('tr');

    tr.innerHTML = `
        <td>${item.desc}</td>
        <td>R$ ${item.amount}</td>
        <td class="columnType">${
            item.type === 'Entrada'
                ? '<i class="bx bxs-chevron-up-circle"></i>'
                : '<i class="bx bxs-chevron-down-circle"></i>'
        }</td>
        <td class="columnAction">
            <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
        </td>
        `;

    tbody.appendChild(tr);
}

// Função para carregar os itens
function loadItens() {
    itens = getItensBD();
    tbody.innerHTML = '';
    itens.forEach((item, index) => {
        insertItem(item, index);
    });

    getTotals();
}

// Função para calcular o total
function getTotals() {
    const amountIncomes = itens
        .filter((item) => item.type === 'Entrada')
        .map((transaction) => Number(transaction.amount));

    const amountExpenses = itens
        .filter((item) => item.type === 'Saída')
        .map((transaction) => Number(transaction.amount));

    const totalIncomes = amountIncomes
        .reduce((acc, cur) => acc + cur, 0)
        .toFixed(2);

    const totalExpenses = Math.abs(
       amountExpenses.reduce((acc, cur) => acc + cur, 0) 
    ).toFixed(2);

    const totalItens = (totalIncomes - totalExpenses).toFixed(2);

    incomes.innerHTML = totalIncomes;
    expenses.innerHTML = totalExpenses;
    total.innerHTML = totalItens;
}

const getItensBD = () => JSON.parse(localStorage.getItem('db_itens')) ?? [];
const setItensBD = () =>
    localStorage.setItem('db_itens', JSON.stringify(itens));

loadItens();