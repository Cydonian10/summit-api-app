FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

# Copia el resto del código fuente
COPY . .

# Compila el proyecto (ajusta el comando si es diferente)
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]