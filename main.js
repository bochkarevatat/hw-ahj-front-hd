(()=>{"use strict";function t(t){return new Promise(((e,s)=>{const a=new XMLHttpRequest;a.open(t.method,"http://localhost:7060/allTickets"+function(t){const e=new URLSearchParams;for(const s in t.query)Object.prototype.hasOwnProperty.call(t.query,s)&&e.append(s,t.query[s]);return`?${e}`}(t)),"POST"===t.method||"PUT"===t.method?a.send(JSON.stringify(t.requestBody)):a.send(),a.addEventListener("load",(()=>{if(a.status>=200&&a.status<300)try{if(a.response){const t=JSON.parse(a.response);e(t)}}catch(t){s(t)}else s(new Error(`${a.status}: ${a.responseText}`))}))}))}class e{constructor(t){this.page=t}init(){this.page.container.addEventListener("click",(t=>{this.openModal(t),this.closeModal(t),this.addNewTicket(t),this.editTicket(t),this.deleteTicket(t)})),this.page.container.querySelector(".tickets-container").addEventListener("click",(t=>{e.showDescription(t),this.changeStatus(t)}))}openModal(e){if(e.preventDefault(),e.target.classList.contains("btn-addNewTicket")&&(this.page.modal.querySelector(".popUp-title").textContent="Добавить тикет",this.page.modal.classList.remove("none")),e.target.classList.contains("btn-edit")){this.page.modal.querySelector(".popUp-title").textContent="Изменить тикет";const s=e.target.closest(".ticket");t({method:"GET",query:{method:"ticketById",id:s.dataset.id}}).then((t=>{this.page.modal.querySelector(".input-short").value=t.name,this.page.modal.querySelector(".input-long").value=t.description})),this.page.modal.classList.remove("none"),this.page.modal.dataset.id=s.dataset.id}if(e.target.classList.contains("btn-delete")){const t=e.target.closest(".ticket");this.page.modalDelete.dataset.id=t.dataset.id,console.log(`current id: ${t.dataset.id}`),this.page.modalDelete.classList.remove("none")}}closeModal(t){t.preventDefault(),t.target.classList.contains("close")&&(t.target.classList.contains("delete")?(this.page.modalDelete.dataset.id&&delete this.page.modalDelete.dataset.id,this.page.modalDelete.classList.add("none")):(this.page.modal.dataset.id&&delete this.page.modal.dataset.id,this.page.modal.querySelector(".input-short").value="",this.page.modal.querySelector(".input-long").value="",this.page.modal.classList.add("none")))}addNewTicket(e){e.preventDefault(),!e.target.classList.contains("ok")||this.page.modal.dataset.id||e.target.classList.contains("delete")||(t({method:"POST",query:{method:"createTicket"},requestBody:{name:this.page.modal.querySelector(".input-short").value,description:this.page.modal.querySelector(".input-long").value}}).then((t=>{this.page.tickets.innerHTML="",this.page.addTicket(this.page.tickets,t)})),this.page.modal.querySelector(".input-short").value="",this.page.modal.querySelector(".input-long").value="",this.page.modal.classList.add("none"))}editTicket(e){e.preventDefault(),e.target.classList.contains("ok")&&this.page.modal.dataset.id&&(t({method:"PUT",query:{method:"editTicket",id:this.page.modal.dataset.id},requestBody:{name:this.page.modal.querySelector(".input-short").value,description:this.page.modal.querySelector(".input-long").value}}).then((t=>{this.page.tickets.innerHTML="",this.page.addTicket(this.page.tickets,t)})),this.page.modal.querySelector(".input-short").value="",this.page.modal.querySelector(".input-long").value="",delete this.page.modal.dataset.id,this.page.modal.classList.add("none"))}deleteTicket(e){e.preventDefault(),e.target.classList.contains("ok")&&e.target.classList.contains("delete")&&(t({method:"DELETE",query:{method:"deleteTicket",id:this.page.modalDelete.dataset.id}}).then((t=>{this.page.tickets.innerHTML="",this.page.addTicket(this.page.tickets,t)})),delete this.page.modalDelete.dataset.id,this.page.modalDelete.classList.add("none"))}static showDescription(e){if(!e.target.classList.contains("btn-ticket")&&!e.target.classList.contains("status")){const s=document.querySelector(".description");s&&s.parentNode.removeChild(s),t({method:"GET",query:{method:"ticketById",id:e.target.dataset.id}}).then((t=>{const s=document.createElement("div");s.classList.add("description"),s.textContent=`${t.description}`,e.target.querySelector(".title").appendChild(s)}))}}changeStatus(e){e.target.classList.contains("status")&&(e.target.getAttribute("checked")?(e.target.setAttribute("checked",!1),console.log("status: false")):(e.target.setAttribute("checked",!0),console.log("status: true")),t({method:"PUT",query:{method:"editStatus",id:e.target.id},requestBody:{status:e.target.getAttribute("checked")}}).then((t=>{this.page.tickets.innerHTML="",this.page.addTicket(this.page.tickets,t),console.log("status")})))}}const s=new class{constructor(){this.container=null,this.tickets=null,this.checkboxes=[],this.addBtn=null,this.modal=null,this.modalDelete=null}bindToDOM(t){if(!(t instanceof HTMLElement))throw new Error("Container is not HTMLElement");this.container=t,this.tickets=[],this.checkboxes=[]}checkBinding(){if(null===this.container)throw new Error("Board not bind to DOM")}draw(){this.checkBinding();const e=document.createElement("button");e.classList.add("btn-addNewTicket"),e.type="button",e.textContent="Добавить тикет",this.container.appendChild(e),this.addBtn=e;const s=document.createElement("div");s.classList.add("tickets-container"),this.container.appendChild(s),this.tickets=s,t({method:"GET",query:{method:"allTickets"}}).then((t=>{this.addTicket(s,t)})),this.createModal(),this.createMDelete()}addTicket(t,e){for(let s=0;s<e.length;s+=1){const a=document.createElement("div");a.classList.add("ticket"),a.dataset.id=`${e[s].id}`,t.appendChild(a);const n=document.createElement("div");n.classList.add("check-container"),a.appendChild(n);const i=document.createElement("input");i.classList.add("status"),i.type="checkbox",e[s].status&&i.setAttribute("checked",!0),i.id=`${e[s].id}`,n.appendChild(i),this.checkboxes.push(i);const d=document.createElement("span");d.classList.add("title"),d.textContent=`${e[s].name}`,a.appendChild(d);const o=document.createElement("div");o.classList.add("date-container"),o.textContent=(new Date).toLocaleString(),a.appendChild(o);const c=document.createElement("div");c.classList.add("btns-container"),a.appendChild(c);const l=document.createElement("button");l.classList.add("btn-edit","btn-ticket"),l.textContent=" ",l.type="button",c.appendChild(l);const r=document.createElement("button");r.classList.add("btn-delete","btn-ticket"),r.textContent="",r.type="button",c.appendChild(r)}}createModal(){const t=document.createElement("div");t.classList.add("pop-up","none"),this.container.appendChild(t);t.innerHTML="\n        <div class='popUp-title'>Наименование</div>\n        <div class='input-container'>\n          <label>Краткое описание:</label>\n          <input class='input-short' type='text'>\n        </div>\n        <div class='input-container'>\n          <label>Подробное описание:</label>\n          <textarea class='input-long' type='text'></textarea>\n        </div>\n        <div class='modal-btn'>\n          <button class='close m-btn' type='button'>Отмена</button>\n          <button class='ok m-btn' type='button'>Ок</button>\n        </div>\n    ",this.modal=t}createMDelete(){const t=document.createElement("div");t.classList.add("pop-up","none"),this.container.appendChild(t);t.innerHTML="\n        <div class='popUp-title'>Удалить тикет</div>\n        <div class='text-container'>\n          Вы уверены, что хотите удалить тикет? Это действие необратимо.\n        </div>\n        <div class='modal-btn'>\n          <button class='close m-btn delete' type='button'>Отмена</button>\n          <button class='ok m-btn delete' type='button'>Ок</button>\n        </div>\n    ",this.modalDelete=t}};s.bindToDOM(document.querySelector("#container")),s.draw();new e(s).init(),console.log("up")})();