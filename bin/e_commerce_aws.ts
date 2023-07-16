import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {ProductsAppStack} from "../lib/productsApp-stack";
import {ECommerceApiStack} from "../lib/ecommerceApi-stack";

const app = new cdk.App();

const env: cdk.Environment ={
    account: "117293061248",
    region: "sa-east-1",
}

const tags = {
    const: "Ecommerce",
    team: "Team",
}

const productAppStack = new ProductsAppStack(app, "ProductApp", {
    tags: tags,
    env: env
})

const eCommerceApiStack = new ECommerceApiStack(app , "EcommerceApi", {
    productsFetchHandler: productAppStack.productsFetchHandler,
    productsAdminHandler: productAppStack.productsAdminHandler,
    tags: tags,
    env: env
})
eCommerceApiStack.addDependency(productAppStack)
