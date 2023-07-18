import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from "aws-lambda";
import {DynamoDB} from "aws-sdk";
import { Product, ProductRepository } from "/opt/nodejs/productsLayer";

const productsDdb = process.env.PRODUCTS_DDB!
const ddbClient = new DynamoDB.DocumentClient()
const productRepository = new ProductRepository(ddbClient,productsDdb)
export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

    const lambdaRequestId = context.awsRequestId
    const apiRequestId = event.requestContext.requestId

    console.log(`API Gateway RequestID: ${lambdaRequestId} - Lambda RequestId: ${apiRequestId}`)
    if (event.resource === '/products') {
        console.log('POST /products')
        const product = JSON.parse(event.body!) as Product
        const productCreated = await productRepository.create(product)
        return {
            statusCode: 200,
            body: JSON.stringify(productCreated)
        }
    } else if(event.resource === '/products/{id}') {
        const productId = event.pathParameters!.id as string
        const product = JSON.parse(event.body!) as Product

        if(event.httpMethod === 'PUT') {
            console.log(`PUT /products/${productId}`)
            try {
                const productUpdate = productRepository.updateProduct(productId,product)
                return {
                    statusCode: 200,
                    body: JSON.stringify(productUpdate)
                }
            } catch (ConditionalCheckFailedException) {
                return {
                    statusCode: 404,
                    body: 'Product not found'
                }
            }

        }
        else if(event.httpMethod === 'DELETE') {
            console.log(`DELETE /products/${productId}`)
            try {
                const productDeleted = await productRepository.deleteProduct(productId)
                return {
                    statusCode: 200,
                    body: JSON.stringify(productDeleted)
                }
            }catch (error){
                return {
                    statusCode: 404,
                    body: JSON.stringify((<Error>error).message)
                }
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
