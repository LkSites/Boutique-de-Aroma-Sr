/* ==========================================================================
   LÓGICA COMPLETA - BOUTIQUE DE AROMAS (LOJA SANTA ROSA)
   Vitrine, pesquisa, sacola, painel admin (CRUD + vendas) e contatos
   ========================================================================== */

const STORAGE_KEYS = {
  PRODUCTS: 'boutique_aromas_products_v1',
  ORDERS: 'boutique_aromas_orders_v1',
  CART: 'boutique_aromas_cart_v1',
  ADMIN_AUTH: 'boutique_aromas_admin_logged_v1',
  SETTINGS: 'boutique_aromas_settings_v1'
};

const ADMIN_CREDENTIALS = {
  user: 'admin',
  pass: 'senha123'
};

const DEFAULT_SETTINGS = {
  bannerImage: '',
  whatsappNumber: '5555999999999',
  instagramHandle: '@boutiquedearomassantarosa',
  instagramUrl: 'https://www.instagram.com/boutiquedearomassantarosa',
  address: '📍 Centro — Santa Rosa / RS'
};

const INITIAL_PRODUCTS = [
  {
    id: 'aroma_1',
    name: 'Difusor de Varetas Capim Limão & Alecrim 250ml',
    price: 89.90,
    category: 'Difusores',
    description: 'Fragrância cítrica herbal revigorante com notas frescas de capim-limão e alecrim. Acompanha 6 varetas de fibra de algodão.',
    image: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'aroma_2',
    name: 'Vela Aromática Baunilha & Âmbar 180g',
    price: 68.00,
    category: 'Velas Aromáticas',
    description: 'Cera vegetal ecológica com pavio de algodão. Proporciona queima limpa por até 35 horas e perfume acolhedor.',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'aroma_3',
    name: 'Home Spray Flor de Figo & Sândalo 200ml',
    price: 64.90,
    category: 'Home Spray',
    description: 'Perfumação instantânea e sofisticada para salas, quartos e escritórios com fixação prolongada.',
    image: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'aroma_4',
    name: 'Kit Presente Lavanda Francesa (Difusor + Vela)',
    price: 149.00,
    category: 'Kits Presente',
    description: 'Caixa presenteável elegante contendo 1 Difusor 250ml e 1 Vela Aromática 140g na fragrância relaxante de Lavanda.',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'aroma_5',
    name: 'Água Perfumada para Lençóis Algodão Doce 500ml',
    price: 52.00,
    category: 'Home Spray',
    description: 'Ideal para borrifar em roupas de cama, cortinas e toalhas, deixando sensação de roupa recém-lavada.',
    image: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'aroma_6',
    name: 'Difusor Luxury Bambu & Chá Branco 300ml',
    price: 112.00,
    category: 'Difusores',
    description: 'Frasco em vidro âmbar decorativo com notas leves e elegantes de chá branco e folhas de bambu.',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80'
  }
];

let products = [];
let orders = [];
let cart = [];
let storeSettings = { ...DEFAULT_SETTINGS };
let currentSearch = '';
let currentCategory = 'Todos';
let currentUploadedBase64 = '';
let tempBannerBase64 = '';

// =========================================================================
// 1. INICIALIZAÇÃO E PERSISTÊNCIA
// =========================================================================
function initApp() {
  try {
    const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (savedSettings) {
      storeSettings = { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) };
    }
    applyStoreSettingsToUI();

    const savedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (savedProducts) {
      products = JSON.parse(savedProducts);
    } else {
      products = [...INITIAL_PRODUCTS];
      saveProductsToStorage();
    }

    const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
    orders = savedOrders ? JSON.parse(savedOrders) : [];

    const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
    cart = savedCart ? JSON.parse(savedCart) : [];

    renderStoreProducts();
    updateCartUI();
  } catch (err) {
    console.error('Erro ao inicializar a loja:', err);
    products = [...INITIAL_PRODUCTS];
    renderStoreProducts();
  }
}

function saveProductsToStorage() {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
}

function saveOrdersToStorage() {
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
}

function saveCartToStorage() {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
}

