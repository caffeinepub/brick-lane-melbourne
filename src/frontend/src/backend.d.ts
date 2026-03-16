import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface MenuItem {
    name: string;
    description: string;
    isPopular: boolean;
    category: string;
    priceCents: bigint;
}
export type Time = bigint;
export interface CafeInfo {
    contact: string;
    hours: string;
    address: string;
}
export interface Review {
    content: string;
    date: Time;
    reviewerName: string;
    rating: number;
}
export interface Photo {
    url: string;
    title: string;
    category: string;
}
export interface backendInterface {
    addMenuItem(name: string, description: string, category: string, priceCents: bigint, isPopular: boolean): Promise<void>;
    addPhoto(title: string, category: string, url: string): Promise<void>;
    addReview(reviewerName: string, rating: number, content: string): Promise<void>;
    deleteMenuItem(name: string): Promise<void>;
    deletePhoto(title: string): Promise<void>;
    deleteReview(date: Time): Promise<void>;
    getCafeInfo(): Promise<CafeInfo>;
    getMenuItems(): Promise<Array<MenuItem>>;
    getPhotos(): Promise<Array<Photo>>;
    getReviews(): Promise<Array<Review>>;
    initializeAdmin(): Promise<void>;
    updateCafeInfo(hours: string, contact: string, address: string): Promise<void>;
    updateMenuItem(name: string, description: string, category: string, priceCents: bigint, isPopular: boolean): Promise<void>;
}
