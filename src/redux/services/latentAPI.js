
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// making API calls using RTK Query

export const latentAPI = createApi({
  reducerPath: 'latentAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api/v1',
    // baseUrl: 'http://localhost:3001/api/v1',
    credentials: 'include',
  }),
  tagTypes: ['User', 'House', 'Agent'],
  endpoints: (builder) => ({
    getLoggedInUser: builder.query({ query: () => '/users', providesTags: ['User', 'House'] }),
    getAgent: builder.query({ query: (agentId) => `/agents/${agentId}`, providesTags: ['Agent'] }),
    getAllHouses: builder.query({ query: () => '/houses', providesTags: ['House'] }),
    getHouses: builder.query({
      query: (data) => ({
        url: '/houses',
        params: data,
      }),
    }),
    getHouseImages: builder.query({
      query: (data) => ({
        url: `/houses/${data.houseId}`,
        params: data.params,
        responseType: 'blob',
      }),
    }),
    registerUser: builder.mutation({
      query: (user) => ({
        url: '/users',
        method: 'POST',
        body: user,
      }),
      invalidatesTags: ['User'], // user auto-authenticated, so fetch...
    }),
    editUser: builder.mutation({
      query: (user) => ({
        url: '/users',
        method: 'PUT',
        body: user,
      }),
      invalidatesTags: ['User'], // user details changed, so fetch...
    }),
    deleteUser: builder.mutation({
      query: () => ({
        url: '/users',
        method: 'DELETE',
      }),
    }),
    login: builder.mutation({
      query: (user) => ({
        url: '/login',
        method: 'POST',
        body: user,
      }),
      invalidatesTags: ['User'], // currentUser (not in cache) so fetch to update cache
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'], // current user invalid ... fetch to update cache (to invalid)
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: '/reset-password',
        method: 'PUT',
        body: data,
      }),
    }),
    postHouse: builder.mutation({
      query: (houseData) => ({
        url: '/houses',
        method: 'POST',
        body: houseData,
      }),
      invalidatesTags: ['User', 'House'], // user.listings needs to be updated, as does allHouses, so fetch...
    }),
    editHouse: builder.mutation({
      query: (houseData) => ({
        url: `/houses/${houseData.get('id')}`,
        method: 'PUT',
        body: houseData,
      }),
      invalidatesTags: ['House'], // allHouses affected (figure out how to refetch only `this` house using [id and args] ), so fetch...
    }),
    deleteHouse: builder.mutation({
      query: (houseId) => ({
        url: `/houses/${houseId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User', 'House'], // user.listings needs to be updated, as does allHouses, so fetch...
    }),
    bookAppointment: builder.mutation({
      query: (houseId) => ({
        url: `/appointment/${houseId}`,
        method: 'POST',
      }),
      invalidatesTags: ['User'], // user's cart changes, so refetch...
    }),
    reviewAgent: builder.mutation({
      query: (review) => ({
        url: `/agents/${review.agentId}/reviews`,
        method: 'POST',
        body: review.review,
      }),
      invalidatesTags: ['Agent'], // new review needs to be updated in agentReviews, refetch agent...
    }),
  }),
});

export const {
  useGetLoggedInUserQuery,
  useGetAgentQuery,
  useGetAllHousesQuery,
  useGetHousesQuery,
  useGetHouseImagesQuery,
  useRegisterUserMutation,
  useLoginMutation,
  useLogoutMutation,
  useResetPasswordMutation,
  usePostHouseMutation,
  useEditHouseMutation,
  useBookAppointmentMutation,
  useDeleteHouseMutation,
  useEditUserMutation,
  useDeleteUserMutation,
  useReviewAgentMutation,
} = latentAPI; // export the entire api slice ... Only one api slice is allowed per server & application
