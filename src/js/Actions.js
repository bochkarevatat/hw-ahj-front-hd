import createRequests from './createRequests';

export default class Actions {
  constructor(page) {
    this.page = page;
  }

  init() {
    this.page.container.addEventListener('click', (event) => {
      this.openModal(event);
      this.closeModal(event);
      this.addNewTicket(event);
      this.editTicket(event);
      this.deleteTicket(event);
    });
    this.page.container.querySelector('.tickets-container').addEventListener('click', (event) => {
      Actions.showDescription(event);
      this.changeStatus(event);
    });
  }

  openModal(event) {
    event.preventDefault();
    if (event.target.classList.contains('btn-addNewTicket')) {
      this.page.modal.querySelector('.popUp-title').textContent = 'Добавить тикет';
      this.page.modal.classList.remove('none');
    }
    if (event.target.classList.contains('btn-edit')) {
      this.page.modal.querySelector('.popUp-title').textContent = 'Изменить тикет';
      const ticket = event.target.closest('.ticket');
      createRequests({ method: 'GET', query: { method: 'ticketById', id: ticket.dataset.id } }).then((data) => {
        this.page.modal.querySelector('.input-short').value = data.name;
        this.page.modal.querySelector('.input-long').value = data.description;
      });
      this.page.modal.classList.remove('none');
      this.page.modal.dataset.id = ticket.dataset.id;
    }
    if (event.target.classList.contains('btn-delete')) {
      const ticket = event.target.closest('.ticket');
      this.page.modalDelete.dataset.id = ticket.dataset.id;
      console.log(`current id: ${ticket.dataset.id}`);
      this.page.modalDelete.classList.remove('none');
    }
  }

  closeModal(event) {
    event.preventDefault();
    if (event.target.classList.contains('close')) {
      if (!event.target.classList.contains('delete')) {
        if (this.page.modal.dataset.id) delete this.page.modal.dataset.id;
        this.page.modal.querySelector('.input-short').value = '';
        this.page.modal.querySelector('.input-long').value = '';
        this.page.modal.classList.add('none');
      } else {
        if (this.page.modalDelete.dataset.id) delete this.page.modalDelete.dataset.id;
        this.page.modalDelete.classList.add('none');
      }
    }
  }

  addNewTicket(event) {
    event.preventDefault();
    if (event.target.classList.contains('ok') && !this.page.modal.dataset.id && !event.target.classList.contains('delete')) {
      createRequests({ method: 'POST', query: { method: 'createTicket' }, requestBody: { name: this.page.modal.querySelector('.input-short').value, description: this.page.modal.querySelector('.input-long').value } }).then((data) => {
        this.page.tickets.innerHTML = '';
        this.page.addTicket(this.page.tickets, data);
      });
      this.page.modal.querySelector('.input-short').value = '';
      this.page.modal.querySelector('.input-long').value = '';
      this.page.modal.classList.add('none');
    }
  }

  editTicket(event) {
    event.preventDefault();
    if (event.target.classList.contains('ok') && this.page.modal.dataset.id) {
      createRequests({ method: 'PUT', query: { method: 'editTicket', id: this.page.modal.dataset.id }, requestBody: { name: this.page.modal.querySelector('.input-short').value, description: this.page.modal.querySelector('.input-long').value } }).then((data) => {
        this.page.tickets.innerHTML = '';
        this.page.addTicket(this.page.tickets, data);
      });
      this.page.modal.querySelector('.input-short').value = '';
      this.page.modal.querySelector('.input-long').value = '';
      delete this.page.modal.dataset.id;
      this.page.modal.classList.add('none');
    }
  }

  deleteTicket(event) {
    event.preventDefault();
    if (event.target.classList.contains('ok') && event.target.classList.contains('delete')) {
      createRequests({ method: 'DELETE', query: { method: 'deleteTicket', id: this.page.modalDelete.dataset.id } }).then((data) => {
        this.page.tickets.innerHTML = '';
        this.page.addTicket(this.page.tickets, data);
      });
      delete this.page.modalDelete.dataset.id;
      this.page.modalDelete.classList.add('none');
    }
  }

  static showDescription(event) {
    if (!event.target.classList.contains('btn-ticket') && !event.target.classList.contains('status')) {
      const old = document.querySelector('.description');
      if (old) old.parentNode.removeChild(old);
      createRequests({ method: 'GET', query: { method: 'ticketById', id: event.target.dataset.id } }).then((data) => {
        const descDiv = document.createElement('div');
        descDiv.classList.add('description');
        descDiv.textContent = `${data.description}`;
        event.target.querySelector('.title').appendChild(descDiv);
      });
    }
  }

  changeStatus(event) {
    if (event.target.classList.contains('status')) {
      if (event.target.getAttribute('checked')) {
        event.target.setAttribute('checked', false);
        console.log('status: false');
      } else {
        event.target.setAttribute('checked', true);
        console.log('status: true');
      }
      createRequests({ method: 'PUT', query: { method: 'editStatus', id: event.target.id }, requestBody: { status: event.target.getAttribute('checked') } }).then((data) => {
        this.page.tickets.innerHTML = '';
        this.page.addTicket(this.page.tickets, data);
        console.log('status');
      });
    }
  }
}
