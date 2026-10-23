#!/bin/sh
set -e

KEYSTORE="/app/certs/gym-gateway.p12"

echo "Verificando certificado SSL..."

if [ ! -f "$KEYSTORE" ]; then

    echo "Certificado não encontrado."
    echo "Gerando certificado para: ${SSL_HOST}"

    mkdir -p /app/certs

    keytool -genkeypair \
        -alias gym-gateway \
        -keyalg RSA \
        -keysize 2048 \
        -storetype PKCS12 \
        -keystore "$KEYSTORE" \
        -storepass "$SSL_KEY_STORE_PASSWORD" \
        -keypass "$SSL_KEY_STORE_PASSWORD" \
        -validity 3650 \
        -dname "CN=${SSL_HOST}, OU=Academia, O=Gym, C=BR" \
        -ext "SAN=dns:${SSL_HOST},ip:127.0.0.1"

    echo "Certificado SSL criado com sucesso."

else

    echo "Certificado SSL já existe."

fi

echo "Iniciando Gym Gateway..."

exec java -jar /app/app.jar