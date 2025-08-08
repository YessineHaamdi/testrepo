FROM node:20

WORKDIR /app

# Install Angular CLI globally
RUN npm install -g @angular/cli@15

# Copy package files and install deps
COPY package*.json ./
RUN npm install --omit=dev --legacy-peer-deps

# Copy the full app and build it in prod mode
COPY . .
RUN ng build --configuration=production

# EXPOSE the dev server port
EXPOSE 4200

# Start with ng serve (still not optimal for prod, but OK for your setup)
CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--port", "4200", "--disable-host-check", "--configuration=production"]
