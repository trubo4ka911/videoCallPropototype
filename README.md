1. run _npm i_ in frontend and backend

2. **Create cert files**
   PS C:\ --_file way_-- \videoCallPropototype\teleLegal-back-end\certs> mkcert create-ca  
    PS C:\ --_file way_-- \videoCallPropototype\teleLegal-back-end\certs> mkcert create-cert

**Answer:**

Private Key: cert.key

Certificate: cert.crt

3. **start backend** script "start"
4. **start frontend** script "start"
5. open in browser _https://localhost:9001/user-link_
6. copy token ?token= --_all text_--
7. add token - https://localhost:3000/join-video?token= --_all text_--

-- Markup for dashboard:

1. Import markup for dashboard
2. Create path to dashboard
3. Create JWT for attorney auth and validate handshake
4. Reorganize appt data
5. Pull back and display appointment data on connect
6. Add listener for user ready when connected
7. On click join button go to /join-video (request userMedia)
8. Prompt for video and audio before connecting
9. Create answer, gather iceCandidates and connect!
