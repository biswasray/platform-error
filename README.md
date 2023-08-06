# NodeJs Server Error Handler

- PlatformError is a Node.js library that allows you to easily throw HTTP errors that can be serialized and sent in server responses.
- This library is useful for creating error objects that can be sent as JSON responses to client-side applications.
- User can also throw Custom error with custom messages.

## Installation

To install , use NPM:

```bash
npm install platform-error
```

## Usage

To create a platform error, import the PlatformError class and create an error object to throw.

```javascript
import PlatformError from "platform-error";

throw new PlatformError("Bad Request", { messages: "Query limit must be numeric" });
```

To throw error as server response user need `express-async-errors`

### Following these steps for server response

- Install "express-async-errors" , and import on server file

```bash
npm install express-async-errors --save
```

```javascript
import "express-async-errors";
```

- Import `ExpressErrorHandler` middleware and use it at last of routing.

```javascript
import { ExpressErrorHandler } from "platform-error";

const app = express();
...
...
...
app.use(ExpressErrorHandler());
// If you want log error before response
app.use(ExpressErrorHandler(true));
// If you have custom logger function
app.use(ExpressErrorHandler(logger));

app.listen(process.env.PORT,()=> {
    console.log(`Server running on ${process.env.PORT}....`)
});

```

- Create and throw error

```javascript
app.post('/user/:id', (request: Request,response: Response)=> {
    ...
    ...
    throw new PlatformError("Unauthorized", { messages: "You are not authorized to access this resource" });
});

app.post('/user/signin', (request: Request,response: Response)=> {
    ...
    ...
    throw new PlatformError("Not Found", { messages: "Username does not exist", resource: "User" });
});

app.post('/user/signup', (request: Request,response: Response)=> {
    ...
    ...
    throw new PlatformError("Bad Request", { messages: ["Invalid Email","Password must contain alphanumerics"] });
});
```

- User can throw custom error.

```javascript
app.get('/user', (request: Request,response: Response)=> {
    ...
    ...
    throw new CustomError(500, ["Something is wrong!"]);
});
```

## License

All code in this repository is released under the terms of the ISC license.
