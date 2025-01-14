# API for Sharing Stories

> API designed for posting and sharing short stories, similar to tweet-style posts.

## Endpoint
`https://sharing-stories.vercel.app/api`
### Register
- URL
    - `/register`
- Method
    - `POST`
- Request Body
    - `name` as `string`
    - `email` as `string`, must be unique
    - `password` as `string`, must be at least 8 characters
- Response
```
{
	"error": false,
	"message": "User created"
}
```

### Login
- URL
    - `/login`
- Method
    - `POST`
- Request Body
    - `email` as `string`
    - `password` as `string`
- Response
```
{
	"error": false,
	"message": "Success",
	"loginResult": {
		"userId": 127,
		"name": "Thana Nami",
		"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTI3LCJuYW1lIjoiVGhhbmEgTmFtaSIsImVtYWlsIjoidGhhbmFuYW1pQGdtYWlsLmNvbSIsImlhdCI6MTczNTMwNDc1MywiZXhwIjoxNzM1MzA4MzUzfQ.iCALRmtTAyAJcWOGLqwmW04yK5wph1H2_xVGF0UjMH0"
	}
}
```

### Add New Story
- URL
    - `/stories`
- Method
    - `POST`
- Headers
    - `Authorization`: `Bearer <token>`
- Request Body
    - `description` as `string`, max length 255 char
- Response
```
{
	"error": false,
	"message": "Success",
}
```

### Get All Story
- URL
    - `/stories`
- Method
    - `GET`
- Headers
    - `Authorization`: `Bearer <token>`
- Response
```
{
	"error": false,
	"message": "Story fetched successfully",
	"listStory": [
		{
			"storyId": 13,
			"name": "Thana Nami",
			"description": "I think today is cold",
			"createdAt": "2024-12-28T13:22:27.000Z"
		}
	]
}
```

### Detail Story
- URL
    - `/stories/:id`
- Method
    - `GET`
- Headers
    - `Authorization`: `Bearer <token>`
- Response
```
{
	"error": false,
	"message": "Story fetched successfully",
	"story": {
		"storyId": 13,
		"name": "Thana Nami",
		"description": "I think today is cold",
		"createdAt": "2024-12-28T13:22:27.000Z"
	}
}
```

## Infrastructure

- **API Performance Testing:** [K6](https://github.com/nuazsa/UsingK6)  
- **Database:** MySQL    
- **Deployment:** Vercel, Clever Cloud  
- **Language:** JavaScript  
- **Libraries:** Express, CORS, JWT, Bcrypt, Joi 
- **Server-side:** NodeJS
