/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export const publicApi = createApi({
  reducerPath: "publicApi",
  baseQuery: fetchBaseQuery({ baseUrl, credentials: "include" }),
  tagTypes: ["Menu", "Plans", "Products", "Locations", "Builder"],
  endpoints: (builder) => ({
    getWebsiteNavigation: builder.query<
      ApiResponse<Array<{ id: string; slug: string; title: string; navLabel: string; kind: string }>>,
      void
    >({
      query: () => "/website-navigation",
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
      query: () => "/products",
      providesTags: ["Products"],
    }),
    getProductByHandle: builder.query<ApiResponse<any>, string>({
      query: (handle) => `/products/${handle}`,
      providesTags: ["Products"],
    }),
    getLocations: builder.query<ApiResponse<any[]>, void>({
      query: () => "/locations",
      providesTags: ["Locations"],
    }),
    getBuilderIngredients: builder.query<ApiResponse<any[]>, void>({
      query: () => "/ingredients",
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
    }),
    getCurrentCustomer: builder.query<
      ApiResponse<{ user: { id: string; email: string; role: string } }>,
      void
    >({
      query: () => "/auth/me",
    }),
    logoutCustomer: builder.mutation<ApiResponse<{ loggedOut: boolean }>, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
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
      query: (body) => ({ url: "/promo-codes/validate", method: "POST", body }),
    }),
    checkout: builder.mutation<ApiResponse<any>, any>({
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
