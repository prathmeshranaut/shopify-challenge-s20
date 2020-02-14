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
| `POST`/image/create | Create a new image for your user. <br> Options: <ul><li>**title**: title for the image</li> <li>**image**: image file to be uplaoded</li> <li>**isPrivate**: 1 or 0 to specify if the picture can be viewed by anyone.</li></ul>|


#### Note: All endpoints except the `auth/*` require an `Authorization` header with value `Bearer {tokenId}`