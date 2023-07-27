import * as cdk from "aws-cdk-lib"
import * as dynamodb from "aws-cdk-lib/aws-dynamodb"
import {AttributeType, BillingMode} from "aws-cdk-lib/aws-dynamodb"
import {Construct} from "constructs";

export class EventsDdbStack extends cdk.Stack {
    readonly table: dynamodb.Table

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super();

        this.table = new dynamodb.Table(this,"EventsDdb", {
            tableName: "events",
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            partitionKey: {
                name: "pk",
                type: AttributeType.STRING
            },
            sortKey:{
                name: "sk",
                type: AttributeType.STRING
            },
            timeToLiveAttribute: "ttl",
            billingMode: BillingMode.PROVISIONED,
            readCapacity: 1,
            writeCapacity: 1
        })
    }
}
