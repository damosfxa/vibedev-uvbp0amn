// app.js - Frontend UI Binding using Voxy Premium Protocol

const addForm = document.getElementById('addForm');
const itemNameInput = document.getElementById('itemName');
const itemCategorySelect = document.getElementById('itemCategory');
const totalItemsEl = document.getElementById('totalItemsEl');
const totalLoadsEl = document.getElementById('totalLoadsEl');
const clearDoneBtn = document.getElementById('clearDoneBtn');
const categoriesGrid = document.getElementById('categoriesGrid');

// Premium SVG Icons for categories
const SVG_ICONS = {
  whites: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.38 3.46L16 2a8 8 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z"/></svg>',
  lights: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
  darks: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>',
  delicates: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><circle cx="12" cy="12" r="2"/></svg>',
  'heavy-duty': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>'
};

const CATEGORIES = [
  { id: 'whites', label: `${SVG_ICONS.whites} Whites` },
  { id: 'lights', label: `${SVG_ICONS.lights} Lights` },
  { id: 'darks', label: `${SVG_ICONS.darks} Darks` },
  { id: 'delicates', label: `${SVG_ICONS.delicates} Delicates` },
  { id: 'heavy-duty', label: `${SVG_ICONS['heavy-duty']} Heavy-Duty` }
];

// Feature: Quick Add Tags (Problem Solving boost)
const QUICK_TAGS = [
  { name: 'Kaus Kaki', cat: 'whites' },
  { name: 'Kemeja Putih', cat: 'whites' },
  { name: 'Celana Jeans', cat: 'darks' },
  { name: 'Handuk', cat: 'heavy-duty' },
  { name: 'Sutra', cat: 'delicates' }
];

function renderQuickTags(state) {
  const quickTagsContainer = document.getElementById('quickTags');
  if (!quickTagsContainer) return;
  quickTagsContainer.innerHTML = '';
  
  QUICK_TAGS.forEach(tag => {
    // Determine if exact tag has been added to the exact category
    const isUsed = state.items.some(
      i => i.name.toLowerCase() === tag.name.toLowerCase() && i.category === tag.cat
    );
    
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `quick-tag ${isUsed ? 'used' : ''}`;
    btn.textContent = `+ ${tag.name}`;
    btn.title = `Add to ${tag.cat}`;
    
    if (!isUsed) {
      btn.onclick = () => {
        const res = LaundryLogic.addItem(tag.name, tag.cat);
        if (!res.ok) alert(res.error);
      };
    }
    
    quickTagsContainer.appendChild(btn);
  });
}

function renderCategories(groupedItems) {
  categoriesGrid.innerHTML = '';
  const activeCategories = Object.keys(groupedItems);
  
  if (activeCategories.length === 0) {
    categoriesGrid.innerHTML = `
      <div class="empty-state-box">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.3; margin-bottom:1rem;"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
        <p>No laundry items added yet. Add items or click Quick Tags above.</p>
      </div>`;
    return;
  }
  
  CATEGORIES.forEach(cat => {
    const items = groupedItems[cat.id] || [];
    if (items.length === 0) return;
    
    const isReady = items.length >= 3;
    const card = document.createElement('div');
    card.className = `category-card ${isReady ? 'is-ready' : ''}`;
    
    const statusBadge = isReady 
      ? `<span class="status-badge ready">Ready to run</span>`
      : `<span class="status-badge pending">${3 - items.length} needed</span>`;
      
    const itemsHtml = items.map(item => {
      const timeStr = new Date(item.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      return `
      <li class="item-row">
        <span class="item-name">${item.name} <span class="time-stamp">(${timeStr})</span></span>
        <button class="remove-btn" data-id="${item.id}" aria-label="Remove item" title="Remove">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"></path></svg>
        </button>
      </li>
    `;
    }).join('');

    card.innerHTML = `
      <div class="card-header">
        <div class="card-title">
          ${cat.label} <span class="item-count">(${items.length})</span>
        </div>
        ${statusBadge}
      </div>
      <ul class="items-list">
        ${itemsHtml}
      </ul>
    `;
    categoriesGrid.appendChild(card);
  });
}

function render() {
  const state = LaundryLogic.getState();
  
  // Header Stats
  totalItemsEl.textContent = state.totalItems;
  totalLoadsEl.textContent = state.totalReadyLoads;
  clearDoneBtn.disabled = state.totalReadyLoads === 0;
  
  // Renders
  renderCategories(state.groupedItems);
  renderQuickTags(state);
}

// Subscribe to logic factory
LaundryLogic.subscribe(render);
render();

// Manual Add Event
addForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = itemNameInput.value.trim();
  const category = itemCategorySelect.value;
  
  if (!name || !category) return;
  
  const res = LaundryLogic.addItem(name, category);
  if (res.ok) {
    itemNameInput.value = '';
    itemNameInput.focus();
  } else {
    alert(res.error);
  }
});

// Clear Done Event
clearDoneBtn.addEventListener('click', () => {
  LaundryLogic.clearDone();
});

// Remove Item Event Delegation
categoriesGrid.addEventListener('click', (e) => {
  const removeBtn = e.target.closest('.remove-btn');
  if (removeBtn) {
    const id = removeBtn.dataset.id;
    LaundryLogic.removeItem(id);
  }
});
