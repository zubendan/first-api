#!/bin/bash

cp .env.docker .env
rm -rf data
npx prisma generate
