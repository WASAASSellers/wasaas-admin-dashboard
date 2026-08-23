import axios from 'axios';

const CORE_API_URL = import.meta.env.VITE_CORE_API_URL || 'http://localhost:5050/api';
const WHATSAPP_API_URL = import.meta.env.VITE_WHATSAPP_API_URL || 'http://localhost:3001/api';
const SOCIAL_HUB_API_URL = import.meta.env.VITE_SOCIAL_HUB_API_URL || 'http://localhost:3002/api';
const PAGE_BUILDER_API_URL = import.meta.env.VITE_PAGE_BUILDER_API_URL || 'http://localhost:3003/api';

export const coreApi = axios.create({ baseURL: CORE_API_URL });
export const whatsappApi = axios.create({ baseURL: WHATSAPP_API_URL });
export const socialHubApi = axios.create({ baseURL: SOCIAL_HUB_API_URL });
export const pageBuilderApi = axios.create({ baseURL: PAGE_BUILDER_API_URL });

export const getProducts = async () => {
    const res = await coreApi.get('/catalogue/products');
    return res.data.data?.items ?? [];
};

export const getAddons = async () => {
    const res = await coreApi.get('/catalogue/addons');
    return res.data.data?.items ?? [];
};

export const getPlans = async () => {
    const res = await coreApi.get('/catalogue/plans');
    return res.data.data?.items ?? [];
};

export const getOrders = async () => {
    const res = await coreApi.get('/orders');
    return res.data.data?.items ?? [];
};

export const triggerDailyChoicesNotification = async () => {
    const res = await coreApi.post('/orders/notify-daily-choices');
    return res.data;
};

export const getWhatsAppStatus = async () => {
    try {
        const res = await whatsappApi.get('/status');
        return res.data;
    } catch {
        return { isConnected: false, qrCode: null };
    }
};

// FIX: Social Hub retorna { success, count, posts } — campo correto é posts
export const getScheduledPosts = async () => {
    try {
        const res = await socialHubApi.get('/posts');
        return res.data.posts ?? [];
    } catch {
        return [];
    }
};

// FIX: campo enviado deve ser 'caption', não 'content'
export const scheduleSocialPost = async (postData) => {
    const payload = {
        caption: postData.content ?? postData.caption,
        platform: postData.platform,
        scheduledAt: postData.scheduledAt,
    };
    const res = await socialHubApi.post('/posts/schedule', payload);
    return res.data;
};

// FIX: rota correta é /builder/layout com tenantId como query param
const DEFAULT_TENANT_ID = import.meta.env.VITE_TENANT_ID || 'default';

export const getPageLayout = async (tenantId = DEFAULT_TENANT_ID) => {
    try {
        const res = await pageBuilderApi.get(`/builder/layout?tenantId=${tenantId}`);
        return res.data.blocks ?? [];
    } catch {
        return [];
    }
};

export const savePageLayout = async (blocks, tenantId = DEFAULT_TENANT_ID) => {
    const res = await pageBuilderApi.post('/builder/layout', { tenantId, blocks });
    return res.data;
};

// Resumo financeiro real da Core API
export const getFinanceSummary = async () => {
    try {
        const res = await coreApi.get('/finance/summary');
        return res.data.data ?? null;
    } catch {
        return null;
    }
};

// FIX: rotas corretas para subscrição por módulos
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
