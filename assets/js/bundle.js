(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

  class CardElement extends HTMLElement {
  
      set title(value) {
          this._titleElement.textContent = this._titleForm.elements.title.value = value;
      }
  
      set color(value) {
          this.style.backgroundColor = 
          this._titleForm.elements.color.value = value;
      }
  
      set oid(value) {
          this.dataset.oid = this._oid = value;
      }
  
      get oid() {
          return this._oid;
      }
  
      constructor() {
          super();
  
          const shadowRoot = this.attachShadow({mode: 'open'});
          let template = document.getElementById('template-card').content;
          shadowRoot.innerHTML = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.2/css/bulma.min.css">';
          shadowRoot.appendChild(template.cloneNode(true));
  
          this._titleElement = shadowRoot.querySelector('.card-name');
          this._titleForm = shadowRoot.querySelector('form');
          this._editButton = shadowRoot.querySelector('.button--edit-card');
          this._deleteButton = shadowRoot.querySelector('.button--delete-card');
          this._addTagButton =  shadowRoot.querySelector('.button--add-tag');
  
          this.addListeners();
      }
  
      connectedCallback() {
          this.className = this.shadowRoot.querySelector('div.box').className;
          this.shadowRoot.querySelector('div.box').className = '';
      }
  
      addListeners() {
          this._editButton.addEventListener('click', this.toggleTitleMode.bind(this));
          this._titleForm.addEventListener('submit', this.saveCard.bind(this));
          this._deleteButton.addEventListener('click', this.deleteSelf.bind(this));
          this._addTagButton.addEventListener('click', this.linkTags.bind(this));
      }
  
      toggleTitleMode() {
          this._titleElement.classList.toggle('is-hidden');
          this._titleForm.classList.toggle('is-hidden');
      }
  
      deleteSelf() {
          this.dispatchEvent(new CustomEvent('delete-card'));
      }
  
      linkTags() {
          this.dispatchEvent(new CustomEvent('link-tags'));
      }
  
      saveCard(event) {
          event.preventDefault();
  
          const saveEvent = new CustomEvent('save-card', { detail: {
              formData: new FormData(this._titleForm)
          }});
  
          this.dispatchEvent(saveEvent);
  
          this.toggleTitleMode();
      }
  }
  
  customElements.define('o-card', CardElement);
  },{}],2:[function(require,module,exports){
  class ListElement extends HTMLElement {
  
      set name(value) {
          this._nameElement.textContent = this._nameForm.elements.name.value = value;
      }
  
      set oid(value) {
          this.dataset.oid = this._oid = value;
      }
  
      get oid() {
          return this._oid;
      }
  
      hasCards() {
          return !!this.children.length;
      }
  
      constructor() {
          super();
          const shadowRoot = this.attachShadow({mode: 'open'});
          let template = document.getElementById('template-list').content;
          shadowRoot.innerHTML = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.2/css/bulma.min.css">';
          shadowRoot.appendChild(template.cloneNode(true));
          this._nameElement = shadowRoot.querySelector('h2');
          this._nameForm = shadowRoot.querySelector('form');
          this._addCardButton = shadowRoot.querySelector('.button--add-card');
          this._deleteButton = shadowRoot.querySelector('.button--delete-list');
  
          this.addListeners();
      }
  
      connectedCallback() {
          this.className = this.shadowRoot.querySelector('div.panel').className;
          this.shadowRoot.querySelector('div.panel').className = '';
      }
  
      addListeners() {
          this._nameElement.addEventListener('dblclick', this.toggleNameMode.bind(this));
          this._nameForm.addEventListener('submit', this.saveName.bind(this));
          this._addCardButton.addEventListener('click', this.addCard.bind(this));
          this._deleteButton.addEventListener('click', this.deleteSelf.bind(this));
      }
  
      toggleNameMode() {
          this._nameElement.classList.toggle('is-hidden');
          this._nameForm.classList.toggle('is-hidden');
      }
  
      addCard() {
          this.dispatchEvent(new CustomEvent('add-card'));
      }
  
      deleteSelf() {
          this.dispatchEvent(new CustomEvent('delete-list'));
      }
  
      saveName(event) {
          event.preventDefault();
          const saveEvent = new CustomEvent('save-list-name', { detail: {
              formData: new FormData(this._nameForm)
          }});
  
          this.dispatchEvent(saveEvent);
  
          this.toggleNameMode();
      }
  }
  
  customElements.define('o-list', ListElement);
  },{}],3:[function(require,module,exports){
  const listModule = require('./list');
  const cardModule = require('./card');
  const tagModule = require('./tag');
  require('./ListElement');
  require('./CardElement');
  
  var app = {  

    init: function () {
      // listModule.setBasebaseUrl(baseUrl);
      // cardModule.setBasebaseUrl(baseUrl);
      // tagModule.setBasebaseUrl(baseUrl);
      app.addListenerToActions();
      app.getListsFromAPI();
    
    },
  
    addListenerToActions: () => {
      // bouton "ajouter une liste"
      let addListButton = document.getElementById('addListButton');
      addListButton.addEventListener('click', listModule.showAddModal );
  
      // boutons "fermer les modales"
      let closeModalButtons = document.querySelectorAll('.close');
      for (let button of closeModalButtons) {
        button.addEventListener('click', app.hideModals);
      }
  
      // formulaire "ajouter une liste"
      let addListForm = document.querySelector('#addListModal form');
      addListForm.addEventListener('submit', app.handleAddListForm);
  
      // formulaire "ajouter une carte"
      let addCardForm = document.querySelector('#addCardModal form');
      addCardForm.addEventListener('submit', app.handleAddCardForm);
  
      // modale "gérer les tags"
      document.getElementById('editTagsButton').addEventListener('click', tagModule.showEditModal);
  
      // formulaire "nouveau tag"
      document.getElementById('newTagForm').addEventListener('submit', tagModule.handleNewTag);
    },
  
    // cache toutes les modales
    hideModals: () => {
      let modals = document.querySelectorAll('.modal');
      for (let modal of modals) {
        modal.classList.remove('is-active');
      }
    },
  
    // formulaire pour ajouter une liste
    handleAddListForm: async (event) => {
      event.preventDefault();
      await listModule.handleAddFormSubmit(event);
      app.hideModals();
    },
  
    // formulaire pour ajouter une carte
    handleAddCardForm: async (event) => {
      event.preventDefault();
      await cardModule.handleAddFormSubmit(event);
      app.hideModals();
    },
  
    // Récupération des données 
    getListsFromAPI: async () => {
      try {
        let response = await fetch("/lists");
        if (response.status !== 200) {
          let error = await response.json();
          throw error;
        } else {
          let lists = await response.json();
          for (let list of lists) {
            let listElement = listModule.makeListDOMObject(list.name, list.id);
            listModule.addListToDOM(listElement);
  
            for (let card of list.cards) {
              let cardElement = cardModule.makeCardDOMObject(card.title, card.id, card.color);
              cardModule.addCardToDOM(cardElement, list.id);
  
              for (let tag of card.tags) {
                let tagElement = tagModule.makeTagDOMObject(tag.title, tag.color, tag.id, card.id);
                tagModule.addTagToDOM(tagElement, card.id);
              }
            }
          }
        }
      } catch (error) {
        alert("Impossible de charger les listes depuis l'API.");
        console.error(error);
      }
    }
    
  };
  
  
  document.addEventListener('DOMContentLoaded', app.init );
  },{"./CardElement":1,"./ListElement":2,"./card":4,"./list":5,"./tag":6}],4:[function(require,module,exports){
  const tagModule = require('./tag');
  
  const cardModule = {
    base_baseUrl: null,
  
    setBasebaseUrl: (baseUrl) => {
      cardModule.base_baseUrl = '/cards';
    },
  
    showAddModal: (event) => {
      const listId = event.target.oid;
      
      let modal = document.getElementById('addCardModal');
      let input = modal.querySelector('input[name="list_id"]');
      input.value = listId;
      modal.classList.add('is-active');
    },
  
    handleAddFormSubmit: async (event) => {
      let data = new FormData(event.target);
  
      try {
        let response = await fetch('/cards',{
          method: "POST",
          body: data
        });
        if (response.status != 200) {
          let error = await response.json();
          throw error;
        } else {
          let card = await response.json();
          let newCardElement = cardModule.makeCardDOMObject(card.title, card.id, card.color);
          cardModule.addCardToDOM(newCardElement, card.list_id);
        }
      } catch (error) {
        alert("Impossible de créer une carte");
        console.error(error);
      }
    },
  
   handleEditCardForm: async (event) => {
      const cardId = event.target.oid;
      try {
        let response = await fetch('cards/'+cardId,{
          method: "PATCH",
          body: event.detail.formData
        });
        if (response.status !== 200) {
          let error = await response.json();
          throw error;
        } else {
          let card = await response.json();
          event.target.title = card.title;
          event.target.color = card.color;
        }
      } catch (error) {
        alert("Impossible de modifier la carte");
        console.error(error);
      }
    },
  
    makeCardDOMObject: (cardTitle, cardId, cardColor) => {
      let newCard = document.createElement('o-card');
      newCard.title = cardTitle;
      newCard.oid = cardId;
      newCard.color = cardColor;
      newCard.addEventListener('save-card', cardModule.handleEditCardForm);
      newCard.addEventListener('delete-card', cardModule.deleteCard);
      newCard.addEventListener('link-tags', tagModule.showAssociateModal);
  
      return newCard;
    },
  
    addCardToDOM: (newCard, listId) => {
      let theGoodList = document.querySelector(`o-list[data-oid="${listId}"]`);
      theGoodList.appendChild(newCard);
    },
  
    deleteCard: async (event) => {
      if (!confirm("Supprimer cette carte ?")) {
        return;
      }
      const cardId = event.target.oid;
      try {
        let response = await fetch('cards/'+cardId,{
          method: "DELETE"
        });
        if (response.ok) {
          event.target.remove();
        } else {
          let error = await response.json();
          throw error;
        }
      } catch (error) {
        alert("Impossible de supprimer la carte");
        console.error(error);
      }
    }
  
  };
  
  module.exports = cardModule;
  },{"./tag":6}],5:[function(require,module,exports){
  const cardModule = require('./card');
  
  const listModule = {
    base_baseUrl: null,
  
    setBasebaseUrl: (baseUrl) => {
      listModule.base_baseUrl = '/lists';
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
        let response = await fetch('/lists', {
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
        let response = await fetch('lists/'+listId,{
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
        let response = await fetch('lists/'+listId, {
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
        fetch('cards/'+cardId, {
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
  },{"./card":4}],6:[function(require,module,exports){
  const tagModule = {
    base_baseUrl: null,
  
    setBasebaseUrl: (baseUrl) => {
      tagModule.base_baseUrl = baseUrl;
    },
  
    makeTagDOMObject: (tagTitle, tagColor, tagId, cardId) => {
      let newTag = document.createElement('div');
      newTag.classList.add('tag');
      newTag.style.backgroundColor = tagColor;
      newTag.textContent = tagTitle;
      newTag.setAttribute('tag-id', tagId);
      newTag.setAttribute('card-id', cardId);
  
      newTag.addEventListener('dblclick', tagModule.disassociateTag);
  
      return newTag;
    },
  
    addTagToDOM: (tagElement, cardId) => {
      let cardTagsElement = document.querySelector(`o-card[data-oid="${cardId}"]`);
      cardTagsElement.appendChild(tagElement);
    },
  
    showAssociateModal: async (event) => {
      const cardId = event.target.oid;
      const modal = document.getElementById('associateTagModal');
      try {
        let response = await fetch('/tags');
        if (response.ok) {
          let tags = await response.json();
          let container = document.createElement('section');
          container.classList.add('modal-card-body');
          for (let tag of tags) {
            let tagElement = tagModule.makeTagDOMObject(tag.title, tag.color, tag.id, cardId);
            tagElement.addEventListener('click', tagModule.handleAssociateTag);
  
            container.appendChild(tagElement);
          }
          modal.querySelector('.modal-card-body').replaceWith(container);
          modal.classList.add("is-active");
  
        } else {
          let error = await response.json();
          throw error;
        }
      } catch (error) {
        alert("Impossible de récupérer les tags");
        console.error(error);
      }  
  
    },
  
    handleAssociateTag: async (event) => {
      const tagId = event.target.getAttribute('tag-id');
      const cardId = event.target.getAttribute('card-id');
      try {
        let data = new FormData();
        data.set('tag_id', tagId);
        let response = await fetch(`/cards/${cardId}/tags`, {
          method: "POST",
          body: data
        });
        if (response.ok) {
          let card = await response.json();
          let oldTags = document.querySelectorAll(`o-card[data-oid="${card.id}"] .tag`);
          for (let tag of oldTags) {
            tag.remove();
          }
          let container = document.querySelector(`o-card[data-oid="${card.id}"]`);
          for (let tag of card.tags) {
            let tagElement = tagModule.makeTagDOMObject(tag.title, tag.color, tag.id, card.id);
            container.appendChild(tagElement);
          }
  
        } else {
          let error = await response.json();
          throw error;
        }
      } catch (error) {
        alert("Impossible d'associer le tag");
        console.error(error);
      }
      const modal = document.getElementById('associateTagModal');
      modal.classList.remove('is-active');
    },
  
    disassociateTag: async (event) => {
      const tagId = event.target.getAttribute('tag-id');
      const cardId = event.target.getAttribute('card-id');
      try {
        let response = await fetch(`/cards/${cardId}/tags/${tagId}`,{
          method: "DELETE"
        });
        if (response.ok) {
          event.target.remove();
        } else {
          let error = await response.json();
          throw error;
        }
      } catch (error) {
        alert('Impossible de désassocier le tag'),
        console.error(error);
      }
    },
  
    makeEditTagForm: (tag) => {
      let orignalForm = document.getElementById('newTagForm');
      let newForm = document.importNode(orignalForm, true);
      newForm.setAttribute('id', null);
      newForm.classList.add('editTagForm');
      newForm.querySelector('[name="title"]').value = tag.title;
      newForm.querySelector('[name="color"]').value = tag.color;
      newForm.setAttribute('tag-id', tag.id);
      newForm.addEventListener('submit', tagModule.handleEditTag);
      let deleteButton = document.createElement('div');
      deleteButton.classList.add("button", "is-small", "is-danger");
      deleteButton.textContent = "Supprimer";
      deleteButton.addEventListener('click', tagModule.handleDeleteTag);
  
      newForm.querySelector(".field").appendChild(deleteButton);
  
      return newForm;
    },
  
    showEditModal: async () => {
      try {
        let response = await fetch('/tags');
        if (response.ok) {
          const modal = document.getElementById('addAndEditTagModal');
  
          let tags = await response.json();
          let container = document.createElement('div');
          container.classList.add('editTagForms');
          for (let tag of tags) {
            let editFormElement = tagModule.makeEditTagForm(tag);
            container.appendChild(editFormElement);
          }
          modal.querySelector('.editTagForms').replaceWith(container);
          
          modal.classList.add('is-active');
        } else {
          let error = await response.json();
          throw error;
        }
      } catch (error) {
        alert("Impossible de récupérer les tags");
        console.error(error);
      }
    },
  
    handleNewTag: async (event) => {
      event.preventDefault();
      let data = new FormData(event.target);
      try {
        let response = await fetch('/tags',{
          method: "POST",
          body: data
        });
        if (response.ok) {
        } else {
          let error = await response.json();
          throw error;
        }
      } catch (error) {
        alert("Impossible de créer le tag");
        console.error(error);
      }
      document.getElementById('addAndEditTagModal').classList.remove('is-active');
    },
  
    handleEditTag: async (event) => {
      event.preventDefault();
      let data = new FormData(event.target);
  
      let tagId = event.target.getAttribute('tag-id');
      try {
        let response = await fetch('/tags/'+tagId,{
          method: "PATCH",
          body: data
        });
        if (response.ok) {
          let tag = await response.json();
          let existingOccurences = document.querySelectorAll(`[tag-id="${tag.id}"]`);
          for (let occurence of existingOccurences) {
            occurence.textContent = tag.title;
            occurence.style.backgroundColor = tag.color;
          }
  
        } else {
          let error = await response.json();
          throw error;
        }
      } catch (error) {
        alert('Impossible de mettre le tag à jour');
        console.error(error);
      }
      document.getElementById('addAndEditTagModal').classList.remove('is-active');
    },
  
    handleDeleteTag: async (event) => {
      const tagId = event.target.closest('form').getAttribute('tag-id');
      try {
        let response = await fetch('/tags/'+tagId, {
          method: "DELETE"
        });
        if (response.ok) {
          let existingOccurences = document.querySelectorAll(`[tag-id="${tagId}"]`);
          for (let occurence of existingOccurences) {
            occurence.remove();
          }
        } else {
          let error = await response.json();
          throw error;
        }
      } catch (error) {
        alert("Impossible de supprimer le tag");
        console.error(error);
      }
      document.getElementById('addAndEditTagModal').classList.remove('is-active');
    }
  };
  
  module.exports = tagModule;
  },{}]},{},[3]);
  