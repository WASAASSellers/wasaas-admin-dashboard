import axios from 'axios';

const CORE_API_URL = import.meta.env.VITE_CORE_API_URL || 'http://localhost:5050/api';
const WHATSAPP_API_URL = import.meta.env.VITE_WHATSAPP_API_URL || 'http://localhost:3001/api';
const SOCIAL_HUB_API_URL = import.meta.env.VITE_SOCIAL_HUB_API_URL || 'http://localhost:3002/api';
const PAGE_BUILDER_API_URL = import.meta.env.VITE_PAGE_BUILDER_API_URL || 'http://localhost:3003/api';

export const coreApi = axios.create({ baseURL: CORE_API_URL });
export const whatsappApi = axios.create({ baseURL: WHATSAPP_API_URL });
export const socialHubApi = axios.create({ baseURL: SOCIAL_HUB_API_URL });
export const pageBuilderApi = axios.create({ baseURL: PAGE_BUILDER_API_URL });

// Interceptor para injetar JWT Token nas requisições da Core API
coreApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('wasaas_auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ─── AUTHENTICATION ──────────────────────────────────────────────────────────
export const loginUser = async (whatsApp, password) => {
    const res = await coreApi.post('/auth/login', { whatsApp, password });
    if (res.data.success && res.data.data?.token) {
        localStorage.setItem('wasaas_auth_token', res.data.data.token);
        localStorage.setItem('wasaas_user', JSON.stringify(res.data.data));
    }
    return res.data;
};

export const logoutUser = async () => {
    try {
        await coreApi.post('/auth/logout');
    } catch {
        // Silently clear local state
    }
    localStorage.removeItem('wasaas_auth_token');
    localStorage.removeItem('wasaas_user');
};

export const getCurrentUser = () => {
    const user = localStorage.getItem('wasaas_user');
    return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('wasaas_auth_token');
};

// ─── CATALOGUE (PRODUCTS, ADDONS, PLANS) ─────────────────────────────────────
export const getProducts = async () => {
    const res = await coreApi.get('/catalogue/products');
    return res.data.data?.items ?? [];
};

export const createProduct = async (productData) => {
    const res = await coreApi.post('/catalogue/products', productData);
    return res.data.data;
};

export const updateProduct = async (id, productData) => {
    const res = await coreApi.put(`/catalogue/products/${id}`, productData);
    return res.data.data;
};

export const deleteProduct = async (id) => {
    const res = await coreApi.delete(`/catalogue/products/${id}`);
    return res.data.data;
};

export const getAddons = async () => {
    const res = await coreApi.get('/catalogue/addons');
    return res.data.data?.items ?? [];
};

export const createAddon = async (addonData) => {
    const res = await coreApi.post('/catalogue/addons', addonData);
    return res.data.data;
};

export const updateAddon = async (id, addonData) => {
    const res = await coreApi.put(`/catalogue/addons/${id}`, addonData);
    return res.data.data;
};

export const deleteAddon = async (id) => {
    const res = await coreApi.delete(`/catalogue/addons/${id}`);
    return res.data.data;
};

export const getPlans = async () => {
    const res = await coreApi.get('/catalogue/plans');
    return res.data.data?.items ?? [];
};

// ─── ORDERS ──────────────────────────────────────────────────────────────────
export const getOrders = async () => {
    const res = await coreApi.get('/orders');
    return res.data.data?.items ?? [];
};

export const triggerDailyChoicesNotification = async () => {
    const res = await coreApi.post('/orders/notify-daily-choices');
    return res.data;
};

// ─── CLIENTS ─────────────────────────────────────────────────────────────────
export const getClients = async (pageNumber = 1, pageSize = 50) => {
    try {
        const res = await coreApi.get(`/clients?pageNumber=${pageNumber}&pageSize=${pageSize}`);
        return res.data.data?.items ?? [];
    } catch {
        return [];
    }
};

export const registerClient = async (clientData) => {
    const res = await coreApi.post('/clients', clientData);
    return res.data.data;
};

// ─── FINANCE & SUMMARY ───────────────────────────────────────────────────────
export const getFinanceSummary = async (start = null, end = null) => {
    try {
        const params = {};
        if (start) params.start = start;
        if (end) params.end = end;
        const res = await coreApi.get('/finance/summary', { params });
        return res.data.data ?? null;
    } catch {
        return null;
    }
};

export const addExpense = async (expenseData) => {
    const res = await coreApi.post('/finance/expenses', expenseData);
    return res.data.data;
};

// ─── SETTINGS ────────────────────────────────────────────────────────────────
export const getSystemSettings = async () => {
    try {
        const res = await coreApi.get('/settings');
        return res.data.data ?? [];
    } catch {
        return [];
    }
};

export const updateSystemSetting = async (key, value) => {
    const res = await coreApi.patch(`/settings/${key}`, { value });
    return res.data.data;
};

// ─── WHATSAPP ENGINE ─────────────────────────────────────────────────────────
export const getWhatsAppStatus = async () => {
    try {
        const res = await whatsappApi.get('/status');
        return res.data;
    } catch {
        return { isConnected: false, qrCode: null };
    }
};

// ─── SOCIAL HUB ──────────────────────────────────────────────────────────────
export const getScheduledPosts = async () => {
    try {
        const res = await socialHubApi.get('/posts');
        return res.data.posts ?? [];
    } catch {
        return [];
    }
};

export const scheduleSocialPost = async (postData) => {
    const payload = {
        caption: postData.content ?? postData.caption,
        platform: postData.platform,
        scheduledAt: postData.scheduledAt,
    };
    const res = await socialHubApi.post('/posts/schedule', payload);
    return res.data;
};

// ─── PAGE BUILDER ────────────────────────────────────────────────────────────
const DEFAULT_TENANT_ID = import.meta.env.VITE_TENANT_ID || 'default';

export const getPageLayout = async (tenantId = DEFAULT_TENANT_ID) => {
    try {
        const res = await pageBuilderApi.get(`/builder/layout?tenantId=${tenantId}`);
        return res.data.layout?.blocks ?? res.data.blocks ?? [];
    } catch {
        return [];
    }
};

export const savePageLayout = async (blocks, tenantId = DEFAULT_TENANT_ID) => {
    const res = await pageBuilderApi.post('/builder/layout', { tenantId, layout: { blocks } });
    return res.data;
};

// ─── SUBSCRIPTIONS ───────────────────────────────────────────────────────────
export const calculateSubscription = async (selectedModuleIds, extraAgentsCount = 0) => {
    const res = await coreApi.post('/subscriptions/calculate', {
        selectedModuleIds,
        extraAgentsCount,
    });
    return res.data.data?.calculation ?? null;
};

export const checkoutSubscription = async (checkoutData) => {
    const res = await coreApi.post('/subscriptions/checkout', checkoutData);
    return res.data.data?.checkout ?? null;
};

