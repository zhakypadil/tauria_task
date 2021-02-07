# tauria_task

Initial assignment from Tauria for Junior Software Engineer Position

# FIRST HALF

Tech Used: Express, Typescript, Mongoose, bcryptjs, jsonwebtoken

Tasks completed:

Get users - DONE From Postman choose GET method. Request URL: localhost:1337/users/get/all

*******************************************************************************************************************************************************************************

Get user - DONE From Postman choose GET method. Request URL: localhost:1337/users/get/one?username=<username string>

*******************************************************************************************************************************************************************************

Register - DONE From Postman choose POST method. Request URL: localhost:1337/users/register<\br> In the Body choose raw, JSON. Enter 
```json
{ 
  "username" : "user1",
  "password" : "password", 
  "mobtoken" : "" 
}
```
username and password are required, mobtoken is optional.

*******************************************************************************************************************************************************************************

Sign In - DONE From Postman choose POST method. Request URL: localhost:1337/users/login In the Body choose raw, JSON. Enter   `{ "username" : "user1","password" : "password"}` username and password are
required.

P.S.: After successful Authentication token is returned from res. Save it for Update and Delete functions.

*******************************************************************************************************************************************************************************

Update User - DONE From Postman choose PUT method. Request URL: localhost:1337/users/update In the Header: type "Authorization" into key column type "Bearer " + save token from Sign In function In the
Body choose raw, JSON. Enter `{ "password" : "newpassword","mobtoken" : "new token value"}` type either or both. Being Signed In is required!

*******************************************************************************************************************************************************************************

Delete User - DONE From Postman choose DELETE method. Request URL: localhost:1337/users/remove In the Header: type "Authorization" into key column type "Bearer " + save token from Sign In function
Being Signed In is required!
