const tagModule = require('./tag');

const cardModule = {
  base_url: null,

  setBaseUrl: (url) => {
    cardModule.base_url = url+'/cards';
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
      let response = await fetch(cardModule.base_url,{
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
      let response = await fetch(cardModule.base_url+'/'+cardId,{
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
      let response = await fetch(cardModule.base_url+'/'+cardId,{
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