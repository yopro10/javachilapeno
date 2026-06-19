# Usar imagen base de OpenJDK 17
FROM openjdk:17-slim

# Establecer directorio de trabajo
WORKDIR /app

# Copiar el archivo pom.xml y descargar dependencias
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copiar el código fuente
COPY src ./src

# Compilar y empaquetar la aplicación
RUN mvn clean package -DskipTests

# Exponer el puerto 8080 (Render usa variables de entorno, pero esto es un fallback)
EXPOSE 8080

# Ejecutar la aplicación
CMD ["java", "-jar", "target/javachilapeno-1.0-SNAPSHOT.jar"]
