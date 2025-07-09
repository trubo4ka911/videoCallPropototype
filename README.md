1. npm i in frontend and backend

2. Create cert files
   PS C:\ file way \videoCallPropototype\teleLegal-back-end\certs> mkcert create-ca  
    PS C:\ file way \videoCallPropototype\teleLegal-back-end\certs> mkcert create-cert
   Answer:
   Private Key: cert.key
   Certificate: cert.crt

3. start backend script "start"
4. start frontend script "start"
5. open in browser https://localhost:9001/user-link
6. copy token ?token=all text
7. add token - https://localhost:3000/join-video?token=all text
