FROM postgres:15-alpine

# Environment variables to initialize the DB
ENV POSTGRES_DB=recipe_db
ENV POSTGRES_USER=user
ENV POSTGRES_PASSWORD=password

# Any .sql files in this folder are executed automatically on startup
COPY init.sql /docker-entrypoint-initdb.d/

EXPOSE 5432