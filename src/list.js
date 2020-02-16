const cardModule = require('./card');

const listModule = {
  base_url: null,

  setBaseUrl: (url) => {
    listModule.base_url = url+'/lists';
  },

  showAddModal: () => {
    let modal = document.getElementById('addListModal');
    modal.classList.add('is-active');
  },

  handleAddFormSubmit: async (event) => {
    let data = new FormData(event.target);
    
    let nbListes = document.querySelectorAll('.panel').length;
    data.set('page_order', nbListes);

    try {
      let response = await fetch(listModule.base_url, {
        method: "POST",
        body: data
      }); 
      if (response.status !== 200) {
        let error = await response.json();
        throw error;
      } else {
        const list = await response.json();
        let newList = listModule.makeListDOMObject(list.name, list.id);
        listModule.addListToDOM(newList);
      }
    } catch (error) {
      alert("Impossible de créer une liste");
      console.error(error);
    }
  },

  handleEditListForm: async (event) => {
    const listId = event.target.oid;
    try {
      let response = await fetch(listModule.base_url+'/'+listId,{
        method: "PATCH",
        body: event.detail.formData
      });
      if (response.status !== 200) {
        let error = await response.json();
        throw error;
      } else {
        let list = await response.json();
        event.target.name = list.name;
      }
    } catch (error) {
      alert("Impossible de modifier la liste");
      console.error(error);
    }
  },

  makeListDOMObject: (listName, listId) => {
    let newList = document.createElement('o-list');
    newList.name = listName;
    newList.oid = listId;
    newList.addEventListener('save-list-name', listModule.handleEditListForm);
    newList.addEventListener('add-card', cardModule.showAddModal);
    newList.addEventListener('delete-list', listModule.deleteList);
    return newList;
  },

  addListToDOM: (newList) => {
    let lastColumn = document.getElementById('addListButton').closest('.column');
    lastColumn.before(newList);
  },

  deleteList: async (event) => {
    const listId = event.target.oid;
    if (event.target.hasCards()) {
      alert("Impossible de supprimer une liste non vide");
      return;
    }
    if (!confirm("Supprimer cette liste ?")) {
      return;
    }
    try {
      let response = await fetch(listModule.base_url+'/'+listId, {
        method: "DELETE"
      });
      if (response.ok) {
        event.target.remove();
      } else {
        let error = await response.json();
        throw error;
      }
    } catch (error) {
      alert("Impossible de supprimer la liste.");
      console.log(error);
    }
  },

  updateAllCards: (cards, listId) => {
    cards.forEach( (card, position) => {
      const cardId = card.getAttribute('card-id');
      let data = new FormData();
      data.set('position', position);
      data.set('list_id', listId);
      fetch( cardModule.base_url+'/'+cardId, {
        method: "PATCH",
        body: data
      });
    });
  },

  handleDropCard: (event) => {
    let cardElement = event.item;
    let originList = event.from;
    let targetList = event.to;

    let cards = originList.querySelectorAll('.box');
    let listId = originList.closest('.panel').getAttribute('list-id');
    listModule.updateAllCards(cards, listId);

    if (originList !== targetList) {
      cards = targetList.querySelectorAll('.box')
      listId = targetList.closest('.panel').getAttribute('list-id');
      listModule.updateAllCards(cards, listId);
    }
  }

};

module.exports = listModule;