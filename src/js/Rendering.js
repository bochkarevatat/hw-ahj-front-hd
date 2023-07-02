import createRequests from './createRequests';

export default class Rendering {
  constructor() {
    this.container = null;
    this.tickets = null;
    this.checkboxes = [];
    this.addBtn = null;
    this.modal = null;
    this.modalDelete = null;
  }

  bindToDOM(container) {
    if (!(container instanceof HTMLElement)) throw new Error('Container is not HTMLElement');
    this.container = container;
    this.tickets = [];
    this.checkboxes = [];
  }

  checkBinding() {
    if (this.container === null) throw new Error('Board not bind to DOM');
  }

  draw() {
    this.checkBinding();

    const btnCreate = document.createElement('button');
    btnCreate.classList.add('btn-addNewTicket');
    btnCreate.type = 'button';
    btnCreate.textContent = 'Добавить тикет';
    this.container.appendChild(btnCreate);
    this.addBtn = btnCreate;

    const divTickets = document.createElement('div');
    divTickets.classList.add('tickets-container');
    this.container.appendChild(divTickets);
    this.tickets = divTickets;

    createRequests({ method: 'GET', query: { method: 'allTickets' } }).then((data) => {
      this.addTicket(divTickets, data);
    });

    this.createModal();
    this.createMDelete();
  }

  addTicket(elementParent, data) {
    for (let i = 0; i < data.length; i += 1) {
      const divTicket = document.createElement('div');
      divTicket.classList.add('ticket');
      // divTicket.dataset.id = `${data[i].id}`;
      divTicket.dataset.id = `${data[i].id}`;
      elementParent.appendChild(divTicket);

      const divCheckbox = document.createElement('div');
      divCheckbox.classList.add('check-container');
      divTicket.appendChild(divCheckbox);

      const checkbox = document.createElement('input');
      checkbox.classList.add('status');
      checkbox.type = 'checkbox';
      if (data[i].status) checkbox.setAttribute('checked', true);
      checkbox.id = `${data[i].id}`;
      divCheckbox.appendChild(checkbox);
      this.checkboxes.push(checkbox);

      const title = document.createElement('span');
      title.classList.add('title');
      title.textContent = `${data[i].name}`;
      divTicket.appendChild(title);

      const divDate = document.createElement('div');
      divDate.classList.add('date-container');

      divDate.textContent = new Date().toLocaleString();
      divTicket.appendChild(divDate);

      const divBtns = document.createElement('div');
      divBtns.classList.add('btns-container');
      divTicket.appendChild(divBtns);

      const btnEdit = document.createElement('button');
      btnEdit.classList.add('btn-edit', 'btn-ticket');
      btnEdit.textContent = ' ';
      btnEdit.type = 'button';
      divBtns.appendChild(btnEdit);

      const btnDel = document.createElement('button');
      btnDel.classList.add('btn-delete', 'btn-ticket');
      btnDel.textContent = '';
      btnDel.type = 'button';
      divBtns.appendChild(btnDel);
    }
  }

  createModal() {
    const popUp = document.createElement('div');
    popUp.classList.add('pop-up', 'none');
    this.container.appendChild(popUp);

    const content = `
        <div class='popUp-title'>Наименование</div>
        <div class='input-container'>
          <label>Краткое описание:</label>
          <input class='input-short' type='text'>
        </div>
        <div class='input-container'>
          <label>Подробное описание:</label>
          <textarea class='input-long' type='text'></textarea>
        </div>
        <div class='modal-btn'>
          <button class='close m-btn' type='button'>Отмена</button>
          <button class='ok m-btn' type='button'>Ок</button>
        </div>
    `;

    popUp.innerHTML = content;

    this.modal = popUp;
  }

  createMDelete() {
    const deleteContainer = document.createElement('div');
    deleteContainer.classList.add('pop-up', 'none');
    this.container.appendChild(deleteContainer);

    const content = `
        <div class='popUp-title'>Удалить тикет</div>
        <div class='text-container'>
          Вы уверены, что хотите удалить тикет? Это действие необратимо.
        </div>
        <div class='modal-btn'>
          <button class='close m-btn delete' type='button'>Отмена</button>
          <button class='ok m-btn delete' type='button'>Ок</button>
        </div>
    `;

    deleteContainer.innerHTML = content;

    this.modalDelete = deleteContainer;
  }
}
