import { AxiosInstance } from 'axios';
import { LoginRequest, AuthResponse, User } from '../types';
declare const apiClient: AxiosInstance;
export declare const authApi: {
    login: (credentials: LoginRequest) => Promise<import("axios").AxiosResponse<AuthResponse, any, {}, any>>;
    getMe: () => Promise<import("axios").AxiosResponse<{
        success: boolean;
        data: User;
    }, any, {}, any>>;
};
export declare const customerApi: {
    getAll: (page?: number, limit?: number, search?: string, status?: string) => Promise<import("axios").AxiosResponse<any, any, {}, {
        page: number;
        limit: number;
        search: string | undefined;
        status: string | undefined;
    }>>;
    getById: (id: string) => Promise<import("axios").AxiosResponse<any, any, {}, any>>;
    create: (data: any) => Promise<import("axios").AxiosResponse<any, any, {}, any>>;
    update: (id: string, data: any) => Promise<import("axios").AxiosResponse<any, any, {}, any>>;
    delete: (id: string) => Promise<import("axios").AxiosResponse<any, any, {}, any>>;
    getNotes: (customerId: string, page?: number, limit?: number) => Promise<import("axios").AxiosResponse<any, any, {}, {
        page: number;
        limit: number;
    }>>;
    addNote: (customerId: string, noteText: string) => Promise<import("axios").AxiosResponse<any, {
        noteText: string;
    }, {}, any>>;
    updateNote: (customerId: string, noteId: string, noteText: string) => Promise<import("axios").AxiosResponse<any, {
        noteText: string;
    }, {}, any>>;
    deleteNote: (customerId: string, noteId: string) => Promise<import("axios").AxiosResponse<any, any, {}, any>>;
};
export declare const productApi: {
    getAll: (page?: number, limit?: number, search?: string, active?: boolean) => Promise<import("axios").AxiosResponse<any, any, {}, {
        page: number;
        limit: number;
        search: string | undefined;
        active: boolean | undefined;
    }>>;
    getById: (id: string) => Promise<import("axios").AxiosResponse<any, any, {}, any>>;
    create: (data: any) => Promise<import("axios").AxiosResponse<any, any, {}, any>>;
    update: (id: string, data: any) => Promise<import("axios").AxiosResponse<any, any, {}, any>>;
    delete: (id: string) => Promise<import("axios").AxiosResponse<any, any, {}, any>>;
};
export declare const inventoryApi: {
    stockIn: (productId: string, quantity: number, reason: string) => Promise<import("axios").AxiosResponse<any, {
        productId: string;
        quantity: number;
        reason: string;
    }, {}, any>>;
    stockOut: (productId: string, quantity: number, reason: string) => Promise<import("axios").AxiosResponse<any, {
        productId: string;
        quantity: number;
        reason: string;
    }, {}, any>>;
    getMovements: (page?: number, limit?: number) => Promise<import("axios").AxiosResponse<any, any, {}, {
        page: number;
        limit: number;
    }>>;
    getProductMovements: (productId: string, page?: number, limit?: number) => Promise<import("axios").AxiosResponse<any, any, {}, {
        page: number;
        limit: number;
    }>>;
};
export declare const challanApi: {
    getAll: (page?: number, limit?: number, status?: string) => Promise<import("axios").AxiosResponse<any, any, {}, {
        page: number;
        limit: number;
        status: string | undefined;
    }>>;
    getById: (id: string) => Promise<import("axios").AxiosResponse<any, any, {}, any>>;
    create: (data: any) => Promise<import("axios").AxiosResponse<any, any, {}, any>>;
    update: (id: string, data: any) => Promise<import("axios").AxiosResponse<any, any, {}, any>>;
    confirm: (id: string) => Promise<import("axios").AxiosResponse<any, any, {}, any>>;
    cancel: (id: string) => Promise<import("axios").AxiosResponse<any, any, {}, any>>;
};
export default apiClient;
//# sourceMappingURL=api.d.ts.map