function applyStoreSettingsToUI() {
  const customWrapper = document.getElementById('customHeroBannerWrapper');
  const customImg = document.getElementById('customHeroBannerImg');
  const defaultGallery = document.getElementById('defaultHeroGallery');

  if (storeSettings.bannerImage && storeSettings.bannerImage.trim() !== '') {
    customImg.src = storeSettings.bannerImage;
    customWrapper.classList.remove('hidden');
    defaultGallery.classList.add('hidden');
  } else {
    customWrapper.classList.add('hidden');
    defaultGallery.classList.remove('hidden');
  }

  const cleanPhone = (storeSettings.whatsappNumber || '5555999999999').replace(/\D/g, '');
  const waLink = `https://wa.me/${cleanPhone}?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20Boutique%20de%20Aromas%20Santa%20Rosa.`;
  document.getElementById('linkWhatsappBtn').href = waLink;
  document.getElementById('floatingWhatsappBtn').href = waLink;
  document.getElementById('displayWhatsappText').textContent = formatPhoneDisplay(cleanPhone);

  document.getElementById('displayInstagramHandle').textContent = storeSettings.instagramHandle || '@boutiquedearomassantarosa';
  document.getElementById('linkInstagramBtn').href = storeSettings.instagramUrl || 'https://www.instagram.com/boutiquedearomassantarosa';

  const addr = storeSettings.address || '📍 Centro — Santa Rosa / RS';
  document.getElementById('displayAddressText').textContent = addr;
  document.getElementById('linkMapsBtn').href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr.replace('📍', '').trim())}`;
}

function formatPhoneDisplay(digits) {
  if (digits.length === 13 && digits.startsWith('55')) {
    return `(${digits.slice(2, 4)}) ${digits.slice(4, 9)}-${digits.slice(9)}`;
  }
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  return digits;
}

// =========================================================================
// 2. FORMATAÇÃO, TOAST E CONFIRMAÇÃO
// =========================================================================
function formatCurrency(value) {
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  const bgColor = type === 'error' ? 'bg-red-600' : (type === 'info' ? 'bg-aromaGreenDark' : 'bg-aromaGreen');
  const icon = type === 'error' ? 'fa-circle-exclamation' : (type === 'info' ? 'fa-info-circle' : 'fa-circle-check');

  toast.className = `${bgColor} text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 text-sm font-medium transform transition-all duration-300 translate-y-2 opacity-0 pointer-events-auto max-w-sm`;
  toast.innerHTML = `<i class="fas ${icon} text-lg"></i><span>${message}</span>`;

  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.remove('translate-y-2', 'opacity-0'));

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

function customConfirm(title, message, onConfirm) {
  const dialog = document.getElementById('confirmDialog');
  document.getElementById('confirmTitle').textContent = title;
  document.getElementById('confirmMessage').textContent = message;

  dialog.classList.remove('hidden');
  dialog.classList.add('flex');

  const cancelBtn = document.getElementById('confirmCancelBtn');
  const okBtn = document.getElementById('confirmOkBtn');

  const cleanup = () => {
    dialog.classList.add('hidden');
    dialog.classList.remove('flex');
    cancelBtn.onclick = null;
    okBtn.onclick = null;
  };

  cancelBtn.onclick = cleanup;
  okBtn.onclick = () => {
    cleanup();
    onConfirm();
  };
}

// =========================================================================
// 3. VITRINE, PESQUISA E FILTROS
// =========================================================================
function handleSearch(query) {
  currentSearch = query.trim().toLowerCase();
  document.getElementById('clearSearchBtn').classList.toggle('hidden', currentSearch.length === 0);
  renderStoreProducts();
}

function clearSearch() {
  const input = document.getElementById('searchInput');
  input.value = '';
  handleSearch('');
  input.focus();
}

function filterCategory(category) {
  currentCategory = category;
  document.querySelectorAll('.cat-btn').forEach(btn => {
    if (btn.textContent.trim() === category) {
      btn.classList.remove('bg-white', 'hover:bg-aromaGreenLight', 'text-aromaGreenDark', 'border', 'border-aromaSand');
      btn.classList.add('bg-aromaGreen', 'text-white', 'shadow-sm');
    } else {
      btn.classList.remove('bg-aromaGreen', 'text-white', 'shadow-sm');
      btn.classList.add('bg-white', 'hover:bg-aromaGreenLight', 'text-aromaGreenDark', 'border', 'border-aromaSand');
    }
  });
  renderStoreProducts();
}

function resetFilters() {
  clearSearch();
  filterCategory('Todos');
}

function renderStoreProducts() {
  const grid = document.getElementById('productsGrid');
  const emptyState = document.getElementById('emptySearchState');
  const resultsCount = document.getElementById('resultsCount');
  const sortBy = document.getElementById('sortSelect').value;

  let filtered = products.filter(p => {
    const matchesCat = currentCategory === 'Todos' || p.category === currentCategory;
    const matchesQuery = !currentSearch ||
      p.name.toLowerCase().includes(currentSearch) ||
      p.description.toLowerCase().includes(currentSearch) ||
      (p.category && p.category.toLowerCase().includes(currentSearch));
    return matchesCat && matchesQuery;
  });

  if (sortBy === 'price-asc') filtered.sort((a, b) => a.price - b.price);
  else if (sortBy === 'price-desc') filtered.sort((a, b) => b.price - a.price);
  else if (sortBy === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));

  resultsCount.textContent = `${filtered.length} ${filtered.length === 1 ? 'produto disponível' : 'produtos disponíveis'}`;

  if (filtered.length === 0) {
    grid.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');
  grid.innerHTML = filtered.map(prod => `
    <div class="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-aromaSand overflow-hidden flex flex-col group">
      <div class="relative h-56 bg-aromaCream overflow-hidden">
        <img
          src="${prod.image}"
          alt="${prod.name}"
          onerror="this.src='https://placehold.co/400x300/556b52/ffffff?text=Boutique+de+Aromas'"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-aromaGreenDark text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm">
          ${prod.category || 'Aromas'}
        </span>
      </div>

      <div class="p-5 flex-grow flex flex-col justify-between">
        <div>
          <h3 class="font-bold text-gray-900 text-base leading-snug line-clamp-2 group-hover:text-aromaGreen transition">
            ${prod.name}
          </h3>
          <p class="text-gray-500 text-xs mt-2 line-clamp-3 leading-relaxed">
            ${prod.description}
          </p>
        </div>

        <div class="mt-5 pt-4 border-t border-gray-100">
          <div class="mb-3">
            <span class="text-[11px] text-gray-400 block">Valor</span>
            <span class="text-xl font-extrabold text-aromaGreenDark">${formatCurrency(prod.price)}</span>
          </div>

          <button
            onclick="addToCart('${prod.id}')"
            class="w-full bg-aromaGreen hover:bg-aromaGreenDark active:scale-[0.98] text-white font-semibold py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-sm text-sm"
          >
            <i class="fas fa-shopping-bag"></i>
            <span>Adicionar à Sacola</span>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// =========================================================================
