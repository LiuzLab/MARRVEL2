FROM node:20
ARG ANGULAR_ENV=production

RUN mkdir -p /MARRVEL
WORKDIR /MARRVEL

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Build the Angular application
ENV NODE_OPTIONS=--openssl-legacy-provider
ENV ANGULAR_ENV=${ANGULAR_ENV}
ENV NG_CLI_ANALYTICS=false
RUN npm run build

# Generate documentation html
RUN mkdir -p dist/doc
RUN ./node_modules/raml2html/bin/raml2html doc/index.raml > dist/doc/index.html
