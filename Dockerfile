FROM node:18

# Set working directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Ensure native modules are built correctly
RUN npm rebuild bcrypt

# Expose port and start application
EXPOSE 3001
CMD ["npm", "start"]
