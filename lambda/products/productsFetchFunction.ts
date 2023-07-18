import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from "aws-lambda";
import {DynamoDB} from "aws-sdk";
import { ProductRepository } from "/opt/nodejs/productsLayer";

const productsDdb = process.env.PRODUCTS_DDB!
const ddbClient = new DynamoDB.DocumentClient()
const productRepository = new ProductRepository(ddbClient,productsDdb)

export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

    const lambdaRequestId =  context.awsRequestId
    const apiRequestId =  event.requestContext.requestId

    console.log(`API Gateway RequestID: ${lambdaRequestId} - Lambda RequestId: ${apiRequestId}`)
    const method = event.httpMethod;
    if(event.resource === '/products') {
        if (method === 'GET') {
            console.log('getProducts')
            const products = await productRepository.getProductById();
            return {
                statusCode: 200,
                body: JSON.stringify(products)
            }
        }
    } else if (event.resource === '/products/{id}') {
        const productId = event.pathParameters!.id as string;
        console.log(`GET /products/${productId}`)

        try {

            const product = await productRepository.getProductById(productId);
            return {
                statusCode: 200,
                body: JSON.stringify(product)
            }
        } catch (error) {
            console.error((<Error>error).message)
            return {
                statusCode: 404,
                body: JSON.stringify((<Error>error).message)
            }
        }
    }

    return {
        statusCode: 400,
        body: JSON.stringify({
            message: 'Bad Request'
        })
    }
}
