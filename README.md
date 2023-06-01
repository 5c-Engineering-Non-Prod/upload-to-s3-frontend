
# File upload - AWS S3 




## Installation

Setup your react app using vite/cra/nextjs/remix

Add the AWS S3 client package 
```
  yarn add @aws-sdk/client-s3
```
    

## Usage/Examples

```javascript
import React , {useState} from 'react';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

const s3Client = new S3Client({
    region: "ap-south-1",
    credentials: {
      accessKeyId: process.env.REACT_APP_ACCESS_KEY,
      secretAccessKey:process.env.REACT_APP_SECRET_KEY,
    },
  });


const Upload = () => {

    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileInput = (e) => {
        setSelectedFile(e.target.files[0]);
    }

    const uploadFile = async (file) => {
        console.log({file});
        const params = {
            Bucket: "remod-123",
            Key: file.name,
            Body: file,
            //Adding meta data for files
            ContentType: file.type, // Defines type
            ContentDisposition :"inline" // Allows to display files in browser
          };
        const command = new PutObjectCommand(params);
        try {
            const response = await s3Client.send(command);
            console.log(`File uploaded successfully. ETag: ${response}`,response);
          } catch (err) {
            console.log("Error", err);
          }
    
    }
    return <div>
        <div>React S3 File Upload</div>
        <input type="file" onChange={handleFileInput}/>
        <br></br>
        <button onClick={() => uploadFile(selectedFile)}> Upload to S3</button>
    </div>
}

export default Upload;
```


## Setting up AWS S3

Create a new bucket in s3 with all default values.

To access the s3 bucket , add a CORS policy.

```
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "GET",
            "PUT",
            "POST",
            "DELETE"
        ],
        "AllowedOrigins": [
            "*"
        ],
        "ExposeHeaders": []
    }
]
```
With the above configuration setup you can upload the files easily to s3 now.

## Adding Cloudfront

* Create a new cloudfront distribution.
* Choose your s3 bucket as your origin domain.
* Select origin access control settings and create your control settings.
* Copy the policy generated and save it.

Now go to your s3 bucket , click on permissions and
edit the bucket policy.
Paste the copied policy from cloudfront.

After the above settings , now you can use the cloudfront distribution domain name to access your s3 bucket files.

Eg: ``` https://${distributionDomainName}${/file/path/s3}```

## Further reading

We can also create signed URLs with keypairs.

```javascript
const { CloudFrontClient, GetSignedUrlCommand } = require("@aws-sdk/client-cloudfront");
const cloudFrontClient = new CloudFrontClient({ region: "us-east-1" });

const params = {
  url: "https://example.com/image.jpg",
  keyPairId: "APKA1234567890",
  expires: Math.floor(Date.now() / 1000) + 3600 // URL expiration time (in seconds)
};

const command = new GetSignedUrlCommand(params);
const signedUrl = await cloudFrontClient.send(command);

console.log("Signed URL:", signedUrl);
```