// 4. SACOLA / CARRINHO DE COMPRAS & CHECKOUT
// =========================================================================
function toggleCartModal() {
  const modal = document.getElementById('cartModal');
  modal.classList.toggle('hidden');
  if (!modal.classList.contains('hidden')) renderCartItems();
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.productId === productId);
  if (existingItem) existingItem.quantity += 1;
  else {
    cart.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  saveCartToStorage();
  updateCartUI();
  showToast(`"${product.name}" adicionado à sacola!`);
}

function updateCartQuantity(productId, delta) {
  const index = cart.findIndex(item => item.productId === productId);
  if (index === -1) return;

  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) cart.splice(index, 1);

  saveCartToStorage();
  updateCartUI();
  renderCartItems();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.productId !== productId);
  saveCartToStorage();
  updateCartUI();
  renderCartItems();
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  document.getElementById('cartBadge').textContent = totalItems;
  document.getElementById('headerCartTotal').textContent = formatCurrency(totalPrice);
  document.getElementById('cartModalTotal').textContent = formatCurrency(totalPrice);
}

function renderCartItems() {
  const container = document.getElementById('cartItemsContainer');
  const footer = document.getElementById('cartFooter');

  if (cart.length === 0) {
    footer.classList.add('hidden');
    container.innerHTML = `
      <div class="h-full flex flex-col items-center justify-center text-center py-12">
        <div class="w-16 h-16 bg-aromaGreenLight text-aromaGreen rounded-full flex items-center justify-center text-2xl mb-3">
          <i class="fas fa-shopping-bag"></i>
        </div>
        <h4 class="font-bold text-gray-800">Sua sacola está vazia</h4>
        <p class="text-xs text-gray-500 mt-1 max-w-xs">Escolha suas fragrâncias favoritas na vitrine para iniciar seu pedido.</p>
      </div>
    `;
    return;
  }

  footer.classList.remove('hidden');
  container.innerHTML = cart.map(item => `
    <div class="flex items-center gap-3 bg-aromaCream p-3 rounded-xl border border-aromaSand">
      <img src="${item.image}" alt="${item.name}" onerror="this.src='https://placehold.co/100x100/556b52/ffffff?text=Aromas'" class="w-16 h-16 rounded-lg object-cover bg-white border border-gray-200 flex-shrink-0" />
      <div class="flex-grow min-w-0">
        <h4 class="text-sm font-bold text-gray-800 truncate">${item.name}</h4>
        <p class="text-xs font-semibold text-aromaGreen mt-0.5">${formatCurrency(item.price)} un.</p>
        <div class="flex items-center gap-2 mt-2">
          <button onclick="updateCartQuantity('${item.productId}', -1)" class="w-6 h-6 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center justify-center text-xs font-bold">-</button>
          <span class="text-xs font-bold w-6 text-center">${item.quantity}</span>
          <button onclick="updateCartQuantity('${item.productId}', 1)" class="w-6 h-6 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center justify-center text-xs font-bold">+</button>
        </div>
      </div>
      <div class="text-right flex flex-col justify-between items-end h-16">
        <button onclick="removeFromCart('${item.productId}')" class="text-gray-400 hover:text-red-600 text-xs p-1">
          <i class="fas fa-trash"></i>
        </button>
        <span class="text-sm font-extrabold text-aromaGreenDark">${formatCurrency(item.price * item.quantity)}</span>
      </div>
    </div>
  `).join('');
}

