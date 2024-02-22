//environment pro lokální verzi
export const environment = {
    production: false,
    baseProductAPIUrl: 'https://localhost:8081/api/products',
    findByCategory: '/search/findByCategoryId?id=',
    searchByNameOrDesc: '/search/findProductsByNameOrDesc?searchText=',
    baseProductCategoriesUrl: 'https://localhost:8081/api/product-category',
    countriesUrL: 'https://localhost:8081/api/countries',
    statesUrl: 'https://localhost:8081/api/states',
    statesByCountryCodeUrl: 'https://localhost:8081/api/states/search/findByCountryCode?code=',
    checkoutUrl: 'https://localhost:8081/api/checkout/purchase',
    paymentIntentUrl: 'https://localhost:8081/api/checkout/payment-intent',
    orderHistoryByEmailUrl: 'https://localhost:8081/api/orders/search/findByCustomerEmailOrderByDateCreatedDesc?email=',
    securedEndpoints: ['https://localhost:8081/api/orders'],
    stripePublishableKey: 'pk_test_51OmGRPD5emMfwBCeKAPUexdTaOrodz9Hz2O4CAGtul61wwoQEWRMWYcgUqv64Q6QyWMgPHjCWFCcBdNJ5YLejoV600NDzFTsK0'
}

//stripePublishableKey je z stripe dashboardu a je bezpečné ho mít takto uveřejnění (narozdíl od secret key v idee, který by ideálně měl být uložen jako env variable)