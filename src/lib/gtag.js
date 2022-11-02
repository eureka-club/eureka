export const GTM_ID = process.env.NODE_ENV=='development' 
  ? process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID_STAGING
  : process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID

export const pageview = (url) => {
  window.dataLayer.push({
    event: 'pageview',
    page: url,
  })
}