function checkoutOrder() {
  if (cart.length === 0) return;

  const customerName = document.getElementById('customerName').value.trim();
  const customerPhone = document.getElementById('customerPhone').value.trim();
  const paymentMethod = document.getElementById('paymentMethod').value;

  if (!customerName || !customerPhone) {
    showToast('Preencha seu Nome e WhatsApp para concluir o pedido.', 'error');
    return;
  }

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const now = new Date();

  const newOrder = {
    id: 'BDA-' + Math.floor(100000 + Math.random() * 900000),
    date: now.toLocaleDateString('pt-BR') + ' às ' + now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    customerName,
    customerPhone,
    paymentMethod,
    items: [...cart],
    total: totalAmount,
    status: 'Concluído'
  };

  orders.unshift(newOrder);
  saveOrdersToStorage();

  cart = [];
  saveCartToStorage();
  updateCartUI();
  document.getElementById('customerName').value = '';
  document.getElementById('customerPhone').value = '';

  toggleCartModal();
  showToast(`Pedido #${newOrder.id} registrado com sucesso! Obrigado pela preferência.`);
}

// =========================================================================
// 5. PAINEL ADMINISTRADOR (LOGIN, ABAS E CONFIGURAÇÕES)
// =========================================================================
function openAdminAccess() {
  const isLogged = sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
  if (isLogged) {
    openAdminDashboard();
  } else {
    document.getElementById('loginErrorMsg').classList.add('hidden');
    document.getElementById('adminUser').value = '';
    document.getElementById('adminPass').value = '';
    const loginModal = document.getElementById('adminLoginModal');
    loginModal.classList.remove('hidden');
    loginModal.classList.add('flex');
    setTimeout(() => document.getElementById('adminUser').focus(), 100);
  }
}

function closeLoginModal() {
  const loginModal = document.getElementById('adminLoginModal');
  loginModal.classList.add('hidden');
  loginModal.classList.remove('flex');
}

function handleAdminLogin(e) {
  e.preventDefault();
  const user = document.getElementById('adminUser').value.trim();
  const pass = document.getElementById('adminPass').value.trim();

  if (user === ADMIN_CREDENTIALS.user && pass === ADMIN_CREDENTIALS.pass) {
    sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
    closeLoginModal();
    openAdminDashboard();
    showToast('Bem-vindo ao Painel Administrador!');
  } else {
    document.getElementById('loginErrorMsg').classList.remove('hidden');
  }
}

function logoutAdmin() {
  sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  closeAdminDashboard();
  showToast('Sessão administrativa encerrada.', 'info');
}

function openAdminDashboard() {
  document.getElementById('adminDashboardModal').classList.remove('hidden');
  renderAdminProducts();
  renderAdminOrders();
}

function closeAdminDashboard() {
  document.getElementById('adminDashboardModal').classList.add('hidden');
  resetProductForm();
}

