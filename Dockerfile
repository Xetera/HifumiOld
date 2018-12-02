FROM postgres:10.3
COPY init.sql /docker-entrypoint-initdb.d
