#!/usr/bin/env bash
awslocal s3 mb s3://shop-admin

aws --endpoint-url=http://localhost:4566 sqs create-queue --queue-name dummy-queue --region eu-north-1

awslocal ses verify-email-identity --email-address pivis36787@evilant.com --endpoint-url=http://localhost:4566