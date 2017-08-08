Bolius central login
====================

This project is the Bolius login React page. It is a single page app that allow external 
applications to use a central login service.

The actual login is using Amazon Cognito, and support various login mechanisms, where 
username/password and facebook is the most used ones. 

When successfully logged in, a  JSON Web token (JWT) is issued from Amazon cognito, and this
token can be used as validation for other systems, including the TYPO3 website and the 
api.bolius.dk

Sending success_url parameters
-------------------------------
To have the loginsite redirect the enduser to another page after success login, a queryParameter
success_url can be included in the request, and the user will be sent to that URL after login 
with the issued JWT appended as query param.

Example:

 https://login.bolius.dk/?success_url=http://example.com/token

Will send the user to the follwin page on successful login. 

 http://example.com/token?jwt=<JSONWebToken>


Custom styling
--------------
The loginpage support a few different styling controlled by the ?ref=XXX query Param. Currently
only ref=husetskalender is supported.


Refreshing JWT login tokens
---------------------------
The issued JWT has a limited lifetime where its valid. To refresh the login, and issue a new JWT
call the /refresh endpoint, possibly with a ?redirect_url parameter to send the user back.

