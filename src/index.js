import axios from 'axios';

const URL = 'https://63e92743b120461c6bec0ca6.mockapi.io/list/';
const input = document.getElementById('input');
const addBtn = document.getElementById('button');
const form = document.getElementById('form');
const myUl = document.getElementById('myUL');
let currentId = 1;
window.addEventListener('DOMContentLoaded', fillTasksList);
addBtn.addEventListener('click', addTask);
myUl.addEventListener('click', handleTaskBehavior);

const getList = async () => {
  const list = await axios.get(URL);
  return list.data;
};
const addItem = task => {
  return axios.post(URL, task);
};
const updateItem = (id, status) => {
  return axios.put(`${URL}/${id}`, { isDone: status });
};
function createItem(text, id, isDone) {
  const item = `<li id=${id} class="item"><p>${text}</p><button type='button' class="closeBtn close">x</button></li>`;
  document.getElementById('myUL').insertAdjacentHTML('afterbegin', item);
  if (isDone) {
    document.getElementById(id).classList.add('checked');
  }
}

async function fillTasksList() {
  const list = await getList();
  list.map(obj => createItem(obj.item, obj.id, obj.isDone));
  currentId = list.length === 0 ? 1 : Number(list[list.length - 1].id) + 1;
}

async function addTask(e) {
  e.preventDefault();
  if (input.value === '') {
    alert('Enter task!');
  } else {
    addTaskToData(input.value);
    const list = await getList();

    currentId = list.length === 0 ? 1 : Number(list[list.length - 1].id) + 1;

    createItem(input.value, currentId);

    form.reset();
  }
}

const createTaskObj = (item, isDone) => ({
  item,
  isDone,
});

async function addTaskToData(item, isDone = false) {
  const task = createTaskObj(item, isDone);
  await addItem(task);
}

const deleteObjFromData = id => {
  return axios.delete(`${URL}/${id}`);
};

async function handleTaskBehavior({ target }) {
  if (target.nodeName === 'BUTTON') {
    const elTodel = target.parentNode;

    deleteObjFromData(elTodel.id);
    elTodel.remove();
    const list = await getList();

    currentId = list.length === 0 ? 1 : Number(list[list.length - 1].id) + 1;
  } else if (target.nodeName === 'LI') {
    let status = false;
    target.classList.toggle('checked');
    if (target.classList.contains('checked')) {
      status = true;
    }
    updateItem(target.id, status);
  }
}
