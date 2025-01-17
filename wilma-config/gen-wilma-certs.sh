#!/bin/bash

# Crear directorio de certificados si no existe
cd ..
mkdir -p certs
cd certs

# Generar clave privada
openssl genrsa -out key.key 2048

# Generar solicitud de firma de certificado (CSR)
openssl req -new -key key.key -out cert.csr -subj "/C=ES/ST=Valencia/L=Valencia/O=FIWARE/OU=Security/CN=wilma"

# Generar certificado autofirmado
openssl x509 -req -days 365 -in cert.csr -signkey key.key -out cert.crt

# Eliminar el CSR ya que no lo necesitamos
rm cert.csr

# Establecer permisos correctos
chmod 644 cert.crt
chmod 600 key.key

echo "Certificados generados correctamente en el directorio ./cert"
ls -l