function switchAdminTab(tab) {
  const tabs = ['adminTabProducts', 'adminTabOrders', 'adminTabSettings'];
  const btns = ['tabBtnProducts', 'tabBtnOrders', 'tabBtnSettings'];

  tabs.forEach(id => document.getElementById(id).classList.add('hidden'));
  btns.forEach(id => {
    const b = document.getElementById(id);
    b.classList.remove('border-aromaGreen', 'text-aromaGreen');
    b.classList.add('border-transparent', 'text-gray-500');
  });

  if (tab === 'products') {
    document.getElementById('adminTabProducts').classList.remove('hidden');
    const b = document.getElementById('tabBtnProducts');
    b.classList.add('border-aromaGreen', 'text-aromaGreen');
    b.classList.remove('border-transparent', 'text-gray-500');
    renderAdminProducts();
  } else if (tab === 'orders') {
    document.getElementById('adminTabOrders').classList.remove('hidden');
    const b = document.getElementById('tabBtnOrders');
    b.classList.add('border-aromaGreen', 'text-aromaGreen');
    b.classList.remove('border-transparent', 'text-gray-500');
    renderAdminOrders();
  } else {
    document.getElementById('adminTabSettings').classList.remove('hidden');
    const b = document.getElementById('tabBtnSettings');
    b.classList.add('border-aromaGreen', 'text-aromaGreen');
    b.classList.remove('border-transparent', 'text-gray-500');
    loadSettingsIntoForm();
  }
}

function loadSettingsIntoForm() {
  tempBannerBase64 = storeSettings.bannerImage && storeSettings.bannerImage.startsWith('data:image') ? storeSettings.bannerImage : '';
  document.getElementById('settingBannerUrl').value = storeSettings.bannerImage && !storeSettings.bannerImage.startsWith('data:image') ? storeSettings.bannerImage : '';
  document.getElementById('settingWhatsapp').value = storeSettings.whatsappNumber || '';
  document.getElementById('settingInstagramHandle').value = storeSettings.instagramHandle || '';
  document.getElementById('settingInstagramUrl').value = storeSettings.instagramUrl || '';
  document.getElementById('settingAddress').value = storeSettings.address || '';
}

function handleBannerUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    tempBannerBase64 = e.target.result;
    document.getElementById('settingBannerUrl').value = '';
    showToast('Banner carregado! Clique em Salvar Alterações.', 'info');
  };
  reader.readAsDataURL(file);
}

function resetDefaultGalleryBanner() {
  tempBannerBase64 = '';
  document.getElementById('settingBannerUrl').value = '';
  storeSettings.bannerImage = '';
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(storeSettings));
  applyStoreSettingsToUI();
  showToast('Galeria inicial restaurada!');
}

function saveStoreSettings(e) {
  e.preventDefault();
  const urlVal = document.getElementById('settingBannerUrl').value.trim();
  storeSettings.bannerImage = tempBannerBase64 || urlVal || '';
  storeSettings.whatsappNumber = document.getElementById('settingWhatsapp').value.trim() || DEFAULT_SETTINGS.whatsappNumber;
  storeSettings.instagramHandle = document.getElementById('settingInstagramHandle').value.trim() || DEFAULT_SETTINGS.instagramHandle;
  storeSettings.instagramUrl = document.getElementById('settingInstagramUrl').value.trim() || DEFAULT_SETTINGS.instagramUrl;
  storeSettings.address = document.getElementById('settingAddress').value.trim() || DEFAULT_SETTINGS.address;

  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(storeSettings));
  applyStoreSettingsToUI();
  showToast('Configurações atualizadas com sucesso!');
}

// =========================================================================
// 6. CRUD DE PRODUTOS (ADICIONAR / EDITAR / EXCLUIR)
// =========================================================================
function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    currentUploadedBase64 = e.target.result;
    document.getElementById('prodImageUrl').value = '';
    showImagePreview(currentUploadedBase64);
  };
  reader.readAsDataURL(file);
}

function previewImageUrl(url) {
  if (url.trim()) {
    currentUploadedBase64 = '';
    document.getElementById('prodImageFile').value = '';
    showImagePreview(url.trim());
  } else {
    hideImagePreview();
  }
}

function showImagePreview(src) {
  const wrapper = document.getElementById('imagePreviewWrapper');
  document.getElementById('imagePreview').src = src;
  wrapper.classList.remove('hidden');
}

function hideImagePreview() {
  const wrapper = document.getElementById('imagePreviewWrapper');
  document.getElementById('imagePreview').src = '';
  wrapper.classList.add('hidden');
}

