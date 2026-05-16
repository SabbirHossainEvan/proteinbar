/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = "/api/v1";

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

type CheckoutResponse = {
  order: {
    orderId: string;
    subscriptionId: string;
  };
  payment: {
    provider: "CMI";
    gatewayUrl: string;
    method: "POST";
    fields: Record<string, string>;
  };
};

export const publicApi = createApi({
  reducerPath: "publicApi",
  baseQuery: fetchBaseQuery({ baseUrl, credentials: "include" }),
  tagTypes: ["Menu", "Plans", "Products", "Locations", "Builder", "Auth"],
  endpoints: (builder) => ({
    getWebsiteNavigation: builder.query<
      ApiResponse<Array<{ id: string; slug: string; title: string; navLabel: string; kind: string }>>,
      void
    >({
      query: () => "/public/website-navigation",
    }),
    getMenuCategories: builder.query<ApiResponse<any[]>, void>({
      query: () => "/menu-categories",
      providesTags: ["Menu"],
    }),
    getRestaurants: builder.query<ApiResponse<any[]>, void>({
      query: () => "/public/restaurants",
      providesTags: ["Locations"],
    }),
    getMonthlyPlans: builder.query<ApiResponse<any[]>, void>({
      query: () => "/public/monthly-plan/plans",
      providesTags: ["Plans"],
    }),
    getMonthlyPlanById: builder.query<ApiResponse<any>, string>({
      query: (planId) => `/public/monthly-plan/plans/${planId}`,
      providesTags: ["Plans"],
    }),
    getProducts: builder.query<ApiResponse<any[]>, void>({
      query: () => "/public/products",
      providesTags: ["Products"],
    }),
    getProductByHandle: builder.query<ApiResponse<any>, string>({
      query: (handle) => `/public/products/${handle}`,
      providesTags: ["Products"],
    }),
    getLocations: builder.query<ApiResponse<any[]>, void>({
      query: () => "/public/locations",
      providesTags: ["Locations"],
    }),
    getBuilderIngredients: builder.query<ApiResponse<any[]>, void>({
      query: () => "/public/ingredients",
      providesTags: ["Builder"],
    }),
    sendCode: builder.mutation<ApiResponse<any>, { email: string }>({
      query: (body) => ({ url: "/auth/send-code", method: "POST", body }),
    }),
    verifyCode: builder.mutation<
      ApiResponse<any>,
      { email: string; code: string }
    >({
      query: (body) => ({ url: "/auth/verify-code", method: "POST", body }),
      invalidatesTags: ["Auth"],
    }),
    getCurrentCustomer: builder.query<
      ApiResponse<{ user: { id: string; email: string; role: string } }>,
      void
    >({
      query: () => "/auth/me",
      providesTags: ["Auth"],
    }),
    logoutCustomer: builder.mutation<ApiResponse<{ loggedOut: boolean }>, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      invalidatesTags: ["Auth"],
    }),
    sendContact: builder.mutation<
      ApiResponse<any>,
      { name: string; phone: string; email: string; message: string }
    >({
      query: (body) => ({ url: "/contact", method: "POST", body }),
    }),
    validatePromoCode: builder.mutation<
      ApiResponse<{
        code: string;
        description: string;
        discountType: "percent" | "fixed";
        discountValue: number;
        discountAmount: number;
        maxDiscount: number | null;
        eligibilityNote: string;
      }>,
      { code: string; subtotal: number; scope?: "monthly-plan" | "direct-order" }
    >({
      query: (body) => ({ url: "/public/promo-codes/validate", method: "POST", body }),
    }),
    checkout: builder.mutation<ApiResponse<CheckoutResponse>, any>({
      query: (body) => ({ url: "/checkout", method: "POST", body }),
    }),
    createStoreOrder: builder.mutation<ApiResponse<any>, any>({
      query: (body) => ({ url: "/store-orders", method: "POST", body }),
    }),
  }),
});

export const {
  useGetWebsiteNavigationQuery,
  useGetMenuCategoriesQuery,
  useGetRestaurantsQuery,
  useGetMonthlyPlansQuery,
  useGetMonthlyPlanByIdQuery,
  useGetProductsQuery,
  useGetProductByHandleQuery,
  useGetLocationsQuery,
  useGetBuilderIngredientsQuery,
  useSendCodeMutation,
  useVerifyCodeMutation,
  useGetCurrentCustomerQuery,
  useLogoutCustomerMutation,
  useSendContactMutation,
  useValidatePromoCodeMutation,
  useCheckoutMutation,
  useCreateStoreOrderMutation,
} = publicApi;
