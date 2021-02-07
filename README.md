# tauria_task

Initial assignment from Tauria for Junior Software Engineer Position

# FIRST HALF

Tech Used: Express, Typescript, Mongoose, bcryptjs, jsonwebtoken

Tasks completed:

Get users - DONE From Postman choose GET method. Request URL: localhost:1337/users/get/all

*******************************************************************************************************************************************************************************

Get user - DONE From Postman choose GET method. Request URL: localhost:1337/users/get/one?username='username string'

*******************************************************************************************************************************************************************************

Register - DONE From Postman choose POST method. Request URL: localhost:1337/users/register <br/> In the Body choose raw, JSON. <br/> Enter 
```json
{ 
  "username" : "user1",
  "password" : "password", 
  "mobtoken" : "" 
}
```
username and password are required, mobtoken is optional.

*******************************************************************************************************************************************************************************

Sign In - DONE From Postman choose POST method. Request URL: localhost:1337/users/login  <br/> In the Body choose raw, JSON. <br/> Enter   
```json
{ 
  "username" : "user1",
  "password" : "password"
} 

```
username and password are required. <br/>
P.S.: After successful Authentication token is returned from res. Save it for Update and Delete functions.

*******************************************************************************************************************************************************************************

Update User - DONE From Postman choose PUT method. Request URL: localhost:1337/users/update <br/> In the Header: type "Authorization" into key column type "Bearer " + saved token from Sign In function.  <br/> In the
Body choose raw, JSON. <br/> Enter 
```json
{ 
  "password" : "newpassword",
  "mobtoken" : "new token value"
} 
type either or both. Being Signed In is required!
```
type either or both. Being Signed In is required!
*******************************************************************************************************************************************************************************

Delete User - DONE From Postman choose DELETE method. Request URL: localhost:1337/users/remove <br/> In the Header: <br/> type "Authorization" into key column <br/> type "Bearer " + saved token from Sign In function <br/>
Being Signed In is required!