function clearProductImage() {
  currentUploadedBase64 = '';
  document.getElementById('prodImageFile').value = '';
  document.getElementById('prodImageUrl').value = '';
  hideImagePreview();
}

function saveProduct(e) {
  e.preventDefault();

  const editId = document.getElementById('editProductId').value;
  const name = document.getElementById('prodName').value.trim();
  const price = parseFloat(document.getElementById('prodPrice').value);
  const category = document.getElementById('prodCategory').value;
  const description = document.getElementById('prodDesc').value.trim();
  const urlInput = document.getElementById('prodImageUrl').value.trim();

  const finalImage = currentUploadedBase64 || urlInput;
  if (!finalImage) {
    showToast('Selecione uma foto ou informe a URL da imagem.', 'error');
    return;
  }

  if (editId) {
    const idx = products.findIndex(p => p.id === editId);
    if (idx !== -1) {
      products[idx] = { ...products[idx], name, price, category, description, image: finalImage };
      showToast('Produto atualizado com sucesso!');
    }
  } else {
    products.unshift({
      id: 'aroma_' + Date.now(),
      name,
      price,
      category,
      description,
      image: finalImage
    });
    showToast('Novo produto cadastrado na loja!');
  }

  saveProductsToStorage();
  resetProductForm();
  renderAdminProducts();
  renderStoreProducts();
}

function startEditProduct(productId) {
  const prod = products.find(p => p.id === productId);
  if (!prod) return;

  document.getElementById('editProductId').value = prod.id;
  document.getElementById('prodName').value = prod.name;
  document.getElementById('prodPrice').value = prod.price;
  document.getElementById('prodCategory').value = prod.category || 'Difusores';
  document.getElementById('prodDesc').value = prod.description;

  if (prod.image.startsWith('data:image')) {
    currentUploadedBase64 = prod.image;
    document.getElementById('prodImageUrl').value = '';
  } else {
    currentUploadedBase64 = '';
    document.getElementById('prodImageUrl').value = prod.image;
  }
  showImagePreview(prod.image);

  document.getElementById('formProductTitle').innerHTML = `<i class="fas fa-edit text-amber-600"></i><span>Editar Produto</span>`;
  document.getElementById('btnSubmitProduct').innerHTML = `<i class="fas fa-check"></i><span>Salvar Alterações</span>`;
  document.getElementById('btnCancelEdit').classList.remove('hidden');
}

function resetProductForm() {
  document.getElementById('productForm').reset();
  document.getElementById('editProductId').value = '';
  clearProductImage();

  document.getElementById('formProductTitle').innerHTML = `<i class="fas fa-plus-circle text-aromaGreen"></i><span>Adicionar Produto</span>`;
  document.getElementById('btnSubmitProduct').innerHTML = `<i class="fas fa-save"></i><span>Salvar Produto na Loja</span>`;
  document.getElementById('btnCancelEdit').classList.add('hidden');
}

function deleteProduct(productId) {
  const prod = products.find(p => p.id === productId);
  if (!prod) return;

  customConfirm(
    'Excluir Produto',
    `Deseja realmente remover "${prod.name}" da loja?`,
    () => {
      products = products.filter(p => p.id !== productId);
      saveProductsToStorage();

      cart = cart.filter(item => item.productId !== productId);
      saveCartToStorage();
      updateCartUI();

      if (document.getElementById('editProductId').value === productId) resetProductForm();

      renderAdminProducts();
      renderStoreProducts();
      showToast('Produto excluído da vitrine.', 'info');
    }
  );
}

