import axios from 'axios';

const CORE_API_URL = 'http://localhost:5050/api';
const WHATSAPP_API_URL = 'http://localhost:3001/api';
const SOCIAL_HUB_API_URL = 'http://localhost:3002/api';
const PAGE_BUILDER_API_URL = 'http://localhost:3003/api';

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

export const getScheduledPosts = async () => {
    try {
        const res = await socialHubApi.get('/posts');
        return res.data.data ?? [];
    } catch {
        return [];
    }
};

export const scheduleSocialPost = async (postData) => {
    const res = await socialHubApi.post('/posts/schedule', postData);
    return res.data;
};

export const getPageLayout = async () => {
    try {
        const res = await pageBuilderApi.get('/layout');
        return res.data.blocks ?? [];
    } catch {
        return [];
    }
};

export const savePageLayout = async (blocks) => {
    const res = await pageBuilderApi.post('/layout', { blocks });
    return res.data;
};
