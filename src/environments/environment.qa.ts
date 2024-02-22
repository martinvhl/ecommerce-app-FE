//příklad dalšího ne-produkčního prostředí pro testování - jako lokál, ale na serveru pro testery
export const environment = {
    production: false,
    baseProductAPIUrl: 'https://localhost:9898/api/products',
}

//následně je třeba vytvořit konfiguraci v angular.json v sekci build a také s sekci serve -> pak budeme spouštět s tímto prostředím pomocí npm start -- --configuration=qa
/* 
Pro sekci build v angular.json:
    "configurations": {
        "qa": {
            "fileReplacements": [
                {
                    "replace": "src/environments/environment.ts",
                    "with": "src/environments/environment.qa.ts"
                }
            ]
        }   
    }

Pro sekci serve v angular.json:
    "serve": {
        "configurations"{
            "qa": {
                "browserTarget": "ecommerce-app:build:qa"
            }
        }
    }

*/