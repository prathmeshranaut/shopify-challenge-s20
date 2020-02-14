# Shopify Summer 2020 Backend Developer Challenge

```
git clone https://github.com/prathmeshranaut/shopify-challenge-s20.git
cd shopify-challenge-s20
npm install
npm start
```


## API Endpoints 

|Endpoint| Description |
| --- | --- |
| `GET` /image | Returns a paginated list of all images. <br> Query params: <br> `page`(Default=1): Int |
| `GET` /image/:imageId | Renders the image in it's respective mime-type. | 
| `POST`/image/create | Create a new image for your user. <br> Options: <ul><li>**title**: title for the image</li> <li>**image**: image file to be uploaded</li> <li>**isPrivate**: 1 or 0 to specify if the picture can be viewed by anyone.</li></ul>|
| `POST`/image/create-bulk | Create multiple images at once for a user. Limit upto 5 at once. <br> Options: <ul><li>**title**: title for the image</li> <li>**image**: image file to be uploaded. Treat it as an array when uploading multiple images. </li> <li>**isPrivate**: 1 or 0 to specify if the picture can be viewed by anyone.</li></ul>|
| `POST`/auth/login | Generate an authorization token for the user. <br> Options: <ul><li>**username**: Username for login</li> <li>**password**: Password for the given username</li></ul>|
| `PUT`/auth/signup | Create a new user. <br> Options: <ul><li>**username**: Username for login</li> <li>**password**: Password for the given username</li></ul>|
| `DELETE` /image/:imageId | Deletes the image if you uploaded the image. |


#### Note: All endpoints except the `auth/*` require an `Authorization` header with value `Bearer {tokenId}`