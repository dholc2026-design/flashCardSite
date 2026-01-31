const frontInput = document.getElementById('frontInput');
    const backInput = document.getElementById('backInput');
    const activeCard = document.getElementById('activeCard');
    const cardCounter = document.getElementById('cardCounter');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    let cards = JSON.parse(localStorage.getItem('flashcards')) || [];
    let currentIndex = 0;
    let flipped = false;

    function saveCards() {
      localStorage.setItem('flashcards', JSON.stringify(cards));
    }

    function updateCounter() {
      if (cards.length === 0) {
        cardCounter.textContent = 'No cards yet';
      } else {
        cardCounter.textContent = `Card ${currentIndex + 1} of ${cards.length}`;
      }
    }

    function updateNavButtons() {
      prevBtn.disabled = cards.length === 0;
      nextBtn.disabled = cards.length === 0;
    }

    function deleteCard(event) {
      event.stopPropagation(); // Prevent card flip when clicking delete
      
      if (confirm('Are you sure you want to delete this card?')) {
        cards.splice(currentIndex, 1);
        saveCards();
        
        // Adjust current index if needed
        if (currentIndex >= cards.length && cards.length > 0) {
          currentIndex = cards.length - 1;
        } else if (cards.length === 0) {
          currentIndex = 0;
        }
        
        flipped = false;
        renderCard();
      }
    }

    function renderCard() {
      activeCard.innerHTML = '';
      updateCounter();
      updateNavButtons();
      
      if (cards.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'empty-message';
        emptyMsg.textContent = 'Add some cards to get started!';
        activeCard.appendChild(emptyMsg);
        return;
      }

      const inner = document.createElement('div');
      inner.className = 'card-inner';

      const front = document.createElement('div');
      front.className = 'card-face card-front';
      front.textContent = cards[currentIndex].front;

      const back = document.createElement('div');
      back.className = 'card-face card-back';
      back.textContent = cards[currentIndex].back;

      // Add delete button to front
      const deleteBtnFront = document.createElement('button');
      deleteBtnFront.className = 'delete-btn';
      deleteBtnFront.textContent = '✕ Delete';
      deleteBtnFront.onclick = deleteCard;
      front.appendChild(deleteBtnFront);

      // Add delete button to back
      const deleteBtnBack = document.createElement('button');
      deleteBtnBack.className = 'delete-btn';
      deleteBtnBack.textContent = '✕ Delete';
      deleteBtnBack.onclick = deleteCard;
      back.appendChild(deleteBtnBack);

      inner.appendChild(front);
      inner.appendChild(back);
      activeCard.appendChild(inner);

      activeCard.classList.toggle('flipped', flipped);

      activeCard.onclick = (e) => {
        // Only flip if not clicking the delete button
        if (!e.target.classList.contains('delete-btn')) {
          flipped = !flipped;
          activeCard.classList.toggle('flipped');
        }
      };
    }

    function addCard() {
      const frontText = frontInput.value.trim();
      const backText = backInput.value.trim();
      if (!frontText || !backText) return;

      cards.push({ front: frontText, back: backText });
      saveCards();
      currentIndex = cards.length - 1;
      flipped = false;
      renderCard();

      frontInput.value = '';
      backInput.value = '';
    }

    function nextCard() {
      if (cards.length === 0) return;
      currentIndex = (currentIndex + 1) % cards.length;
      flipped = false;
      renderCard();
    }

    function prevCard() {
      if (cards.length === 0) return;
      currentIndex = (currentIndex - 1 + cards.length) % cards.length;
      flipped = false;
      renderCard();
    }

    // Allow Enter key to add cards
    frontInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') backInput.focus();
    });

    backInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') addCard();
    });

    renderCard();