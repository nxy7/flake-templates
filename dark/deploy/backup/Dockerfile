# Kontener backupu: pg_dump co noc -> R2. Kontekst builda: deploy/backup
FROM postgres:17-alpine
RUN apk add --no-cache aws-cli
COPY backup.sh restore.sh entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/*.sh
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
