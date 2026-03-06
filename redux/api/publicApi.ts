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
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ["Menu", "Plans", "Products", "Locations", "Builder"],
  endpoints: (builder) => ({
    getMenuCategories: builder.query<ApiResponse<any[]>, void>({
      query: () => "/menu-categories",
      providesTags: ["Menu"],
    }),
    getMonthlyPlans: builder.query<ApiResponse<any[]>, void>({
      query: () => "/monthly-plans",
      providesTags: ["Plans"],
    }),
    getMonthlyPlanById: builder.query<ApiResponse<any>, string>({
      query: (planId) => `/monthly-plans/${planId}`,
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
    sendContact: builder.mutation<
      ApiResponse<any>,
      { name: string; phone: string; email: string; message: string }
    >({
      query: (body) => ({ url: "/contact", method: "POST", body }),
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
  useGetMenuCategoriesQuery,
  useGetMonthlyPlansQuery,
  useGetMonthlyPlanByIdQuery,
  useGetProductsQuery,
  useGetProductByHandleQuery,
  useGetLocationsQuery,
  useGetBuilderIngredientsQuery,
  useSendCodeMutation,
  useVerifyCodeMutation,
  useSendContactMutation,
  useCheckoutMutation,
  useCreateStoreOrderMutation,
} = publicApi;
