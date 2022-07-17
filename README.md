



## What is clothing store?
 this a simple online cloting project to buy the clothes from the ecomstore how to to manage the user data and send the promotion information





## Environment Variables
In order to build the docker images there are some required environment variables to use.

To setup the variables just use the convention for cloudinary, maail_trap and mongodb:config projects:

```
.env                # loaded in all cases

 Below the required env variables:


PORT =4000
DB_URL=mongodb://127.0.0.1:27017/ecomstore
JWT_SECRET =thisismyjwtsecret
JWT_EXPIRY =3d
COOKIE_TIME=3




## Available resources
| Resource| Link        |
| ------- | ----------- |
| `APIs (swagger)`  | http://localhost:4000/api-docs/ |
| `localhost`  | http://localhost:4000/signup |
| `docker`  | http://localhost:3000/login |