function renderAdminProducts() {
  const list = document.getElementById('adminProductsList');
  const filterText = (document.getElementById('adminSearchProd')?.value || '').toLowerCase();
  document.getElementById('adminProdCount').textContent = products.length;

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(filterText) ||
    p.description.toLowerCase().includes(filterText)
  );

  if (filtered.length === 0) {
    list.innerHTML = `<p class="text-center text-gray-500 text-sm py-8">Nenhum produto encontrado.</p>`;
    return;
  }

  list.innerHTML = filtered.map(prod => `
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-aromaCream hover:bg-aromaGreenLight/50 rounded-xl border border-aromaSand transition">
      <div class="flex items-center gap-3 min-w-0">
        <img src="${prod.image}" alt="${prod.name}" onerror="this.src='https://placehold.co/100x100/556b52/ffffff?text=Aromas'" class="w-14 h-14 rounded-lg object-cover bg-white border border-gray-200 flex-shrink-0" />
        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <h4 class="font-bold text-sm text-gray-900 truncate">${prod.name}</h4>
            <span class="text-[10px] bg-white border border-aromaSand text-aromaGreenDark px-2 py-0.5 rounded font-semibold flex-shrink-0">${prod.category || 'Aromas'}</span>
          </div>
          <p class="text-xs text-gray-500 truncate mt-0.5">${prod.description}</p>
          <p class="text-sm font-extrabold text-aromaGreenDark mt-1">${formatCurrency(prod.price)}</p>
        </div>
      </div>

      <div class="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
        <button onclick="startEditProduct('${prod.id}')" class="bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold px-3 py-1.5 rounded-lg text-xs transition flex items-center gap-1">
          <i class="fas fa-pen"></i> Editar
        </button>
        <button onclick="deleteProduct('${prod.id}')" class="bg-red-100 hover:bg-red-200 text-red-700 font-bold px-3 py-1.5 rounded-lg text-xs transition flex items-center gap-1">
          <i class="fas fa-trash"></i> Excluir
        </button>
      </div>
    </div>
  `).join('');
}

// =========================================================================
// 7. HISTÓRICO DE VENDAS
// =========================================================================
function renderAdminOrders() {
  const list = document.getElementById('adminOrdersList');
  document.getElementById('adminOrderCount').textContent = orders.length;
  document.getElementById('statTotalOrders').textContent = orders.length;

  const totalRevenue = orders.reduce((sum, ord) => sum + ord.total, 0);
  document.getElementById('statTotalRevenue').textContent = formatCurrency(totalRevenue);

  if (orders.length === 0) {
    list.innerHTML = `
      <div class="text-center py-12 px-4">
        <div class="w-14 h-14 bg-aromaGreenLight text-aromaGreen rounded-full flex items-center justify-center mx-auto mb-3 text-xl">
          <i class="fas fa-receipt"></i>
        </div>
        <h4 class="font-bold text-gray-800">Nenhuma venda registrada ainda</h4>
        <p class="text-xs text-gray-500 mt-1">Quando os clientes finalizarem pedidos na loja, todo o histórico aparecerá aqui.</p>
      </div>
    `;
    return;
  }

  list.innerHTML = orders.map(order => `
    <div class="p-5 hover:bg-aromaCream/50 transition">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div class="flex flex-wrap items-center gap-2">
          <span class="bg-aromaGreenDark text-white text-xs font-bold px-2.5 py-1 rounded-md">#${order.id}</span>
          <span class="text-xs text-gray-500"><i class="far fa-clock mr-1"></i>${order.date}</span>
          <span class="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
            <i class="fas fa-check-circle mr-1"></i>${order.status}
          </span>
        </div>
        <div class="text-right">
          <span class="text-xs text-gray-500 mr-1">Total:</span>
          <span class="text-lg font-extrabold text-aromaGreenDark">${formatCurrency(order.total)}</span>
        </div>
      </div>

      <div class="bg-aromaCream rounded-xl p-3 text-xs text-gray-700 mb-3 flex flex-wrap gap-x-6 gap-y-1 border border-aromaSand">
        <span><strong>Cliente:</strong> ${order.customerName}</span>
        <span><strong>Contato:</strong> ${order.customerPhone}</span>
        <span><strong>Pagamento:</strong> ${order.paymentMethod}</span>
      </div>

      <div class="space-y-1.5">
        <p class="text-[11px] font-bold uppercase text-gray-400">Itens Vendidos:</p>
        ${order.items.map(item => `
          <div class="flex justify-between items-center text-xs bg-white border border-gray-200 px-3 py-2 rounded-lg">
            <span class="font-medium text-gray-800">
              <strong class="text-aromaGreen">${item.quantity}x</strong> ${item.name}
            </span>
            <span class="font-bold text-gray-700">${formatCurrency(item.price * item.quantity)}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function clearOrderHistory() {
  if (orders.length === 0) {
    showToast('O histórico de vendas já está vazio.', 'info');
    return;
  }

  customConfirm(
    'Limpar Histórico de Vendas',
    'Tem certeza que deseja apagar todos os registros de vendas?',
    () => {
      orders = [];
      saveOrdersToStorage();
      renderAdminOrders();
      showToast('Histórico de vendas limpo.', 'info');
    }
  );
}

window.addEventListener('DOMContentLoaded', initApp);