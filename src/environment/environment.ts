export const environment = {
    baseProductAPIUrl: 'https://localhost:8081/api/products',
    findByCategory: '/search/findByCategoryId?id=',
    searchByNameOrDesc: '/search/findProductsByNameOrDesc?searchText=',
    baseProductCategoriesUrl: 'https://localhost:8081/api/product-category',
    countriesUrL: 'https://localhost:8081/api/countries',
    statesUrl: 'https://localhost:8081/api/states',
    statesByCountryCodeUrl: 'https://localhost:8081/api/states/search/findByCountryCode?code=',
    checkoutUrl: 'https://localhost:8081/api/checkout/purchase',
    orderHistoryByEmailUrl: 'https://localhost:8081/api/orders/search/findByCustomerEmailOrderByDateCreatedDesc?email=',
    securedEndpoints: ['https://localhost:8081/api/orders']
}