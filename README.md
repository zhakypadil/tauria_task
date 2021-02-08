# tauria_task

Initial assignment from Tauria for Junior Software Engineer Position

# FIRST HALF

Tech Used: Express, Typescript, Mongoose, bcryptjs, jsonwebtoken

Tasks completed:

## Get users - DONE

<br/> From Postman choose GET method. Request URL: localhost:1337/users/get/all

---

## Get user - DONE

<br/>From Postman choose GET method. Request URL: localhost:1337/users/get/one?username='username string' <br/> 'username string' is the username being searched. Must be Typed!

---

## Register - DONE

<br/>From Postman choose POST method. Request URL: localhost:1337/users/register <br/> In the Body choose raw, JSON. <br/> Enter

```json
{
    "username": "user1",
    "password": "password",
    "mobtoken": ""
}
```

username and password are required, mobtoken is optional. <br/>

---

## Sign In - DONE

<br/>From Postman choose POST method. Request URL: localhost:1337/users/login <br/> In the Body choose raw, JSON. <br/> Enter

```json
{
    "username": "user1",
    "password": "password"
}
```

username and password are required.

---

## Update User - DONE

<br/> From Postman choose PUT method. Request URL: localhost:1337/users/update <br/> In the Body choose raw, JSON. <br/> <br/> Enter:

```json
{
    "password": "newpassword",
    "mobtoken": "new token value"
}
```

type either or both. Being Signed In is required!

---

## Delete User - DONE

<br/> From Postman choose DELETE method. Request URL: localhost:1337/users/remove <br/> Being Signed In is required!
