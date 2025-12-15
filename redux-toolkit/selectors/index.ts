import type { RootState } from "@/store";
//initial data
export const getSupportedLanguagesSelector = (state: RootState) => state.initial.supportedLanguages;
export const getAppClientInfoSelector = (state: RootState) => state.initial.client;
export const getAppClientIsMobileSelector = (state: RootState) => state.initial.client.isMobile;
export const getAppClientTypeSelector = (state: RootState) => state.initial.client.client;
export const getAppClientPlatformSelector = (state: RootState) => state.initial.client.platform;
export const getAppClientBrowserSelector = (state: RootState) => state.initial.client.browser;

// client data
export const getClientDataSelector = (state: RootState) => state.client;
export const getClientIdSelector = (state: RootState) => state.client.id;
export const getClientConfigsSelector = (state: RootState) => state.client.configs;
export const getClientAccessSelector = (state: RootState) => state.client.access;
export const getClientAuth0ConfigsSelector = (state: RootState) => state.client.auth0Configs;
export const getClientBenefitsSelector = (state: RootState) => state.client.benefits;

// app session
export const getAppSessionSelector = (state: RootState) => state.session;
export const getAppSessionIsAuthorizedSelector = (state: RootState) => state.session.isAuthorized;
export const getAppSessionCredentialsSelector = (state: RootState) => state.session.credentials;
export const getAppSessionUserSelector = (state: RootState) => state.session.user;
export const getAppSessionAvatarSelector = (state: RootState) => state.session.avatar;

// registration flow
export const getRegistrationDataSelector = (state: RootState) => state.registration;
export const getRegistrationStepsSelector = (state: RootState) => state.registration.registrationSteps;

// dashboard
export const getDashboardStateSelector = (state: RootState) => state.dashboard;
export const getIsSaraOpenedSelector = (state: RootState) => state.dashboard.isSaraOpened;
export const getUserMessageSelector = (state: RootState) => state.dashboard.userMessage;
