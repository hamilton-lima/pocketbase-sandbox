# Use a specific Node.js version as the base image
FROM node:14.17.6 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire app's source code
COPY . .

# Build the React app
RUN npm run build

# Use a specific nginx version for serving the static files
FROM nginx:1.21.4-alpine

# Copy the static build from the previous stage to the nginx directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 to outside world
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]