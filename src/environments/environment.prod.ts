//připravený soubor pro produkci
export const environment = {
    production: true,
    baseProductAPIUrl: 'https://mygreatappstore.com/api/products',
}

/* 
Pro sekci build v angular.json:
    "configurations": {
        "production": {
            "fileReplacements": [
                {
                    "replace": "src/environments/environment.ts",
                    "with": "src/environments/environment.production.ts"
                }
            ]
        }   
    }

Pro sekci serve v angular.json:
    "serve": {
        "configurations"{
            "production: {
                "browserTarget": "ecommerce-app:build:production"
            }
        }
    }

*/